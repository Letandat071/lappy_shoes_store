"use client";

import React from 'react';

interface Address {
  id: string;
  type: string;
  street: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const SavedAddresses = () => {
  const addresses: Address[] = [
    {
      id: '1',
      type: 'Home',
      street: '123 Main Street',
      apartment: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    }
  ];

  const handleEdit = (id: string) => {
    // Implement edit address logic
    console.log('Editing address:', id);
  };

  const handleDelete = (id: string) => {
    // Implement delete address logic
    console.log('Deleting address:', id);
  };

  const handleAddNew = () => {
    // Implement add new address logic
    console.log('Adding new address');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Saved Addresses</h3>
        <button 
          onClick={handleAddNew}
          className="text-black hover:underline"
        >
          Add New
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div key={address.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold">{address.type}</h4>
              <div className="space-x-2">
                <button 
                  onClick={() => handleEdit(address.id)}
                  className="text-gray-600 hover:text-black"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button 
                  onClick={() => handleDelete(address.id)}
                  className="text-gray-600 hover:text-red-600"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <p className="text-gray-600">
              {address.street}<br />
              {address.apartment}<br />
              {address.city}, {address.state} {address.zipCode}<br />
              {address.country}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedAddresses; 