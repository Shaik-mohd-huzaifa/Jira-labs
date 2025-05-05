"use client";

import React, { useState } from 'react';
import { TicketType, useJira } from '../context/JiraContext';

interface SprintProps {
  id: string;
  name: string;
  items: TicketType[];
  isCollapsed?: boolean;
}

const Sprint = ({ id, name, items: initialItems, isCollapsed = false }: SprintProps) => {
  const { createTicket } = useJira();
  const [collapsed, setCollapsed] = React.useState(isCollapsed);
  const [items, setItems] = useState(initialItems);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemType, setNewItemType] = useState<'task' | 'bug' | 'story' | 'epic'>('task');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItemTitle.trim()) return;
    
    // Create a new ticket using the global context
    const newTicket = createTicket({
      title: newItemTitle,
      type: newItemType,
      status: 'To Do' // Default status for new tickets
    });
    
    // Add the new item to the sprint's items in local state
    setItems(prevItems => [...prevItems, newTicket]);
    
    // Reset form and hide it
    setNewItemTitle('');
    setNewItemType('task');
    setShowCreateForm(false);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center mb-2 group">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center text-sm font-semibold text-gray-700 hover:text-gray-900"
        >
          <svg 
            className={`w-4 h-4 mr-1 transition-transform ${collapsed ? '' : 'transform rotate-90'}`} 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M8 5l8 7-8 7z"/>
          </svg>
          <span className="font-bold uppercase">{name}</span>
        </button>
        
        <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="text-xs px-2 py-0.5 text-gray-600 hover:underline">
            Add dates
          </button>
        </div>
        
        <div className="ml-2 text-xs text-gray-500">
          ({items.length} work item{items.length !== 1 ? 's' : ''})
        </div>
        
        <div className="ml-auto flex items-center">
          <div className="flex items-center">
            <span className="bg-gray-200 text-gray-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-1">
              0
            </span>
            <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
              {items.length}
            </span>
          </div>
          <button className="ml-2 text-sm text-blue-500 hover:underline">
            Start sprint
          </button>
          <button className="ml-4 text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      </div>

      {!collapsed && items.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-md shadow-sm">
          {items.map((item, index) => (
            <div 
              key={item.id}
              className={`flex items-center p-3 hover:bg-gray-50 ${
                index !== items.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <div className="flex-shrink-0 mr-3">
                {item.type === 'task' && (
                  <span className="inline-block w-5 h-5 text-blue-600">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2a10 10 0 110 20 10 10 0 010-20zm0 2a8 8 0 100 16 8 8 0 000-16zm-1 12.5a1 1 0 112 0 1 1 0 01-2 0zm1-10a1 1 0 00-.894.553l-2 4a1 1 0 001.788.894L12 7.236l1.106 2.211a1 1 0 001.788-.894l-2-4A1 1 0 0012 6.5z"/>
                    </svg>
                  </span>
                )}
                {item.type === 'bug' && (
                  <span className="inline-block w-5 h-5 text-red-600">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2a10 10 0 110 20 10 10 0 010-20zm0 2a8 8 0 100 16 8 8 0 000-16zm-1 5a1 1 0 112 0v4a1 1 0 01-2 0V9zm1 8.5a1 1 0 100 2 1 1 0 000-2z"/>
                    </svg>
                  </span>
                )}
                {item.type === 'story' && (
                  <span className="inline-block w-5 h-5 text-green-600">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7v10l10 5 10-5V7L12 2zM4 8.5l8-4 8 4-8 4-8-4zm8 10.5l-8-4v-5l8 4v5z"/>
                    </svg>
                  </span>
                )}
                {item.type === 'epic' && (
                  <span className="inline-block w-5 h-5 text-purple-600">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </span>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 font-mono mr-2">{item.id}</span>
                </div>
                <div className="text-sm font-medium">{item.title}</div>
              </div>
              
              {item.assignee && (
                <div className="ml-4">
                  <div 
                    className="w-6 h-6 rounded-full bg-cover bg-center" 
                    style={{ backgroundImage: `url(${item.assignee.avatar})` }} 
                    title={item.assignee.name}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : !collapsed ? (
        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4 text-center">
          <div className="flex justify-center mb-2">
            <svg className="w-12 h-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4H8v-2h4V7h2v4h4v2h-4v4z"/>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Plan your sprint</h3>
          <p className="text-gray-600 mb-4">Drag work items from the <span className="font-semibold">Backlog</span> section or create new ones for this sprint. Select <span className="font-semibold">Start sprint</span> when you're ready.</p>
        </div>
      ) : null}
      
      {/* Task creation form */}
      {!collapsed && showCreateForm && (
        <div className="bg-white border border-gray-200 rounded-md shadow-sm mt-2 p-4">
          <form onSubmit={handleAddItem}>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Type
              </label>
              <div className="flex space-x-2">
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
              <label htmlFor="item-title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="item-title"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                placeholder="Enter item title"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Create button below each sprint section */}
      {!collapsed && !showCreateForm && (
        <button 
          className="flex items-center text-sm text-gray-600 hover:text-gray-800 mt-2 px-3 py-1"
          onClick={() => setShowCreateForm(true)}
        >
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1-2 0v-6H5a1 1 0 0 1 0-2h6V5a1 1 0 0 1 1-1z" />
          </svg>
          <span>Create</span>
        </button>
      )}
    </div>
  );
};

export default Sprint;
