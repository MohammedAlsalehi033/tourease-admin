"use client";

import React, { useState, useEffect } from 'react';

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/api/items');
        if (!response.ok) {
          throw new Error('Failed to fetch items. Please try again.');
        }
        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          <p className="font-bold">An error occurred:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Items from API</h1>
      {items.length > 0 ? (
        <ul className="list-disc list-inside bg-gray-50 p-4 rounded-lg shadow">
          {items.map((item) => (
            <li key={item.id} className="py-2 border-b last:border-b-0">
              {item.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No items found.</p>
      )}
    </div>
  );
};

export default ItemsPage;
