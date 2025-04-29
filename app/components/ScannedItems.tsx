'use client';

import { Item } from './BillSplitter';

interface ScannedItemsProps {
  items: Item[];
  onReset: () => void;
}

export default function ScannedItems({ items, onReset }: ScannedItemsProps) {
  // Calculate the total for the bill
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Scanned Items</h2>
        <button 
          onClick={onReset}
          className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
        >
          Upload New Image
        </button>
      </div>
      <div className="bg-white rounded-lg p-3">
        <div className="grid grid-cols-1 gap-1">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between py-1">
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-sm">${item.price.toFixed(2)}</span>
            </div>
          ))}
          
          <div className="flex items-center justify-between pt-2 font-bold">
            <span className="text-sm">Total</span>
            <span className="text-sm">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 