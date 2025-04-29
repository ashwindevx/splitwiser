'use client';

import { Item, Participant } from './BillSplitter';

interface ItemsTableProps {
  items: Item[];
  participants: Participant[];
  onAssign: (itemId: number, participantId: number) => void;
}

export default function ItemsTable({ items, participants, onAssign }: ItemsTableProps) {
  // Calculate the total for the bill
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-xs">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Item
            </th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Price
            </th>
            {participants.map(participant => (
              <th key={participant.id} scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                {participant.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map(item => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                {item.name}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-700">
                ${item.price.toFixed(2)}
              </td>
              {participants.map(participant => (
                <td key={participant.id} className="px-3 py-2 whitespace-nowrap text-center">
                  <input
                    type="checkbox"
                    checked={item.assignedTo?.includes(participant.id) || false}
                    onChange={() => onAssign(item.id, participant.id)}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded cursor-pointer"
                  />
                </td>
              ))}
            </tr>
          ))}
          {/* Total row */}
          <tr className="bg-gray-50">
            <td className="px-3 py-2 whitespace-nowrap text-xs font-bold text-black">
              Total
            </td>
            <td className="px-3 py-2 whitespace-nowrap text-xs font-bold text-black">
              ${total.toFixed(2)}
            </td>
            {participants.map(participant => (
              <td key={participant.id} className="px-3 py-2 whitespace-nowrap text-center text-xs text-gray-500">
                {/* Optional: show participant total here */}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded text-xs">
        <h3 className="font-medium text-gray-900 mb-1">Assignment Guide</h3>
        <p className="text-gray-600">
          Check the box to assign an item to a person. You can assign an item to multiple people to split it equally.
        </p>
      </div>
    </div>
  );
} 