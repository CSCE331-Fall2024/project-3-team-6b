import React, { useState } from 'react';
import { MenuItem, Order, OrderItem } from '@/types';
import { PlusCircle, Receipt } from 'lucide-react';

interface CheckoutProps {
  menuItems: MenuItem[];
  onCreateOrder: (order: Partial<Order>) => void;
  activeOrder: Order | null;
}

export default function EnhancedCheckout({ menuItems, onCreateOrder }: CheckoutProps) {
  const [draftOrders, setDraftOrders] = useState<Array<{
    id: string;
    items: OrderItem[];
    createdAt: Date;
  }>>([]);
  
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [selectedTipPercent, setSelectedTipPercent] = useState<number | null>(null);
  const [selectedSplit, setSelectedSplit] = useState<number | null>(null); // State for split bill
  const [customTipAmount, setCustomTipAmount] = useState<string>('');
  const [completedSplits, setCompletedSplits] = useState<number>(0); // State to track completed parts of split

  const currentItems = draftOrders.find(d => d.id === activeDraftId)?.items || [];
  
  const TAX_RATE = 0.0825;
  const TIP_PERCENTAGES = [15, 18, 20];

  const createNewDraft = () => {
    const newDraft = {
      id: `draft-${Date.now()}`,
      items: [],
      createdAt: new Date(),
    };
    
    setDraftOrders(prev => [...prev, newDraft]);
    setActiveDraftId(newDraft.id);
    
    // Reset both tip and split bill selections when a new draft is created
    setSelectedTipPercent(null);
    setCustomTipAmount('');
    setSelectedSplit(null); // Reset split bill on new draft
    setCompletedSplits(0); // Reset completed split count
  };

  const addItem = (menuItem: MenuItem) => {
    if (!activeDraftId) {
      const newDraft = {
        id: `draft-${Date.now()}`,
        items: [{
          menuItemId: menuItem.id,
          name: menuItem.name,
          quantity: 1,
          price: menuItem.price
        }],
        createdAt: new Date(),
      };
      setDraftOrders([newDraft]);
      setActiveDraftId(newDraft.id);
      return;
    }

    setDraftOrders(prev => prev.map(draft => {
      if (draft.id !== activeDraftId) return draft;
      
      const existingItem = draft.items.find(item => item.menuItemId === menuItem.id);
      if (existingItem) {
        return {
          ...draft,
          items: draft.items.map(item =>
            item.menuItemId === menuItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      } else {
        return {
          ...draft,
          items: [...draft.items, {
            menuItemId: menuItem.id,
            name: menuItem.name,
            quantity: 1,
            price: menuItem.price
          }]
        };
      }
    }));
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    setDraftOrders(prev => prev.map(draft => {
      if (draft.id !== activeDraftId) return draft;
      
      if (quantity < 1) {
        return {
          ...draft,
          items: draft.items.filter(item => item.menuItemId !== menuItemId)
        };
      }

      return {
        ...draft,
        items: draft.items.map(item =>
          item.menuItemId === menuItemId
            ? { ...item, quantity }
            : item
        )
      };
    }));
  };

  const handleTipPercentSelect = (percent: number) => {
    setSelectedTipPercent(percent);
    setCustomTipAmount(''); // Reset custom tip amount when a percentage is selected
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
    const tax = subtotal * TAX_RATE;
    
    let tipAmount = 0;
    if (selectedTipPercent) {
      tipAmount = (subtotal * selectedTipPercent) / 100;
    } else if (customTipAmount) {
      tipAmount = parseFloat(customTipAmount) || 0;
    }
    
    const total = subtotal + tax + tipAmount;
    return { subtotal, tax, tipAmount, total };
  };

  const handleCheckout = (index: number) => {
    // If it's the last split, complete the entire order
    if (index === (selectedSplit || 1) - 1) {
      const { subtotal, tax, tipAmount, total } = calculateTotals(currentItems);
      onCreateOrder({
        items: currentItems,
        subtotal,
        tax,
        tip: tipAmount,
        total,
        status: 'pending'
      });
      setDraftOrders(prev => prev.filter(d => d.id !== activeDraftId));
      setActiveDraftId(null);
      setSelectedTipPercent(null);
      setCustomTipAmount('');
      setSelectedSplit(null); // Reset split selection on checkout
      setCompletedSplits(0); // Reset completed split count
    } else {
      // Increment the completedSplits count to disable the current button
      setCompletedSplits(prev => prev + 1);
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
                ? 'bg-[var(--panda-red)] text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Receipt className="w-4 h-4" />
            Order ({draft.items.reduce((sum, item) => sum + item.quantity, 0)} items)
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
                    ? 'bg-white hover:shadow-md'
                    : 'bg-gray-100 cursor-not-allowed'
                }`}
              >
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="w-96 bg-white rounded-lg shadow-md p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">
            {activeDraftId ? 'Current Order' : 'No Active Order'}
          </h2>
          {currentItems.length > 0 ? (
            <>
              <div className="space-y-4 mb-6">
                {currentItems.map((item) => (
                  <div key={item.menuItemId} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
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
                          ? 'bg-[var(--panda-red)] text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
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
                          ? 'bg-[var(--panda-red)] text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
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
                  <span>${calculateTotals(currentItems).subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${calculateTotals(currentItems).tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tip</span>
                  <span>${calculateTotals(currentItems).tipAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${calculateTotals(currentItems).total.toFixed(2)}</span>
                </div>

                {/* Render "Complete Order" buttons based on selectedSplit */}
                <div className="space-y-4 mt-6">
                  {Array(selectedSplit || 1).fill(null).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleCheckout(index)}
                      className={`w-full px-4 py-2 rounded-lg transition-colors ${
                        index < completedSplits
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-[var(--panda-red)] text-white hover:bg-[var(--panda-dark-red)]'
                      }`}
                      disabled={index < completedSplits} // Disable buttons that have been clicked
                    >
                      Complete Order {selectedSplit && selectedSplit > 1 ? `(${index + 1}/${selectedSplit})` : ''}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500">
              {activeDraftId ? 'No items selected' : 'Select "New Order" to begin'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
