'use client';

import { useState, useEffect } from 'react';
import UploadBill from './components/UploadBill';
import { BillSplitter } from './components/BillSplitter';
import ScannedItems from './components/ScannedItems';
import { Item } from './components/BillSplitter';

export default function Home() {
  const [billScanned, setBillScanned] = useState(false);
  const [items, setItems] = useState<Item[]>([]);

  // Listen for billScanned event
  useEffect(() => {
    const handleBillScanned = (e: CustomEvent) => {
      setBillScanned(true);
      setItems(e.detail.items);
    };

    window.addEventListener('billScanned', handleBillScanned as EventListener);
    
    return () => {
      window.removeEventListener('billScanned', handleBillScanned as EventListener);
    };
  }, []);

  // Function to reset the bill scanning process
  const handleReset = () => {
    setBillScanned(false);
    setItems([]);
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-black mb-1">SplitAI</h1>
        <p className="text-sm text-gray-700">Smart & Fair Bill Splitting</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        {!billScanned && <UploadBill />}
        {billScanned && <ScannedItems items={items} onReset={handleReset} />}
        <BillSplitter />
      </div>
    </main>
  );
} 