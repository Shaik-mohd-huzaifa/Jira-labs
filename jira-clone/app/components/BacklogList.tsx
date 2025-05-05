"use client";

import React from 'react';
import BacklogItem from './BacklogItem';
import { TicketType } from '../context/JiraContext';

interface BacklogListProps {
  items: TicketType[];
  isCollapsed?: boolean;
}

const BacklogList = ({ items, isCollapsed = false }: BacklogListProps) => {
  const [collapsed, setCollapsed] = React.useState(isCollapsed);

  return (
    <div className="mb-8">
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
          <span className="font-bold uppercase">Backlog</span>
        </button>
        
        <div className="ml-2 text-xs text-gray-500">
          ({items.length} work item{items.length !== 1 ? 's' : ''})
        </div>
        
        <div className="ml-auto flex items-center">
          <div className="mr-2 text-sm">
            <span className="font-medium">TO DO: </span>
            <span className="font-bold text-gray-700">{items.length}</span>
          </div>
        </div>
      </div>

      {!collapsed && (
        <div className="bg-white border border-gray-200 rounded-md shadow-sm">
          {items.length > 0 ? (
            items.map((item) => (
              <BacklogItem
                key={item.id}
                id={item.id}
                itemKey={item.id}
                title={item.title}
                type={item.type}
                assignee={item.assignee}
                priority={item.priority || 'medium'}
                status={item.status}
              />
            ))
          ) : (
            <div className="p-8 flex flex-col items-center justify-center text-center">
              <div className="mb-4">
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTIwIDEwMCI+PHBhdGggZmlsbD0iI0RFRUJGRiIgZD0iTTAgMGgxMjB2MTAwSDB6Ii8+PHBhdGggZmlsbD0iIzc0OUJEMSIgZD0iTTUwIDI1aDQ0djUwSDUweiIvPjxwYXRoIGZpbGw9IiM5MUMwRjMiIGQ9Ik0yNiA3NWg1MHY0SDI2eiIvPjxwYXRoIGZpbGw9IiM5MUMwRjMiIGQ9Ik0yNiA0NWg1MHY0SDI2eiIvPjxwYXRoIGZpbGw9IiM5MUMwRjMiIGQ9Ik0yNiAzNWg1MHY0SDI2eiIvPjxwYXRoIGZpbGw9IiM5MUMwRjMiIGQ9Ik0yNiA2NWg1MHY0SDI2eiIvPjxwYXRoIGZpbGw9IiM5MUMwRjMiIGQ9Ik0yNiA1NWg1MHY0SDI2eiIvPjwvc3ZnPg==" alt="Empty backlog" className="w-24 h-20" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Your backlog is empty</h3>
              <p className="text-gray-600 mb-4">Create work items to add to your backlog</p>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded">
                Create issue
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BacklogList;
