"use client";

import React from 'react';

// Team member data structure
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  email: string;
}

// Dummy team members data
export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Martinez',
    role: 'Product Manager',
    department: 'Product',
    avatar: 'https://i.pravatar.cc/150?img=1',
    email: 'alex.martinez@company.com'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'Senior Developer',
    department: 'Engineering',
    avatar: 'https://i.pravatar.cc/150?img=5',
    email: 'sarah.johnson@company.com'
  },
  {
    id: '3',
    name: 'Michael Chen',
    role: 'UX Designer',
    department: 'Design',
    avatar: 'https://i.pravatar.cc/150?img=3',
    email: 'michael.chen@company.com'
  },
  {
    id: '4',
    name: 'Emily Davis',
    role: 'Backend Developer',
    department: 'Engineering',
    avatar: 'https://i.pravatar.cc/150?img=8',
    email: 'emily.davis@company.com'
  },
  {
    id: '5',
    name: 'Jamal Wilson',
    role: 'DevOps Engineer',
    department: 'Operations',
    avatar: 'https://i.pravatar.cc/150?img=11',
    email: 'jamal.wilson@company.com'
  },
  {
    id: '6',
    name: 'Lisa Kim',
    role: 'Frontend Developer',
    department: 'Engineering',
    avatar: 'https://i.pravatar.cc/150?img=9',
    email: 'lisa.kim@company.com'
  },
  {
    id: '7',
    name: 'David Singh',
    role: 'QA Engineer',
    department: 'Quality Assurance',
    avatar: 'https://i.pravatar.cc/150?img=12',
    email: 'david.singh@company.com'
  },
  {
    id: '8',
    name: 'Olivia Rodriguez',
    role: 'Data Scientist',
    department: 'Analytics',
    avatar: 'https://i.pravatar.cc/150?img=20',
    email: 'olivia.rodriguez@company.com'
  },
  {
    id: '9',
    name: 'Thomas Parker',
    role: 'Scrum Master',
    department: 'Product',
    avatar: 'https://i.pravatar.cc/150?img=15',
    email: 'thomas.parker@company.com'
  },
  {
    id: '10',
    name: 'Priya Patel',
    role: 'UI Designer',
    department: 'Design',
    avatar: 'https://i.pravatar.cc/150?img=25',
    email: 'priya.patel@company.com'
  }
];

type TeamMembersProps = {
  showTeamMembers?: boolean;
};

const TeamMembers: React.FC<TeamMembersProps> = ({ showTeamMembers = true }) => {
  return (
    <div className="bg-white rounded-md border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">Team Members</h2>
        <p className="text-sm text-gray-500">10 people working on this project</p>
      </div>
      
      <div className="p-2">
        {teamMembers.map(member => (
          <div key={member.id} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
            <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
              <img 
                src={member.avatar} 
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-800 truncate">{member.name}</h3>
                <span className="text-xs text-gray-500">{member.department}</span>
              </div>
              <p className="text-xs text-gray-500 truncate">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamMembers;
