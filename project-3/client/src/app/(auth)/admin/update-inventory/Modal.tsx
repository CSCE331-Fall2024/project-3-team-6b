import React, { useState, useEffect } from 'react';


interface MenuItem {
    id: number;
    name: string;
    category: string;
    price: number;
    count: number;
    type: boolean | null;
  }

interface ModalProps {
    onClose: () => void;
    onSave: (data: Partial<MenuItem>) => void;
    onConfirmRemove: () => void;
    initialData?: Partial<MenuItem>;
    action: 'add' | 'update' | 'remove' | null;
    }
  
  const Modal: React.FC<ModalProps> = ({
    onClose,
    onSave,
    onConfirmRemove,
    initialData,
    action,
  }) => {
    const [formData, setFormData] = useState<Partial<MenuItem>>({
      name: '',
      category: '',
      price: 0,
      count: 0,
      type: false,
      ...initialData, // Populate form data if updating
    });
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (action === 'add' || action === 'update') {
        onSave(formData);
      }
    };
  
    const handleRemove = () => {
      onConfirmRemove();
    };
  
    useEffect(() => {
      if (action === 'update' && initialData) {
        setFormData({ ...initialData });
      }
    }, [action, initialData]);
  
    const renderForm = () => {
      if (action === 'add' || action === 'update') {
        return (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Category:</label>
              <input
                type="text"
                name="category"
                value={formData.category || ''}
                onChange={handleChange}
                required
              />
            </div>
            {/* Show Price input only if category is not "free_items" or "raw_items" */}
            {(formData.category !== 'free_items' && formData.category !== 'raw_items') && (
                <div>
                <label>Price:</label>
                <input
                    type="number"
                    name="price"
                    value={formData.price || ''}
                    onChange={handleChange}
                    required
                />
                </div>
            )}

            <div>
                <label>Inventory Count:</label>
                <input
                    type="number"
                    name="count"
                    value={formData.count || ''}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Show Type checkbox only if category is "entree_side" */}
            {formData.category === 'entree_side' && (
                <div>
                    <label>Type (Entree Item?):</label>
                    <input
                        type="checkbox"
                        name="type"
                        checked={formData.type || false}
                        onChange={(e) =>
                        setFormData((prevData) => ({
                            ...prevData,
                            type: e.target.checked,
                        }))
                        }
                    />
                </div>
            )}
                    <div>
                    <button type="submit">
                        {action === 'add' ? 'Add Item' : 'Update Item'}
                    </button>
                    </div>
                </form>
            );
        
      } 
      else if (action === 'remove' && initialData) {
        return (
          <div>
            <p>Are you sure you want to remove {initialData.name}?</p>
            <div>
              <button onClick={handleRemove}>Yes, Remove</button>
              <button onClick={onClose}>Cancel</button>
            </div>
          </div>
        );
      }
  
      return null;
    };
  
    return (
      <div className="modal-overlay">
        <div className="modal">
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
          {renderForm()}
        </div>
      </div>
    );
  };
  
  export default Modal;
  