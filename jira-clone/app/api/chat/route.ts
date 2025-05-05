import { NextResponse } from 'next/server';

interface TicketType {
  id: string;
  title: string;
  type: 'bug' | 'task' | 'story' | 'epic';
  status: string;
  assignee?: {
    name: string;
    avatar: string;
  };
  priority?: 'low' | 'medium' | 'high';
}

interface ColumnType {
  id: string;
  title: string;
  color: string;
  items: TicketType[];
}

// Mock data storage
let tickets: TicketType[] = [
  { 
    id: 'JR-101', 
    title: 'Fix login page responsiveness', 
    type: 'bug', 
    status: 'In Progress',
    assignee: { name: 'Alex Martinez', avatar: 'https://i.pravatar.cc/150?img=1' },
    priority: 'high'
  },
  { 
    id: 'JR-102', 
    title: 'Implement user settings page', 
    type: 'task', 
    status: 'To Do',
    assignee: { name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/150?img=5' },
    priority: 'medium'
  },
  { 
    id: 'JR-103', 
    title: 'Redesign dashboard UI', 
    type: 'story', 
    status: 'Done',
    assignee: { name: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?img=3' },
    priority: 'medium'
  }
];

let columns: ColumnType[] = [
  {
    id: 'column-1',
    title: 'To Do',
    color: '#e2e8f0',
    items: [tickets.find(t => t.id === 'JR-102')!]
  },
  {
    id: 'column-2',
    title: 'In Progress',
    color: '#93c5fd',
    items: [tickets.find(t => t.id === 'JR-101')!]
  },
  {
    id: 'column-3',
    title: 'Done',
    color: '#86efac',
    items: [tickets.find(t => t.id === 'JR-103')!]
  }
];

// Available functions that can be called by the assistant
const functions = {
  // Create a new ticket
  create_ticket: ({ title, type, assignee, priority }: { 
    title: string, 
    type: 'bug' | 'task' | 'story' | 'epic',
    assignee?: string,
    priority?: 'low' | 'medium' | 'high'
  }) => {
    const newId = `JR-${104 + tickets.length}`;
    const newTicket: TicketType = {
      id: newId,
      title,
      type,
      status: 'To Do',
      priority: priority || 'medium'
    };
    
    if (assignee) {
      // This is a mock implementation - in a real app we'd lookup the user
      newTicket.assignee = {
        name: assignee,
        avatar: `https://i.pravatar.cc/150?img=${(Math.floor(Math.random() * 30) + 1)}`
      };
    }
    
    tickets.push(newTicket);
    
    // Add to the To Do column
    columns[0].items.push(newTicket);
    
    return {
      success: true,
      ticket: newTicket,
      message: `Created ticket ${newId}: ${title}`
    };
  },
  
  // List tickets with filtering
  list_tickets: ({ assignee, status, type }: {
    assignee?: string,
    status?: string,
    type?: 'bug' | 'task' | 'story' | 'epic'
  }) => {
    let filteredTickets = [...tickets];
    
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
    
    return {
      tickets: filteredTickets,
      count: filteredTickets.length,
      message: `Found ${filteredTickets.length} tickets`
    };
  },
  
  // Create a new column
  create_column: ({ title, color }: { title: string, color?: string }) => {
    const newId = `column-${columns.length + 1}`;
    const newColumn: ColumnType = {
      id: newId,
      title,
      color: color || '#e2e8f0',
      items: []
    };
    
    columns.push(newColumn);
    
    return {
      success: true,
      column: newColumn,
      message: `Created column: ${title}`
    };
  },
  
  // Change a ticket's status (move to different column)
  update_ticket_status: ({ ticketId, status }: { ticketId: string, status: string }) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) {
      return {
        success: false,
        message: `Ticket ${ticketId} not found`
      };
    }
    
    // Find the target column
    const targetColumn = columns.find(c => 
      c.title.toLowerCase() === status.toLowerCase()
    );
    
    if (!targetColumn) {
      return {
        success: false,
        message: `Column with status "${status}" not found`
      };
    }
    
    // Remove from current column
    columns.forEach(column => {
      column.items = column.items.filter(item => item.id !== ticketId);
    });
    
    // Add to new column
    targetColumn.items.push(ticket);
    
    // Update ticket status
    ticket.status = targetColumn.title;
    
    return {
      success: true,
      ticket,
      message: `Moved ticket ${ticketId} to ${status}`
    };
  },
  
  // Assign a ticket to a team member
  assign_ticket: ({ ticketId, assignee }: { ticketId: string, assignee: string }) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) {
      return {
        success: false,
        message: `Ticket ${ticketId} not found`
      };
    }
    
    // Update the ticket's assignee
    ticket.assignee = {
      name: assignee,
      avatar: `https://i.pravatar.cc/150?img=${(Math.floor(Math.random() * 30) + 1)}`
    };
    
    // Update the ticket in the columns
    for (const column of columns) {
      const ticketIndex = column.items.findIndex(item => item.id === ticketId);
      if (ticketIndex !== -1) {
        column.items[ticketIndex] = ticket;
      }
    }
    
    return {
      success: true,
      ticket,
      message: `Assigned ticket ${ticketId} to ${assignee}`
    };
  },
  
  // Get all columns with their tickets
  get_board: () => {
    return {
      columns,
      message: `Retrieved board with ${columns.length} columns`
    };
  }
};

// Define function schemas for the assistant
const functionSchemas = [
  {
    name: 'create_ticket',
    description: 'Create a new ticket in the backlog',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Title of the ticket'
        },
        type: {
          type: 'string',
          enum: ['bug', 'task', 'story', 'epic'],
          description: 'Type of the ticket'
        },
        assignee: {
          type: 'string',
          description: 'Name of the assignee (optional)'
        },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'Priority of the ticket (optional, defaults to medium)'
        }
      },
      required: ['title', 'type']
    }
  },
  {
    name: 'list_tickets',
    description: 'List tickets with optional filtering',
    parameters: {
      type: 'object',
      properties: {
        assignee: {
          type: 'string',
          description: 'Filter by assignee name (partial match)'
        },
        status: {
          type: 'string',
          description: 'Filter by status (exact match)'
        },
        type: {
          type: 'string',
          enum: ['bug', 'task', 'story', 'epic'],
          description: 'Filter by ticket type'
        }
      }
    }
  },
  {
    name: 'create_column',
    description: 'Create a new column in the board',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Title of the column'
        },
        color: {
          type: 'string',
          description: 'Color code for the column (optional, defaults to light gray)'
        }
      },
      required: ['title']
    }
  },
  {
    name: 'update_ticket_status',
    description: 'Update a ticket\'s status (move to different column)',
    parameters: {
      type: 'object',
      properties: {
        ticketId: {
          type: 'string',
          description: 'ID of the ticket to update'
        },
        status: {
          type: 'string',
          description: 'New status for the ticket (e.g., To Do, In Progress, Done)'
        }
      },
      required: ['ticketId', 'status']
    }
  },
  {
    name: 'assign_ticket',
    description: 'Assign a ticket to a team member',
    parameters: {
      type: 'object',
      properties: {
        ticketId: {
          type: 'string',
          description: 'ID of the ticket to assign'
        },
        assignee: {
          type: 'string',
          description: 'Name of the team member to assign the ticket to'
        }
      },
      required: ['ticketId', 'assignee']
    }
  },
  {
    name: 'get_board',
    description: 'Get all columns with their tickets',
    parameters: {
      type: 'object',
      properties: {}
    }
  }
];

// Mock function to simulate AI response with function calling
async function simulateAIResponse(messages: any[], functionCall?: string) {
  // Get the most recent user message
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';
  
  // Parse the user message to determine if we should call a function
  const lowerCaseMessage = lastUserMessage.toLowerCase();
  
  // If a specific function was requested in previous interaction, call it
  if (functionCall) {
    return {
      type: 'function_call',
      function: functionCall,
      arguments: '{}' // This would be filled with parsed arguments in a real implementation
    };
  }

  // Create ticket intent
  if (lowerCaseMessage.includes('create') && 
      (lowerCaseMessage.includes('ticket') || lowerCaseMessage.includes('issue') || lowerCaseMessage.includes('task'))) {
    
    // Extract title and type from message
    const args: any = {};
    
    // Auto-generate title if not explicitly stated
    if (lowerCaseMessage.includes('implement')) {
      const implementMatch = lastUserMessage.match(/implement\s+([a-zA-Z0-9\s]+)/i);
      if (implementMatch && implementMatch[1]) {
        args.title = `Implement ${implementMatch[1].trim()}`;
      }
    } else if (lowerCaseMessage.includes('add')) {
      const addMatch = lastUserMessage.match(/add\s+([a-zA-Z0-9\s]+)/i);
      if (addMatch && addMatch[1]) {
        args.title = `Add ${addMatch[1].trim()}`;
      }
    } else if (lowerCaseMessage.includes('fix')) {
      const fixMatch = lastUserMessage.match(/fix\s+([a-zA-Z0-9\s]+)/i);
      if (fixMatch && fixMatch[1]) {
        args.title = `Fix ${fixMatch[1].trim()}`;
      }
    } else if (lowerCaseMessage.includes('for')) {
      const forMatch = lastUserMessage.match(/for\s+([a-zA-Z0-9\s]+)/i);
      if (forMatch && forMatch[1]) {
        args.title = forMatch[1].trim();
      }
    }
    
    // If we couldn't extract a title, try to generate one based on the request content
    if (!args.title && lowerCaseMessage.includes('rag')) {
      args.title = 'Implement RAG for chatbot';
    } else if (!args.title && lowerCaseMessage.length > 20) {
      // Use the user's message as a title if it's reasonably long
      args.title = lastUserMessage.replace(/create\s+(a|new)?\s*(ticket|issue|task)\s*(for|to)?/i, '').trim();
      if (args.title.length < 5) args.title = null;
    }
    
    // Extract type from message
    if (lowerCaseMessage.includes('feature')) {
      args.type = 'feature';
    } else if (lowerCaseMessage.includes('bug')) {
      args.type = 'bug';
    } else if (lowerCaseMessage.includes('task')) {
      args.type = 'task';
    } else if (lowerCaseMessage.includes('story')) {
      args.type = 'story';
    } else if (lowerCaseMessage.includes('epic')) {
      args.type = 'epic';
    } else {
      // Default to task if no type is specified
      args.type = 'task';
    }
    
    // Check for priority
    if (lowerCaseMessage.includes('high priority') || lowerCaseMessage.includes('urgent')) {
      args.priority = 'high';
    } else if (lowerCaseMessage.includes('low priority')) {
      args.priority = 'low';
    }
    
    // Check for assignee
    const assigneeMatches = [
      { regex: /assign to (.*?)(?: |$)/i, group: 1 },
      { regex: /assigned to (.*?)(?: |$)/i, group: 1 }
    ];
    
    for (const match of assigneeMatches) {
      const assigneeMatch = lastUserMessage.match(match.regex);
      if (assigneeMatch && assigneeMatch[match.group]) {
        args.assignee = assigneeMatch[match.group].trim();
        break;
      }
    }
    
    return {
      type: 'function_call',
      function: 'create_ticket',
      arguments: args
    };
  }
  
  // List tickets intent
  if ((lowerCaseMessage.includes('list') || lowerCaseMessage.includes('show') || lowerCaseMessage.includes('get')) && 
      (lowerCaseMessage.includes('ticket') || lowerCaseMessage.includes('issue') || lowerCaseMessage.includes('task'))) {
    return {
      type: 'function_call',
      function: 'list_tickets',
      arguments: {}
    };
  }
  
  // Create column intent
  if (lowerCaseMessage.includes('create') && lowerCaseMessage.includes('column')) {
    return {
      type: 'function_call',
      function: 'create_column',
      arguments: {}
    };
  }
  
  // Update ticket status intent
  if ((lowerCaseMessage.includes('update') || lowerCaseMessage.includes('move') || lowerCaseMessage.includes('change')) && 
      (lowerCaseMessage.includes('ticket') || lowerCaseMessage.includes('issue') || lowerCaseMessage.includes('task')) &&
      (lowerCaseMessage.includes('status'))) {
    return {
      type: 'function_call',
      function: 'update_ticket_status',
      arguments: {}
    };
  }
  
  // Assign ticket intent
  if ((lowerCaseMessage.includes('assign') || lowerCaseMessage.includes('give')) && 
      (lowerCaseMessage.includes('ticket') || lowerCaseMessage.includes('issue') || lowerCaseMessage.includes('task') || lowerCaseMessage.match(/jr-\d+/i))) {
    
    // Extract ticket ID and assignee from message
    const args: any = {};
    
    // Extract ticket ID using regex pattern JR-XXX where XXX is a number
    const ticketIdMatch = lastUserMessage.match(/JR-\d+/i);
    if (ticketIdMatch) {
      args.ticketId = ticketIdMatch[0];
    }
    
    // If no specific ticket ID was found, look for "this ticket" and use the most recently created ticket
    if (!args.ticketId && (lowerCaseMessage.includes('this ticket') || lowerCaseMessage.includes('it to'))) {
      // Get the last created ticket ID (we'll use the highest ID number as a simple heuristic)
      const highestId = tickets.reduce((max, ticket) => {
        const idNum = parseInt(ticket.id.replace('JR-', ''));
        return idNum > max ? idNum : max;
      }, 0);
      
      if (highestId > 0) {
        args.ticketId = `JR-${highestId}`;
      }
    }
    
    // Extract assignee name, looking for specific patterns
    let assigneeName = '';
    
    // Look for "to X" pattern
    const toPattern = /(?:to|with)\s+([a-zA-Z\s]+)(?:$|\.|\,|\;)/i;
    const toMatch = lastUserMessage.match(toPattern);
    if (toMatch && toMatch[1]) {
      assigneeName = toMatch[1].trim();
    }
    
    // Process the assignee name
    if (assigneeName) {
      // Attempt to match with team members, allowing partial matches
      const allTeamMembers = [
        'Alex Martinez', 'Sarah Johnson', 'Michael Chen', 'Emily Wilson', 
        'David Kim', 'Jessica Taylor', 'Robert Garcia', 'Lisa Brown',
        'John Wilson', 'Sophia Miller'
      ];
      
      // First look for exact matches
      const exactMatch = allTeamMembers.find(member => 
        member.toLowerCase() === assigneeName.toLowerCase()
      );
      
      if (exactMatch) {
        args.assignee = exactMatch;
      } else {
        // Then look for partial matches
        for (const member of allTeamMembers) {
          const nameParts = member.toLowerCase().split(' ');
          
          // Check if the assignee name starts with the first name
          if (nameParts[0] === assigneeName.toLowerCase() || 
              member.toLowerCase().includes(assigneeName.toLowerCase())) {
            args.assignee = member;
            break;
          }
        }
      }
    }
    
    // Simple name shortcuts
    if (!args.assignee) {
      if (lowerCaseMessage.includes('alex')) {
        args.assignee = 'Alex Martinez';
      } else if (lowerCaseMessage.includes('sarah')) {
        args.assignee = 'Sarah Johnson';
      } else if (lowerCaseMessage.includes('michael')) {
        args.assignee = 'Michael Chen';
      } else if (lowerCaseMessage.includes('emily')) {
        args.assignee = 'Emily Wilson';
      } else if (lowerCaseMessage.includes('david')) {
        args.assignee = 'David Kim';
      }
    }
    
    return {
      type: 'function_call',
      function: 'assign_ticket',
      arguments: args
    };
  }
  
  // Get board intent
  if ((lowerCaseMessage.includes('show') || lowerCaseMessage.includes('get')) && 
      lowerCaseMessage.includes('board')) {
    return {
      type: 'function_call',
      function: 'get_board',
      arguments: {}
    };
  }
  
  // Default responses if no function call is needed
  if (lowerCaseMessage.includes('sprint')) {
    return {
      type: 'text',
      content: "Based on your sprint data, I recommend focusing on the high-priority tasks first. Would you like me to help you organize your sprint backlog?"
    };
  } else if (lowerCaseMessage.includes('team') || lowerCaseMessage.includes('member')) {
    return {
      type: 'text',
      content: "Your team currently has 10 members assigned to this project. The most active contributors this sprint are Alex and Sarah."
    };
  } else if (lowerCaseMessage.includes('progress')) {
    return {
      type: 'text',
      content: "Current sprint is 65% complete with 12 out of 20 story points completed. You're on track to meet your sprint goals."
    };
  } else if (lowerCaseMessage.includes('deadline') || lowerCaseMessage.includes('date')) {
    return {
      type: 'text',
      content: "The current sprint ends on May 15, 2025. You have 3 high-priority tasks that should be completed by then."
    };
  } else if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
    return {
      type: 'text',
      content: "Hello! I'm your Jira Labs assistant. I can help with managing tasks, sprints, and team allocation. You can ask me to create tickets, list tasks, create columns, or update ticket statuses."
    };
  } else {
    return {
      type: 'text',
      content: "I'm here to help with your project management needs. You can ask me to create tickets, list tasks by various filters, create board columns, or update ticket statuses."
    };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, functionResults } = body;
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages are required and must be an array' },
        { status: 400 }
      );
    }

    // If previous function results are present, use them to formulate a response
    let functionName = null;
    if (functionResults) {
      const { function: func, result } = functionResults;
      functionName = func;
      
      // Format appropriate response based on function result
      let responseMessage = "I've processed your request.";
      
      if (func === 'create_ticket' && result.success) {
        responseMessage = `I've created a new ticket ${result.ticket.id}: "${result.ticket.title}" with type "${result.ticket.type}"`;
        if (result.ticket.assignee) {
          responseMessage += ` and assigned it to ${result.ticket.assignee.name}`;
        }
        responseMessage += `. It's been added to the ${result.ticket.status} column with ${result.ticket.priority} priority.`;
      } 
      else if (func === 'list_tickets') {
        if (result.count === 0) {
          responseMessage = "I couldn't find any tickets matching your criteria.";
        } else {
          responseMessage = `I found ${result.count} tickets:`;
          result.tickets.forEach((ticket: TicketType) => {
            const assigneeInfo = ticket.assignee ? `assigned to ${ticket.assignee.name}` : 'unassigned';
            responseMessage += `\n- ${ticket.id}: "${ticket.title}" (${ticket.type}, ${ticket.status}, ${assigneeInfo})`;
          });
        }
      }
      else if (func === 'create_column' && result.success) {
        responseMessage = `I've created a new column "${result.column.title}" with ${result.column.color} color.`;
      }
      else if (func === 'update_ticket_status') {
        if (result.success) {
          responseMessage = `I've moved ticket ${result.ticket.id} "${result.ticket.title}" to the ${result.ticket.status} column.`;
        } else {
          responseMessage = result.message;
        }
      }
      else if (func === 'assign_ticket') {
        if (result.success) {
          responseMessage = `I've assigned ticket ${result.ticket.id} "${result.ticket.title}" to ${result.ticket.assignee.name}.`;
        } else {
          responseMessage = result.message;
        }
      }
      else if (func === 'get_board') {
        responseMessage = `Here's the current board state:`;
        result.columns.forEach((column: ColumnType) => {
          responseMessage += `\n- ${column.title} (${column.items.length} items)`;
          if (column.items.length > 0) {
            column.items.forEach((item: TicketType) => {
              responseMessage += `\n  · ${item.id}: "${item.title}" (${item.type})`;
            });
          }
        });
      }
      
      return NextResponse.json({ message: responseMessage });
    }

    // Check if we need to call a function
    const aiResponse = await simulateAIResponse(messages, functionName || undefined);
    
    if (aiResponse.type === 'function_call') {
      return NextResponse.json({
        functionCall: {
          name: aiResponse.function,
          arguments: aiResponse.arguments
        }
      });
    }
    
    return NextResponse.json({ message: aiResponse.content });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate a response' },
      { status: 500 }
    );
  }
}
