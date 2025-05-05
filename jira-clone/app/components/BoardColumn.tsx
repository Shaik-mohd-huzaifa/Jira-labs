"use client";

import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { TicketType, useJira } from '../context/JiraContext';

interface BoardColumnProps {
  id: string;
  title: string;
  items: TicketType[];
  color: string;
}

const BoardColumn: React.FC<BoardColumnProps> = ({ id, title, items: initialItems, color }) => {
  const { createTicket } = useJira();
  const [items, setItems] = useState(initialItems);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemType, setNewItemType] = useState<'task' | 'bug' | 'story' | 'epic'>('task');
  
  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItemTitle.trim()) return;
    
    // Create a new ticket using the context
    const newTicket = createTicket({
      title: newItemTitle,
      type: newItemType,
      status: title
    });
    
    // Update local state to reflect the new item
    setItems(prevItems => [...prevItems, newTicket]);
    
    // Reset form and hide it
    setNewItemTitle('');
    setShowCreateForm(false);
  };

  return (
    <div className="flex flex-col w-72 min-h-full bg-gray-100 rounded-md shadow mr-4">
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: color }}></div>
          <h3 className="font-medium text-gray-700">{title}</h3>
          <span className="ml-2 bg-gray-200 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>
      
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div 
            className={`flex-1 p-2 overflow-y-auto ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {items.length > 0 ? (
              <>
                {items.map((item, index) => (
                  <BoardItem 
                    key={item.id} 
                    item={item} 
                    index={index} 
                  />
                ))}
                {provided.placeholder}
              </>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center text-center p-4 h-32">
                  <svg className="w-10 h-10 text-gray-300 mb-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 5h16v2H4V5zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
                  </svg>
                  <p className="text-sm text-gray-500">No items</p>
                  <button 
                    className="mt-2 text-sm text-blue-600 hover:underline"
                    onClick={() => setShowCreateForm(true)}
                  >
                    + Add issue
                  </button>
                </div>
                {provided.placeholder}
              </>
            )}
          </div>
        )}
      </Droppable>
      
      {showCreateForm && (
        <div className="p-3 border-t border-gray-200 bg-white">
          <form onSubmit={handleCreateIssue}>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Issue Type
              </label>
              <div className="flex space-x-2 mb-2">
                <button
                  type="button"
                  className={`px-2 py-1 text-xs rounded ${newItemType === 'task' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => setNewItemType('task')}
                >
                  Task
                </button>
                <button
                  type="button"
                  className={`px-2 py-1 text-xs rounded ${newItemType === 'bug' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => setNewItemType('bug')}
                >
                  Bug
                </button>
                <button
                  type="button"
                  className={`px-2 py-1 text-xs rounded ${newItemType === 'story' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => setNewItemType('story')}
                >
                  Story
                </button>
                <button
                  type="button"
                  className={`px-2 py-1 text-xs rounded ${newItemType === 'epic' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => setNewItemType('epic')}
                >
                  Epic
                </button>
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Enter issue title"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={!newItemTitle.trim()}
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
      
      {!showCreateForm && items.length > 0 && (
        <div className="p-2 border-t border-gray-200">
          <button 
            className="w-full py-1 text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center"
            onClick={() => setShowCreateForm(true)}
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1-2 0v-6H5a1 1 0 0 1 0-2h6V5a1 1 0 0 1 1-1z" />
            </svg>
            Create issue
          </button>
        </div>
      )}
    </div>
  );
};

// Separate component for draggable items
import { Draggable } from '@hello-pangea/dnd';

const BoardItem: React.FC<{ item: TicketType, index: number }> = ({ item, index }) => {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-2 p-3 bg-white rounded shadow border-l-4 ${
            snapshot.isDragging ? 'shadow-md' : ''
          }`}
          style={{
            ...provided.draggableProps.style,
            borderLeftColor: 
              item.type === 'bug' ? '#ef4444' : 
              item.type === 'story' ? '#10b981' : 
              item.type === 'epic' ? '#8b5cf6' : 
              '#3b82f6'
          }}
        >
          <div className="flex items-center text-xs text-gray-500 mb-1">
            {item.type === 'task' && (
              <span className="inline-block w-4 h-4 text-blue-600 mr-2">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 110 20 10 10 0 010-20zm0 2a8 8 0 100 16 8 8 0 000-16zm-1 11a1 1 0 112 0 1 1 0 01-2 0zm0-8a1 1 0 112 0v5a1 1 0 01-2 0V7z" />
                </svg>
              </span>
            )}
            {item.type === 'bug' && (
              <span className="inline-block w-4 h-4 text-red-600 mr-2">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 110 20 10 10 0 010-20zm0 2a8 8 0 100 16 8 8 0 000-16zm-1 5a1 1 0 112 0v4a1 1 0 01-2 0V9zm1 8.5a1 1 0 100 2 1 1 0 000-2z"/>
                </svg>
              </span>
            )}
            {item.type === 'story' && (
              <span className="inline-block w-4 h-4 text-green-600 mr-2">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zM4 8.5l8-4 8 4-8 4-8-4zm8 10.5l-8-4v-5l8 4v5z"/>
                </svg>
              </span>
            )}
            {item.type === 'epic' && (
              <span className="inline-block w-4 h-4 text-purple-600 mr-2">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </span>
            )}
            <span className="text-xs text-gray-500 font-mono">{item.id}</span>
          </div>
          
          <div className="text-sm font-medium text-gray-800 mb-2">
            {item.title}
          </div>
          
          <div className="flex items-center justify-between">
            {item.priority && (
              <div>
                {item.priority === 'high' && (
                  <span className="text-orange-500" title="High priority">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 8l-1.5 9 1.5 5 1.5-5L12 8z M12 2v4 M17 5l-5 3 M7 5l5 3"/>
                    </svg>
                  </span>
                )}
                {item.priority === 'medium' && (
                  <span className="text-yellow-500" title="Medium priority">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 8v12 M7 12h10"/>
                    </svg>
                  </span>
                )}
                {item.priority === 'low' && (
                  <span className="text-green-500" title="Low priority">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 16l-1.5-9L12 2l1.5 5L12 16z M12 22v-4 M17 19l-5-3 M7 19l5-3"/>
                    </svg>
                  </span>
                )}
              </div>
            )}
            
            {item.assignee ? (
              <div 
                className="w-6 h-6 rounded-full bg-cover bg-center" 
                style={{ backgroundImage: `url(${item.assignee.avatar})` }} 
                title={item.assignee.name}
              ></div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12a5 5 0 110-10 5 5 0 010 10zm0-2a3 3 0 100-6 3 3 0 000 6zm9 11a1 1 0 01-2 0v-2a3 3 0 00-3-3H8a3 3 0 00-3 3v2a1 1 0 01-2 0v-2a5 5 0 015-5h8a5 5 0 015 5v2z"/>
                </svg>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default BoardColumn;
