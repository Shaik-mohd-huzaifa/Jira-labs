'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types
export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
}

export interface TicketType {
  id: string;
  title: string;
  type: 'bug' | 'task' | 'story' | 'epic';
  status: string;
  assignee?: {
    name: string;
    avatar: string;
  };
  priority?: 'low' | 'medium' | 'high';
  itemKey?: string;
}

export interface ColumnType {
  id: string;
  title: string;
  color: string;
  items: TicketType[];
}

export interface SprintType {
  id: string;
  name: string;
  status: 'active' | 'future' | 'completed';
  startDate?: string;
  endDate?: string;
  items: TicketType[];
}

// Sample team members
const initialTeamMembers: TeamMember[] = [
  { id: '1', name: 'Alex Martinez', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '3', name: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: 'Emily Wilson', avatar: 'https://i.pravatar.cc/150?img=10' },
  { id: '5', name: 'David Kim', avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: '6', name: 'Jessica Taylor', avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: '7', name: 'Robert Garcia', avatar: 'https://i.pravatar.cc/150?img=15' },
  { id: '8', name: 'Lisa Brown', avatar: 'https://i.pravatar.cc/150?img=8' },
  { id: '9', name: 'John Wilson', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '10', name: 'Sophia Miller', avatar: 'https://i.pravatar.cc/150?img=7' }
];

// Initial tickets
const initialTickets: TicketType[] = [
  { 
    id: 'JR-101', 
    title: 'Fix login page responsiveness', 
    type: 'bug', 
    status: 'In Progress',
    assignee: { name: 'Alex Martinez', avatar: 'https://i.pravatar.cc/150?img=1' },
    priority: 'high',
    itemKey: 'JR-101'
  },
  { 
    id: 'JR-102', 
    title: 'Implement user settings page', 
    type: 'task', 
    status: 'To Do',
    assignee: { name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/150?img=5' },
    priority: 'medium',
    itemKey: 'JR-102'
  },
  { 
    id: 'JR-103', 
    title: 'Redesign dashboard UI', 
    type: 'story', 
    status: 'Done',
    assignee: { name: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?img=3' },
    priority: 'medium',
    itemKey: 'JR-103'
  },
  { 
    id: 'JR-104', 
    title: 'Implement email notifications', 
    type: 'task', 
    status: 'To Do',
    assignee: { name: 'Emily Wilson', avatar: 'https://i.pravatar.cc/150?img=10' },
    priority: 'low',
    itemKey: 'JR-104'
  },
  { 
    id: 'JR-105', 
    title: 'API integration with payment gateway', 
    type: 'task', 
    status: 'In Progress',
    assignee: { name: 'David Kim', avatar: 'https://i.pravatar.cc/150?img=6' },
    priority: 'high',
    itemKey: 'JR-105'
  }
];

// Initial columns for board
const initialColumns: Record<string, ColumnType> = {
  'column-1': {
    id: 'column-1',
    title: 'To Do',
    color: '#e2e8f0',
    items: initialTickets.filter(t => t.status === 'To Do')
  },
  'column-2': {
    id: 'column-2',
    title: 'In Progress',
    color: '#93c5fd',
    items: initialTickets.filter(t => t.status === 'In Progress')
  },
  'column-3': {
    id: 'column-3',
    title: 'Done',
    color: '#86efac',
    items: initialTickets.filter(t => t.status === 'Done')
  }
};

// Initial sprints for backlog
const initialSprints: SprintType[] = [
  {
    id: 'sprint-1',
    name: 'Sprint 1',
    status: 'active',
    startDate: '2025-05-01',
    endDate: '2025-05-15',
    items: initialTickets.filter(t => ['JR-101', 'JR-103'].includes(t.id))
  },
  {
    id: 'sprint-2',
    name: 'Sprint 2',
    status: 'future',
    startDate: '2025-05-16',
    endDate: '2025-05-30',
    items: initialTickets.filter(t => ['JR-102', 'JR-105'].includes(t.id))
  }
];

// Backlog items (not in any sprint)
const initialBacklogItems = initialTickets.filter(t => !initialSprints.some(s => s.items.some(i => i.id === t.id)));

// Define context type
interface JiraContextType {
  teamMembers: TeamMember[];
  columns: Record<string, ColumnType>;
  sprints: SprintType[];
  backlogItems: TicketType[];
  selectedMemberIds: string[];
  setSelectedMemberIds: (ids: string[]) => void;
  createTicket: (ticket: Omit<TicketType, 'id' | 'itemKey'>) => TicketType;
  updateTicketStatus: (ticketId: string, status: string) => boolean;
  createColumn: (title: string, color: string) => ColumnType;
  getAllTickets: () => TicketType[];
  getFilteredTickets: (options: { 
    assignee?: string, 
    status?: string, 
    type?: 'bug' | 'task' | 'story' | 'epic' 
  }) => TicketType[];
}

// Create context
const JiraContext = createContext<JiraContextType | undefined>(undefined);

// Provider component
export const JiraProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [teamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [columns, setColumns] = useState<Record<string, ColumnType>>(initialColumns);
  const [sprints, setSprints] = useState<SprintType[]>(initialSprints);
  const [backlogItems, setBacklogItems] = useState<TicketType[]>(initialBacklogItems);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [nextTicketId, setNextTicketId] = useState(106); // JR-106 will be the next ID

  // Create a new ticket
  const createTicket = (ticketData: Omit<TicketType, 'id' | 'itemKey'>) => {
    const id = `JR-${nextTicketId}`;
    
    const newTicket: TicketType = {
      ...ticketData,
      id,
      itemKey: id,
      status: ticketData.status || 'To Do' // Default to To Do
    };
    
    // Add to the appropriate column
    setColumns(prev => {
      const newColumns = { ...prev };
      const targetColumnKey = Object.keys(newColumns).find(
        key => newColumns[key].title === newTicket.status
      );
      
      if (targetColumnKey) {
        newColumns[targetColumnKey] = {
          ...newColumns[targetColumnKey],
          items: [...newColumns[targetColumnKey].items, newTicket]
        };
      } else {
        // If no matching column, add to the first column (To Do)
        const firstColumn = Object.keys(newColumns)[0];
        newColumns[firstColumn] = {
          ...newColumns[firstColumn],
          items: [...newColumns[firstColumn].items, newTicket]
        };
        newTicket.status = newColumns[firstColumn].title;
      }
      
      return newColumns;
    });
    
    // Add to backlog
    setBacklogItems(prev => [...prev, newTicket]);
    
    // Increment the next ID
    setNextTicketId(prev => prev + 1);
    
    return newTicket;
  };

  // Update a ticket's status
  const updateTicketStatus = (ticketId: string, status: string) => {
    let ticket: TicketType | undefined;
    let foundTicket = false;
    
    // Find the ticket and remove it from its current column
    setColumns(prev => {
      const newColumns = { ...prev };
      
      // Find and remove the ticket from its current column
      Object.keys(newColumns).forEach(colKey => {
        const column = newColumns[colKey];
        const ticketIndex = column.items.findIndex(item => item.id === ticketId);
        
        if (ticketIndex !== -1) {
          foundTicket = true;
          ticket = { ...column.items[ticketIndex] };
          newColumns[colKey] = {
            ...column,
            items: [...column.items.slice(0, ticketIndex), ...column.items.slice(ticketIndex + 1)]
          };
        }
      });
      
      if (foundTicket && ticket) {
        // Update the ticket status
        ticket.status = status;
        
        // Add the ticket to the target column
        const targetColumnKey = Object.keys(newColumns).find(
          key => newColumns[key].title === status
        );
        
        if (targetColumnKey) {
          newColumns[targetColumnKey] = {
            ...newColumns[targetColumnKey],
            items: [...newColumns[targetColumnKey].items, ticket]
          };
        } else {
          // If target column doesn't exist, don't add the ticket
          // This is an error condition
          foundTicket = false;
        }
      }
      
      return newColumns;
    });
    
    // Update the ticket in sprints or backlog
    if (foundTicket) {
      // Check if the ticket is in any sprint
      let inSprint = false;
      
      setSprints(prev => prev.map(sprint => {
        const ticketIndex = sprint.items.findIndex(item => item.id === ticketId);
        
        if (ticketIndex !== -1) {
          inSprint = true;
          const updatedItems = [...sprint.items];
          updatedItems[ticketIndex] = { ...updatedItems[ticketIndex], status };
          
          return {
            ...sprint,
            items: updatedItems
          };
        }
        
        return sprint;
      }));
      
      // If not in a sprint, update backlog
      if (!inSprint) {
        setBacklogItems(prev => prev.map(item => 
          item.id === ticketId ? { ...item, status } : item
        ));
      }
    }
    
    return foundTicket;
  };

  // Create a new column
  const createColumn = (title: string, color: string) => {
    const id = `column-${Object.keys(columns).length + 1}`;
    
    const newColumn: ColumnType = {
      id,
      title,
      color: color || '#e2e8f0',
      items: []
    };
    
    setColumns(prev => ({
      ...prev,
      [id]: newColumn
    }));
    
    return newColumn;
  };

  // Get all tickets from all sources
  const getAllTickets = (): TicketType[] => {
    const allTickets: TicketType[] = [];
    
    // Add tickets from columns
    Object.values(columns).forEach(column => {
      column.items.forEach(item => {
        if (!allTickets.some(t => t.id === item.id)) {
          allTickets.push(item);
        }
      });
    });
    
    // Add tickets from sprints
    sprints.forEach(sprint => {
      sprint.items.forEach(item => {
        if (!allTickets.some(t => t.id === item.id)) {
          allTickets.push(item);
        }
      });
    });
    
    // Add tickets from backlog
    backlogItems.forEach(item => {
      if (!allTickets.some(t => t.id === item.id)) {
        allTickets.push(item);
      }
    });
    
    return allTickets;
  };

  // Get filtered tickets based on criteria
  const getFilteredTickets = (options: { assignee?: string, status?: string, type?: 'bug' | 'task' | 'story' | 'epic' }): TicketType[] => {
    let filteredTickets = getAllTickets();
    
    const { assignee, status, type } = options;
    
    if (assignee) {
      filteredTickets = filteredTickets.filter(t => 
        t.assignee?.name.toLowerCase().includes(assignee.toLowerCase())
      );
    }
    
    if (status) {
      filteredTickets = filteredTickets.filter(t => 
        t.status.toLowerCase() === status.toLowerCase()
      );
    }
    
    if (type) {
      filteredTickets = filteredTickets.filter(t => t.type === type);
    }
    
    return filteredTickets;
  };

  const contextValue: JiraContextType = {
    teamMembers,
    columns,
    sprints,
    backlogItems,
    selectedMemberIds,
    setSelectedMemberIds,
    createTicket,
    updateTicketStatus,
    createColumn,
    getAllTickets,
    getFilteredTickets
  };

  return (
    <JiraContext.Provider value={contextValue}>
      {children}
    </JiraContext.Provider>
  );
};

// Custom hook for using the context
export const useJira = () => {
  const context = useContext(JiraContext);
  if (context === undefined) {
    throw new Error('useJira must be used within a JiraProvider');
  }
  return context;
};
