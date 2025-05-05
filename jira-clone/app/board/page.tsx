"use client";

import { useState, useCallback } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import BoardColumn from "../components/BoardColumn";
import MemberSelection from "../components/MemberSelection";
import { useJira } from "../context/JiraContext";

export default function BoardPage() {
  const { columns, teamMembers, selectedMemberIds, setSelectedMemberIds, createColumn } = useJira();
  
  // Local state for modal
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [newColumnColor, setNewColumnColor] = useState("#e2e8f0");

  // Function to handle drag end
  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination } = result;

    // If there's no destination or the item was dropped back into the same position
    if (!destination || 
        (source.droppableId === destination.droppableId && 
         source.index === destination.index)) {
      return;
    }

    // Get the source and destination columns
    const sourceColumnId = source.droppableId;
    const destinationColumnId = destination.droppableId;
    
    // Get the columns
    const sourceColumn = columns[sourceColumnId];
    const destinationColumn = columns[destinationColumnId];
    
    if (!sourceColumn || !destinationColumn) return;
    
    // Get the item being dragged
    const draggedItem = sourceColumn.items[source.index];
    
    // If columns are different, update the item's status
    if (sourceColumnId !== destinationColumnId) {
      draggedItem.status = destinationColumn.title;
    }
    
    // This will be handled by the useJira context's updateTicketStatus function
  }, [columns]);

  // Function to get filtered columns based on selected team members
  const getFilteredColumns = useCallback(() => {
    if (selectedMemberIds.length === 0) {
      return columns;
    }

    const filteredColumns = {...columns};
    
    Object.keys(filteredColumns).forEach(columnId => {
      filteredColumns[columnId] = {
        ...filteredColumns[columnId],
        items: filteredColumns[columnId].items.filter(item => {
          if (item.assignee) {
            const teamMember = teamMembers.find(member => 
              member.name === item.assignee?.name
            );
            return teamMember && selectedMemberIds.includes(teamMember.id);
          }
          return false;
        })
      };
    });

    return filteredColumns;
  }, [columns, selectedMemberIds, teamMembers]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-4">
          <div className="overflow-hidden rounded-sm">
            <div className="inline-flex">
              <button className="relative bg-blue-700 text-white px-4 py-2 text-sm font-medium flex items-center">
                <span>Kanban</span>
                <span className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 text-[10px] font-bold rounded-full px-1.5 py-0.5 border border-amber-500 shadow-sm">Works</span>
              </button>
              <button className="relative bg-gray-100 text-gray-800 px-4 py-2 text-sm font-medium flex items-center">
                <span>Backlog</span>
                <span className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 text-[10px] font-bold rounded-full px-1.5 py-0.5 border border-amber-500 shadow-sm">Works</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Add column button */}
          <button 
            onClick={() => setShowColumnModal(true)} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition-colors"
          >
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
              />
            </svg>
            Add column
          </button>
          
          {/* Member selection component */}
          <MemberSelection 
            teamMembers={teamMembers}
            selectedMemberIds={selectedMemberIds}
            setSelectedMemberIds={setSelectedMemberIds}
          />
        </div>
      </div>
      
      {/* Board content */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4">
          {Object.values(getFilteredColumns()).map(column => (
            <BoardColumn
              key={column.id}
              id={column.id}
              title={column.title}
              items={column.items}
              color={column.color}
            />
          ))}
        </div>
      </DragDropContext>
      
      {/* Add column modal */}
      {showColumnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4">Add new column</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Column title
              </label>
              <input
                type="text"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter column title"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Column color
              </label>
              <div className="flex space-x-2">
                {['#e2e8f0', '#93c5fd', '#86efac', '#fcd34d', '#f9a8d4'].map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full ${
                      newColumnColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewColumnColor(color)}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowColumnModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newColumnTitle.trim()) {
                    // Use the context to create a new column
                    createColumn(newColumnTitle, newColumnColor);
                    setNewColumnTitle('');
                    setShowColumnModal(false);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                disabled={!newColumnTitle.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
