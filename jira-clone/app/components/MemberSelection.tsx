"use client";

import React, { useState, useEffect } from 'react';
import { TeamMember } from '../context/JiraContext';

type MemberSelectionProps = {
  teamMembers: TeamMember[];
  selectedMemberIds: string[];
  setSelectedMemberIds: (memberIds: string[]) => void;
};

const MemberSelection: React.FC<MemberSelectionProps> = ({ 
  teamMembers, 
  selectedMemberIds, 
  setSelectedMemberIds
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedMembers, setTempSelectedMembers] = useState<string[]>(selectedMemberIds);
  
  // Update the temp selection when selected members change
  useEffect(() => {
    setTempSelectedMembers(selectedMemberIds);
  }, [selectedMemberIds]);
  
  // Select the first 3 members for display
  const displayMembers = teamMembers.slice(0, 3);
  
  const toggleMember = (memberId: string) => {
    setTempSelectedMembers(prev => {
      if (prev.includes(memberId)) {
        // Remove member if already selected
        return prev.filter(id => id !== memberId);
      } else {
        // Add member if not selected
        return [...prev, memberId];
      }
    });
  };

  const handleApply = () => {
    // Update the parent state with selected members
    setSelectedMemberIds(tempSelectedMembers);
    setIsModalOpen(false);
  };
  
  return (
    <div className="relative">
      <div className="flex items-center -space-x-2">
        {displayMembers.map(member => (
          <div 
            key={member.id}
            className="w-8 h-8 rounded-full overflow-hidden border-2 border-white hover:z-10 transition-transform hover:scale-110 cursor-pointer"
            title={member.name}
          >
            <img 
              src={member.avatar} 
              alt={member.name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <button 
          className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white text-gray-600 flex items-center justify-center hover:bg-gray-300 hover:z-10 transition-transform hover:scale-110"
          onClick={() => setIsModalOpen(true)}
          title="View all members"
        >
          <span className="text-xs font-medium">+</span>
        </button>
      </div>
      
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg w-96 max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Select team members to filter tasks
              </p>
            </div>
            
            <div className="overflow-y-auto p-4 flex-1">
              {teamMembers.map(member => (
                <div 
                  key={member.id}
                  className="flex items-center py-2 hover:bg-gray-50 rounded px-2"
                >
                  <input
                    type="checkbox"
                    id={`member-${member.id}`}
                    checked={tempSelectedMembers.includes(member.id)}
                    onChange={() => toggleMember(member.id)}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label 
                    htmlFor={`member-${member.id}`}
                    className="flex items-center flex-1 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{member.name}</div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleApply}
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberSelection;
