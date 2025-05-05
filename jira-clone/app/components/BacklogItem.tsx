"use client";

import React from 'react';

interface Assignee {
  name: string;
  avatar: string;
}

export interface BacklogItemProps {
  id: string;
  itemKey: string;
  title: string;
  type: 'task' | 'bug' | 'story' | 'epic';
  assignee?: Assignee;
  priority?: 'highest' | 'high' | 'medium' | 'low' | 'lowest';
  estimate?: number;
  status?: string;
}

const BacklogItem: React.FC<BacklogItemProps> = ({ 
  id, itemKey, title, type, assignee, priority, estimate, status 
}) => {
  return (
    <div className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-200 group">
      <div className="flex-shrink-0 mr-3">
        {type === 'task' && (
          <span className="inline-block w-5 h-5 text-blue-600">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 110 20 10 10 0 010-20zm0 2a8 8 0 100 16 8 8 0 000-16zm-1 12.5a1 1 0 112 0 1 1 0 01-2 0zm1-10a1 1 0 00-.894.553l-2 4a1 1 0 001.788.894L12 7.236l1.106 2.211a1 1 0 001.788-.894l-2-4A1 1 0 0012 6.5z"/>
            </svg>
          </span>
        )}
        {type === 'bug' && (
          <span className="inline-block w-5 h-5 text-red-600">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 110 20 10 10 0 010-20zm0 2a8 8 0 100 16 8 8 0 000-16zm-1 5a1 1 0 112 0v4a1 1 0 01-2 0V9zm1 8.5a1 1 0 100 2 1 1 0 000-2z"/>
            </svg>
          </span>
        )}
        {type === 'story' && (
          <span className="inline-block w-5 h-5 text-green-600">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zM4 8.5l8-4 8 4-8 4-8-4zm8 10.5l-8-4v-5l8 4v5z"/>
            </svg>
          </span>
        )}
        {type === 'epic' && (
          <span className="inline-block w-5 h-5 text-purple-600">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center text-sm text-gray-600 mb-0.5">
          <span className="font-mono">{itemKey}</span>
          {status && (
            <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-blue-100 text-blue-800">
              {status}
            </span>
          )}
        </div>
        <div className="text-sm font-medium text-gray-900 truncate">
          {title}
        </div>
      </div>
      <div className="ml-auto flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {priority && (
          <div className="flex-shrink-0">
            {priority === 'highest' && (
              <span className="text-red-500" title="Highest priority">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/>
                </svg>
              </span>
            )}
            {priority === 'high' && (
              <span className="text-orange-500" title="High priority">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 8l-1.5 9 1.5 5 1.5-5L12 8z M12 2v4 M17 5l-5 3 M7 5l5 3"/>
                </svg>
              </span>
            )}
            {priority === 'medium' && (
              <span className="text-yellow-500" title="Medium priority">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 8v12 M7 12h10"/>
                </svg>
              </span>
            )}
            {priority === 'low' && (
              <span className="text-green-500" title="Low priority">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 16l-1.5-9L12 2l1.5 5L12 16z M12 22v-4 M17 19l-5-3 M7 19l5-3"/>
                </svg>
              </span>
            )}
            {priority === 'lowest' && (
              <span className="text-blue-500" title="Lowest priority">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 20l-1.5-1.5L12 17l1.5 1.5L12 20z"/>
                </svg>
              </span>
            )}
          </div>
        )}
        
        {estimate !== undefined && (
          <div className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">
            {estimate}
          </div>
        )}
      </div>
      
      <div className="ml-4 flex-shrink-0">
        {assignee ? (
          <div 
            className="w-6 h-6 rounded-full bg-cover bg-center" 
            style={{ backgroundImage: `url(${assignee.avatar})` }} 
            title={assignee.name}
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
  );
};

export default BacklogItem;
