'use client';

import { useState } from 'react';
import { Participant } from './BillSplitter';

interface ParticipantsListProps {
  participants: Participant[];
  onAdd: (name: string) => void;
  onRemove: (id: number) => void;
}

export default function ParticipantsList({ participants, onAdd, onRemove }: ParticipantsListProps) {
  const [newParticipantName, setNewParticipantName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newParticipantName.trim()) {
      onAdd(newParticipantName.trim());
      setNewParticipantName('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <input
          type="text"
          value={newParticipantName}
          onChange={(e) => setNewParticipantName(e.target.value)}
          placeholder="Enter participant name"
          className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-500"
        />
        <button
          type="submit"
          disabled={!newParticipantName.trim()}
          className={`px-3 py-1 rounded text-xs ${
            newParticipantName.trim()
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Add
        </button>
      </form>

      {participants.length > 0 ? (
        <ul className="space-y-1">
          {participants.map((participant) => (
            <li 
              key={participant.id}
              className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded text-xs"
            >
              <span className="font-medium">{participant.name}</span>
              <button
                onClick={() => onRemove(participant.id)}
                className="text-gray-700 hover:text-red-500"
                aria-label={`Remove ${participant.name}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-gray-500 text-center py-3">No participants added yet</p>
      )}
    </div>
  );
}