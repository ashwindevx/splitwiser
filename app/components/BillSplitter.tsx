'use client';

import { useState, useEffect } from 'react';
import ParticipantsList from './ParticipantsList';
import ItemsTable from './ItemsTable';
import SummaryView from './SummaryView';

export interface Item {
  id: number;
  name: string;
  price: number;
  assignedTo?: number[];
}

export interface SharedFee extends Item {
  isSharedFee: true;
}

export interface Participant {
  id: number;
  name: string;
}

export function BillSplitter() {
  const [items, setItems] = useState<Item[]>([]);
  const [sharedFees, setSharedFees] = useState<SharedFee[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [step, setStep] = useState<'participants' | 'assignment' | 'summary'>('participants');

  // Listen for bill scan event
  useEffect(() => {
    const handleBillScanned = (e: CustomEvent) => {
      setItems(e.detail.items || []);
      
      // Set shared fees (if any) and mark them as shared fees
      if (e.detail.sharedFees && e.detail.sharedFees.length > 0) {
        setSharedFees(
          e.detail.sharedFees.map((fee: Item) => ({
            ...fee,
            isSharedFee: true
          }))
        );
      } else {
        setSharedFees([]);
      }
      
      setStep('participants');
    };

    window.addEventListener('billScanned', handleBillScanned as EventListener);
    
    return () => {
      window.removeEventListener('billScanned', handleBillScanned as EventListener);
    };
  }, []);

  const addParticipant = (name: string) => {
    const newParticipant = {
      id: participants.length ? Math.max(...participants.map(p => p.id)) + 1 : 1,
      name
    };
    setParticipants([...participants, newParticipant]);
  };

  const removeParticipant = (id: number) => {
    setParticipants(participants.filter(p => p.id !== id));
    
    // Remove this participant from all item assignments
    setItems(items.map(item => ({
      ...item,
      assignedTo: item.assignedTo ? item.assignedTo.filter(pId => pId !== id) : []
    })));
  };

  const assignItemToParticipant = (itemId: number | string, participantId: number) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const assignedTo = item.assignedTo || [];
        const alreadyAssigned = assignedTo.includes(participantId);
        
        return {
          ...item,
          assignedTo: alreadyAssigned
            ? assignedTo.filter(id => id !== participantId) // Remove if already assigned
            : [...assignedTo, participantId] // Add if not assigned
        };
      }
      return item;
    }));
  };

  const moveToAssignment = () => {
    if (participants.length > 0) {
      setStep('assignment');
    }
  };

  const moveToSummary = () => {
    setStep('summary');
  };

  const reset = () => {
    setItems([]);
    setSharedFees([]);
    setParticipants([]);
    setStep('participants');
  };

  return !items.length ? (
    <div className="p-3 bg-gray-50 rounded text-center">
      <p className="text-xs text-gray-600">Upload and scan a bill to get started</p>
    </div>
  ) : (
    <div>
      {step === 'participants' && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Who's splitting this bill?</h2>
          <ParticipantsList 
            participants={participants} 
            onAdd={addParticipant} 
            onRemove={removeParticipant} 
          />
          <div className="mt-3 flex justify-end">
            <button 
              onClick={moveToAssignment}
              disabled={participants.length === 0}
              className={`px-3 py-1 rounded text-sm font-medium ${
                participants.length > 0 
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue to Assignment
            </button>
          </div>
        </div>
      )}

      {step === 'assignment' && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Assign Items</h2>
          {sharedFees.length > 0 && (
            <div className="mb-3 p-3 border border-gray-200 rounded bg-gray-50">
              <h3 className="text-sm font-medium mb-1">Shared Fees</h3>
              <p className="text-xs text-gray-700">
                These fees will be split equally among all participants:
              </p>
              <ul className="pl-2 space-y-1 mt-1 text-xs">
                {sharedFees.map(fee => (
                  <li key={fee.id} className="flex justify-between">
                    <span>{fee.name}</span>
                    <span className="font-medium">${fee.price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <ItemsTable 
            items={items} 
            participants={participants} 
            onAssign={assignItemToParticipant} 
          />
          <div className="mt-3 flex justify-between">
            <button 
              onClick={() => setStep('participants')}
              className="px-2 py-1 text-xs hover:bg-gray-100 rounded"
            >
              Back
            </button>
            <button 
              onClick={moveToSummary}
              className="px-3 py-1 bg-black text-white rounded text-sm font-medium hover:bg-gray-800"
            >
              View Summary
            </button>
          </div>
        </div>
      )}

      {step === 'summary' && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Payment Summary</h2>
          <SummaryView 
            items={items} 
            sharedFees={sharedFees}
            participants={participants} 
          />
          <div className="mt-3 flex justify-between">
            <button 
              onClick={() => setStep('assignment')}
              className="px-2 py-1 text-xs hover:bg-gray-100 rounded"
            >
              Back
            </button>
            <button 
              onClick={reset}
              className="px-3 py-1 bg-black text-white rounded text-sm font-medium hover:bg-gray-800"
            >
              New Bill
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 