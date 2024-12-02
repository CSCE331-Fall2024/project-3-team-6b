import React, { useState, useEffect } from 'react';


interface Employee {
    employee_id: string;
    name: string;
    salary: number;
    position: string;
  }

interface ModalProps {
    onClose: () => void;
    onSave: (data: Partial<Employee>) => void;
    onConfirmRemove: () => void;
    initialData?: Partial<Employee>;
    action: 'add' | 'update' | 'remove' | null;
    }
  
  const Modal: React.FC<ModalProps> = ({
    onClose,
    onSave,
    onConfirmRemove,
    initialData,
    action,
  }) => {
    const [formData, setFormData] = useState<Partial<Employee>>({
      employee_id: '',
      name: '',
      salary: 0,
      position: '',
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
    
      const filteredData = { ...formData };
    
      onSave(filteredData);
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
              <label>Id:</label>
              <input
                type="text"
                name="employee_id"
                value={formData.employee_id || ''}
                onChange={handleChange}
                required
              />
            </div>
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
                <label>Salary:</label>
                <input
                    type="number"
                    name="salary"
                    value={formData.salary || 0}
                    onChange={handleChange}
                    required
                />
                </div>
    

            <div>
                <label>Position:</label>
                <input
                    type="text"
                    name="position"
                    value={formData.position || ''}
                    onChange={handleChange}
                    required
                />
            </div>

            
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
  