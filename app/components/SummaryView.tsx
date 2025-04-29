'use client';

import { Item, Participant, SharedFee } from './BillSplitter';

interface SummaryViewProps {
  items: Item[];
  sharedFees: SharedFee[];
  participants: Participant[];
}

export default function SummaryView({ items, sharedFees, participants }: SummaryViewProps) {
  // Calculate the total for regular items
  const itemsTotal = items.reduce((sum, item) => sum + item.price, 0);
  
  // Calculate the total for shared fees
  const sharedFeesTotal = sharedFees.reduce((sum, fee) => sum + fee.price, 0);
  
  // Calculate per-person shared fee amount (equal division)
  const perPersonSharedFee = participants.length > 0 
    ? sharedFeesTotal / participants.length 
    : 0;
  
  // Calculate the total bill amount (items + shared fees)
  const totalBill = itemsTotal + sharedFeesTotal;

  // Calculate what each participant owes
  const participantAmounts = participants.map(participant => {
    // Get all items assigned to this participant
    const assignedItems = items.filter(item => 
      item.assignedTo && item.assignedTo.includes(participant.id)
    );
    
    // Calculate total amount owed for items
    let itemsAmount = 0;
    assignedItems.forEach(item => {
      // Split the item price among all assigned participants
      itemsAmount += item.price / (item.assignedTo?.length || 1);
    });
    
    // Add the shared fees (equal division)
    const totalAmountOwed = itemsAmount + perPersonSharedFee;

    return {
      ...participant,
      amountOwed: totalAmountOwed,
      itemsAmount,
      sharedFeesAmount: perPersonSharedFee,
      itemsCount: assignedItems.length,
      assignedItems: assignedItems.map(item => ({
        ...item,
        shareAmount: item.price / (item.assignedTo?.length || 1)
      }))
    };
  });

  // Calculate the assigned total (to check if everything is assigned)
  const assignedItemsTotal = participantAmounts.reduce((sum, p) => sum + p.itemsAmount, 0);
  const isFullyAssigned = Math.abs(itemsTotal - assignedItemsTotal) < 0.01; // Account for floating point errors

  return (
    <div>
      <div className="mb-4 p-3 bg-white border border-gray-200 rounded text-xs">
        <div className="flex justify-between mb-1">
          <span className="text-gray-700">Items Total:</span>
          <span className="font-semibold">${itemsTotal.toFixed(2)}</span>
        </div>
        
        {sharedFees.length > 0 && (
          <div className="flex justify-between mb-1">
            <span className="text-gray-700">Shared Fees:</span>
            <span className="font-semibold">${sharedFeesTotal.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between mb-1 text-black font-medium pt-1 border-t border-gray-100">
          <span>Total Bill:</span>
          <span className="font-semibold">${totalBill.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-700">Assigned Items Total:</span>
          <span className={`font-semibold ${isFullyAssigned ? 'text-green-600' : 'text-red-600'}`}>
            ${assignedItemsTotal.toFixed(2)}
          </span>
        </div>
        
        {!isFullyAssigned && (
          <div className="mt-2 p-2 bg-red-50 text-red-600 text-xs rounded border border-red-200">
            <p>Warning: Not all items are fully assigned.</p>
          </div>
        )}
      </div>

      {sharedFees.length > 0 && (
        <div className="mb-4 p-3 bg-white border border-gray-200 rounded text-xs">
          <h3 className="font-semibold mb-1">Shared Fees (Split Equally)</h3>
          <ul className="pl-2 space-y-1">
            {sharedFees.map(fee => (
              <li key={fee.id} className="flex justify-between text-xs">
                <span>{fee.name}</span>
                <span className="font-medium">${fee.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-2 pt-1 border-t border-gray-100">
            <span className="text-gray-700">Per person:</span>
            <span className="font-medium">${perPersonSharedFee.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {participantAmounts.map(participant => (
          <div key={participant.id} className="p-3 bg-white border border-gray-200 rounded text-xs">
            <h3 className="font-semibold mb-1">{participant.name}</h3>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Items assigned:</span>
              <span>{participant.itemsCount}</span>
            </div>
            
            {/* List of assigned items */}
            {participant.assignedItems.length > 0 && (
              <div className="mb-2">
                <div className="text-gray-700 mb-1">Assigned items:</div>
                <ul className="pl-2 space-y-1">
                  {participant.assignedItems.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-xs">
                      <span>{item.name}</span>
                      <span className="font-medium">${item.shareAmount.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Show shared fees if there are any */}
            {sharedFees.length > 0 && (
              <div className="flex justify-between mb-2 text-gray-700">
                <span>Equal share of fees:</span>
                <span className="font-medium">${participant.sharedFeesAmount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between pt-1 border-t border-gray-100">
              <span className="font-medium">Total owed:</span>
              <span className="font-bold text-black">${participant.amountOwed.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-white border border-gray-200 rounded text-xs">
        <h3 className="font-semibold mb-1">Payment Methods</h3>
        <p className="text-gray-700 mb-2">
          Share the payment summary with your friends or send payment requests directly.
        </p>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1 bg-black text-white rounded text-xs hover:bg-gray-800 transition-colors">
            Copy Summary
          </button>
          <button className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50 transition-colors">
            Share via Text
          </button>
          {/* This would connect to Splitwise in a real app */}
          <button className="px-3 py-1 flex items-center gap-1 bg-white border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50 transition-colors">
            Connect to Splitwise
          </button>
        </div>
      </div>
    </div>
  );
} 