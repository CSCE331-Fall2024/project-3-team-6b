import React, { useState, useEffect } from "react";
import { MenuItem, Order, OrderItem } from "@/types";
import { PlusCircle, Receipt, CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/cashier/dialog";

interface CheckoutProps {
  menuItems: MenuItem[];
  onCreateOrder: (order: Partial<Order>) => void;
  activeOrder: Order | null;
}

interface WeatherData {
  main: {
    temp: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
}

interface ComboSelection {
  entrees: MenuItem[];
  side?: MenuItem;
  maxEntrees: number;
}

export default function EnhancedCheckout({
  menuItems,
  onCreateOrder,
}: CheckoutProps) {
  const [draftOrders, setDraftOrders] = useState<
    Array<{
      id: string;
      items: OrderItem[];
      createdAt: Date;
    }>
  >([]);

  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [selectedTipPercent, setSelectedTipPercent] = useState<number | null>(
    null
  );
  const [selectedSplit, setSelectedSplit] = useState<number | null>(null); // State for split bill
  const [customTipAmount, setCustomTipAmount] = useState<string>("");
  const [completedSplits, setCompletedSplits] = useState<number>(0); // State to track completed parts of split
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentPaymentAmount, setCurrentPaymentAmount] = useState<number>(0);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const [currentComboSelection, setCurrentComboSelection] =
    useState<ComboSelection>({
      entrees: [],
      maxEntrees: 1,
    });
  const [selectedComboBase, setSelectedComboBase] = useState<MenuItem | null>(
    null
  );

  const currentItems =
    draftOrders.find((d) => d.id === activeDraftId)?.items || [];

  const TAX_RATE = 0.0825;
  const TIP_PERCENTAGES = [15, 18, 20];

  const entrees = menuItems.filter((item) => item.category === "entree");
  const sides = menuItems.filter((item) => item.category === "side");

  const getComboRequirements = (
    comboType: string
  ): { maxEntrees: number; name: string } => {
    switch (comboType.toLowerCase()) {
      case "bowl":
        return { maxEntrees: 1, name: "Bowl" };
      case "plate":
        return { maxEntrees: 2, name: "Plate" };
      case "bigger plate":
        return { maxEntrees: 3, name: "Bigger Plate" };
      default:
        return { maxEntrees: 1, name: "Combo" };
    }
  };

  useEffect(() => {
    const COLLEGE_STATION = { lat: 30.628, lon: -96.3344 };
    const fetchWeather = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
        if (!apiKey) throw new Error("API key missing");
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${COLLEGE_STATION.lat}&lon=${COLLEGE_STATION.lon}&appid=${apiKey}&units=imperial`
        );
        if (!response.ok) throw new Error("Failed to fetch weather data");
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Weather fetch error:", error);
      }
    };
    fetchWeather();
  }, []);

  const createNewDraft = () => {
    const newDraft = {
      id: `draft-${Date.now()}`,
      items: [],
      createdAt: new Date(),
    };

    setDraftOrders((prev) => [...prev, newDraft]);
    setActiveDraftId(newDraft.id);

    // Reset both tip and split bill selections when a new draft is created
    setSelectedTipPercent(null);
    setCustomTipAmount("");
    setSelectedSplit(null); // Reset split bill on new draft
    setCompletedSplits(0); // Reset completed split count
  };

  const handleComboClick = (comboItem: MenuItem) => {
    const { maxEntrees } = getComboRequirements(comboItem.name);
    setSelectedComboBase(comboItem);
    setCurrentComboSelection({
      entrees: [],
      maxEntrees,
    });
    setIsComboModalOpen(true);
  };

  const handleEntreeSelection = (entree: MenuItem) => {
    setCurrentComboSelection((prev) => {
      const existingIndex = prev.entrees.findIndex((e) => e.id === entree.id);

      if (existingIndex >= 0) {
        // Remove the entree if it's already selected
        return {
          ...prev,
          entrees: prev.entrees.filter((_, index) => index !== existingIndex),
        };
      }

      if (prev.entrees.length >= prev.maxEntrees) {
        // Remove the first entree if we're at max capacity
        return {
          ...prev,
          entrees: [...prev.entrees.slice(1), entree],
        };
      }

      // Add the new entree
      return {
        ...prev,
        entrees: [...prev.entrees, entree],
      };
    });
  };

  const addComboToOrder = () => {
    if (
      !activeDraftId ||
      !selectedComboBase ||
      currentComboSelection.entrees.length !==
        currentComboSelection.maxEntrees ||
      !currentComboSelection.side
    )
      return;

    const entreeNames = currentComboSelection.entrees
      .map((e) => e.name)
      .join(", ");
    const comboName = `${selectedComboBase.name} (${entreeNames}, ${currentComboSelection.side.name})`;

    setDraftOrders((prev) =>
      prev.map((draft) => {
        if (draft.id !== activeDraftId) return draft;

        return {
          ...draft,
          items: [
            ...draft.items,
            {
              menuItemId: selectedComboBase.id,
              name: comboName,
              quantity: 1,
              price: selectedComboBase.price,
            },
          ],
        };
      })
    );

    setIsComboModalOpen(false);
    setCurrentComboSelection({ entrees: [], maxEntrees: 1 });
    setSelectedComboBase(null);
  };

  const addItem = (menuItem: MenuItem) => {
    if (menuItem.category === "combo") {
      handleComboClick(menuItem);
      return;
    }

    if (!activeDraftId) {
      const newDraft = {
        id: `draft-${Date.now()}`,
        items: [
          {
            menuItemId: menuItem.id,
            name: menuItem.name,
            quantity: 1,
            price: menuItem.price,
          },
        ],
        createdAt: new Date(),
      };
      setDraftOrders([newDraft]);
      setActiveDraftId(newDraft.id);
      return;
    }

    setDraftOrders((prev) =>
      prev.map((draft) => {
        if (draft.id !== activeDraftId) return draft;

        const existingItem = draft.items.find(
          (item) => item.menuItemId === menuItem.id
        );
        if (existingItem) {
          return {
            ...draft,
            items: draft.items.map((item) =>
              item.menuItemId === menuItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        } else {
          return {
            ...draft,
            items: [
              ...draft.items,
              {
                menuItemId: menuItem.id,
                name: menuItem.name,
                quantity: 1,
                price: menuItem.price,
              },
            ],
          };
        }
      })
    );
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    setDraftOrders((prev) =>
      prev.map((draft) => {
        if (draft.id !== activeDraftId) return draft;

        if (quantity < 1) {
          return {
            ...draft,
            items: draft.items.filter((item) => item.menuItemId !== menuItemId),
          };
        }

        return {
          ...draft,
          items: draft.items.map((item) =>
            item.menuItemId === menuItemId ? { ...item, quantity } : item
          ),
        };
      })
    );
  };

  const handleTipPercentSelect = (percent: number) => {
    setSelectedTipPercent(percent);
    setCustomTipAmount(""); // Reset custom tip amount when a percentage is selected
  };

  const handleCustomTipChange = (value: string) => {
    setCustomTipAmount(value);
    setSelectedTipPercent(null); // Clear percentage tip when custom tip is entered
  };

  const handleSplitSelect = (num: number) => {
    setSelectedSplit(num); // Set selected split bill option
    setCompletedSplits(0); // Reset completed split count when split selection changes
  };

  const calculateTotals = (items: OrderItem[]) => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    let discount = 0;
    if (weather) {
      const weatherMain = weather.weather[0]?.main.toLowerCase();
      const temperature = weather.main?.temp;

      if (weatherMain.includes("rain")) {
        discount = subtotal * 0.1; // 10% off
      } else if (temperature < 50) {
        discount = subtotal * 0.15; // 15% off
      } else if (weatherMain.includes("clear")) {
        discount = subtotal * 0.05; // 5% off
      }
    }

    const discountedSubtotal = subtotal - discount;
    const tax = discountedSubtotal * TAX_RATE;

    let tipAmount = 0;
    if (selectedTipPercent) {
      tipAmount = (discountedSubtotal * selectedTipPercent) / 100;
    } else if (customTipAmount) {
      tipAmount = parseFloat(customTipAmount) || 0;
    }

    const total = discountedSubtotal + tax + tipAmount;

    return { subtotal, discount, discountedSubtotal, tax, tipAmount, total };
  };

  const handleCheckout = (index: number) => {
    const { total } = calculateTotals(currentItems);
    const splitAmount = selectedSplit ? total / selectedSplit : total;
    setCurrentPaymentAmount(splitAmount);
    setIsPaymentModalOpen(true);
  };

  const processPayment = async () => {
    setProcessingPayment(true);

    try {
      // Calculate all totals
      const { subtotal, tax, tipAmount, total } = calculateTotals(currentItems);

      // Format items with required category information
      const formattedItems = currentItems.map((item) => {
        let category;
        // Determine category based on item type or ID prefixes
        if (item.menuItemId.startsWith("drink")) {
          category = "drink";
        } else if (item.menuItemId.startsWith("app")) {
          category = "appetizer";
        } else if (item.menuItemId.startsWith("side")) {
          category = "side";
        } else {
          category = "entree";
        }

        return {
          ...item,
          category,
        };
      });

      // Prepare order data
      const orderData = {
        items: formattedItems,
        subtotal,
        tax,
        tip: tipAmount,
        total,
        status: "pending",
      };

      // Send order to backend
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      // Handle successful order
      const result = await response.json();

      if (result.success) {
        // Clear current order
        setDraftOrders((prev) => prev.filter((d) => d.id !== activeDraftId));
        setActiveDraftId(null);

        // Reset payment-related states
        setSelectedTipPercent(null);
        setCustomTipAmount("");
        setSelectedSplit(null);
        setCompletedSplits(0);

        // Show success message or trigger receipt print
        // You can add success notification here
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      // Show error message to user
    } finally {
      setProcessingPayment(false);
      setIsPaymentModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={createNewDraft}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          New Order
        </button>
        {draftOrders.map((draft) => (
          <button
            key={draft.id}
            onClick={() => setActiveDraftId(draft.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeDraftId === draft.id
                ? "bg-[var(--panda-red)] text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <Receipt className="w-4 h-4" />
            Order ({draft.items.reduce(
              (sum, item) => sum + item.quantity,
              0
            )}{" "}
            items)
          </button>
        ))}
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Menu Items</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => addItem(item)}
                disabled={!item.available}
                className={`p-4 rounded-lg text-left transition-all ${
                  item.available
                    ? "bg-white hover:shadow-md"
                    : "bg-gray-100 cursor-not-allowed"
                }`}
              >
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  ${item.price.toFixed(2)}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="w-96 bg-white rounded-lg shadow-md p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">
            {activeDraftId ? "Current Order" : "No Active Order"}
          </h2>
          {currentItems.length > 0 ? (
            <>
              <div className="space-y-4 mb-6">
                {currentItems.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.menuItemId, item.quantity - 1)
                        }
                        className="text-gray-500 hover:text-gray-700"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.menuItemId, item.quantity + 1)
                        }
                        className="text-gray-500 hover:text-gray-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-4">
                <h3 className="font-semibold mb-2">Add Tip</h3>
                <div className="flex gap-2 mb-3">
                  {TIP_PERCENTAGES.map((percent) => (
                    <button
                      key={percent}
                      onClick={() => handleTipPercentSelect(percent)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm ${
                        selectedTipPercent === percent
                          ? "bg-[var(--panda-red)] text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {percent}%
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">$</span>
                  <input
                    type="number"
                    value={customTipAmount}
                    onChange={(e) => handleCustomTipChange(e.target.value)}
                    placeholder="Custom amount"
                    className="w-full p-2 border rounded-lg text-sm"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <h3 className="font-semibold mb-2">Split Bill</h3>
                <div className="flex gap-2 mb-3">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleSplitSelect(num)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm ${
                        selectedSplit === num
                          ? "bg-[var(--panda-red)] text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    ${calculateTotals(currentItems).subtotal.toFixed(2)}
                  </span>
                </div>
                {calculateTotals(currentItems).discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>
                      -${calculateTotals(currentItems).discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Discounted Subtotal</span>
                  <span>
                    $
                    {calculateTotals(currentItems).discountedSubtotal.toFixed(
                      2
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${calculateTotals(currentItems).tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tip</span>
                  <span>
                    ${calculateTotals(currentItems).tipAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${calculateTotals(currentItems).total.toFixed(2)}</span>
                </div>

                <div className="space-y-4 mt-6">
                  {Array(selectedSplit || 1)
                    .fill(null)
                    .map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleCheckout(index)}
                        className={`w-full px-4 py-2 rounded-lg transition-colors ${
                          index < completedSplits
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-[var(--panda-red)] text-white hover:bg-[var(--panda-dark-red)]"
                        }`}
                        disabled={index < completedSplits}
                      >
                        Complete Order{" "}
                        {selectedSplit && selectedSplit > 1
                          ? `(${index + 1}/${selectedSplit})`
                          : ""}
                      </button>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500">
              {activeDraftId
                ? "No items selected"
                : 'Select "New Order" to begin'}
            </p>
          )}
        </div>
      </div>

      <Dialog open={isComboModalOpen} onOpenChange={setIsComboModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle>Customize Your {selectedComboBase?.name}</DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <div className="mb-6">
              <h3 className="font-semibold mb-2">
                Select{" "}
                {currentComboSelection.maxEntrees > 1
                  ? `Entrees (${currentComboSelection.entrees.length}/${currentComboSelection.maxEntrees})`
                  : "Entree"}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {entrees.map((entree) => (
                  <button
                    key={entree.id}
                    onClick={() => handleEntreeSelection(entree)}
                    className={`p-2 rounded-lg text-left ${
                      currentComboSelection.entrees.some(
                        (e) => e.id === entree.id
                      )
                        ? "bg-[var(--panda-red)] text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {entree.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Select Side</h3>
              <div className="grid grid-cols-2 gap-2">
                {sides.map((side) => (
                  <button
                    key={side.id}
                    onClick={() =>
                      setCurrentComboSelection((prev) => ({ ...prev, side }))
                    }
                    className={`p-2 rounded-lg text-left ${
                      currentComboSelection.side?.id === side.id
                        ? "bg-[var(--panda-red)] text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {side.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={addComboToOrder}
              disabled={
                currentComboSelection.entrees.length !==
                  currentComboSelection.maxEntrees ||
                !currentComboSelection.side
              }
              className="w-full px-4 py-2 rounded-lg bg-[var(--panda-red)] text-white hover:bg-[var(--panda-dark-red)] disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add to Order
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <div className="text-center mb-6">
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <h3 className="text-2xl font-bold mb-2">
                ${currentPaymentAmount.toFixed(2)}
              </h3>
              {selectedSplit && selectedSplit > 1 && (
                <p className="text-sm text-gray-600">
                  Split {completedSplits + 1} of {selectedSplit}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <button
                onClick={processPayment}
                disabled={processingPayment}
                className="w-full px-4 py-3 rounded-lg bg-[var(--panda-red)] text-white hover:bg-[var(--panda-dark-red)] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {processingPayment ? (
                  <span>Processing...</span>
                ) : (
                  <span>Process Payment</span>
                )}
              </button>

              <button
                onClick={() => setIsPaymentModalOpen(false)}
                disabled={processingPayment}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
