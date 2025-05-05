"use client";

import React, { useState, useEffect } from 'react';
import Sprint from '../components/Sprint';
import BacklogList from '../components/BacklogList';
import MemberSelection from '../components/MemberSelection';
import { useJira } from '../context/JiraContext';

export default function BacklogPage() {
  const { teamMembers, sprints, backlogItems, selectedMemberIds, setSelectedMemberIds } = useJira();
  
  // Filter backlog items by selected team members
  const filteredBacklogItems = selectedMemberIds.length > 0
    ? backlogItems.filter(item => {
        // If item has an assignee, check if they are in the selected members
        if (item.assignee) {
          // Find the team member with matching name
          const teamMember = teamMembers.find(member => 
            member.name === item.assignee?.name
          );
          // If found, check if their ID is in selectedMemberIds
          return teamMember && selectedMemberIds.includes(teamMember.id);
        }
        return false;
      })
    : backlogItems;
  
  return (
    <div className="flex-1 overflow-auto px-6 py-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="hover:underline cursor-pointer">Projects</span>
            <span className="mx-2">/</span>
            <span className="hover:underline cursor-pointer">AI powered Chatbot</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Backlog</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10z" />
            </svg>
          </button>
          
          <div className="relative">
            <button className="flex items-center space-x-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
              <span>Epic</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 9l4 4 4-4z" />
              </svg>
            </button>
          </div>
          
          <button className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1-2 0v-6H5a1 1 0 0 1 0-2h6V5a1 1 0 0 1 1-1z" />
            </svg>
            <span>Create issue</span>
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 4h18v2H3V4zm0 7h12v2H3v-2zm0 7h18v2H3v-2z" />
            </svg>
            <span>View settings</span>
          </button>
          
          {/* Team members display */}
          <MemberSelection 
            teamMembers={teamMembers}
            selectedMemberIds={selectedMemberIds}
            setSelectedMemberIds={setSelectedMemberIds}
          />
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Estimate: <strong>0</strong></span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-4">
          {sprints.map(sprint => (
            <Sprint 
              key={sprint.id} 
              id={sprint.id} 
              name={sprint.name} 
              items={selectedMemberIds.length > 0 
                ? sprint.items.filter(item => {
                    if (item.assignee) {
                      const teamMember = teamMembers.find(member => 
                        member.name === item.assignee?.name
                      );
                      return teamMember && selectedMemberIds.includes(teamMember.id);
                    }
                    return false;
                  })
                : sprint.items
              } 
            />
          ))}
          <BacklogList items={filteredBacklogItems} />
        </div>
      </div>
    </div>
  );
}
