import { NextResponse } from 'next/server';
import OpenAI from 'openai';

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

// Function schemas for the OpenAI assistant
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

export async function POST(request: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key missing. Please add OPENAI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }
    
    const body = await request.json();
    const { messages, functionResults } = body;
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages are required and must be an array' },
        { status: 400 }
      );
    }

    // If previous function results are present, use them to formulate a response
    if (functionResults) {
      const { function: func, result } = functionResults;
      
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

    // Make the actual API call to OpenAI with function calling
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      tools: functionSchemas.map(schema => ({
        type: "function",
        function: schema
      })),
      tool_choice: "auto"
    });

    const responseMessage = response.choices[0].message;

    // Check if the model wants to call a function
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      const toolCall = responseMessage.tool_calls[0];
      const functionName = toolCall.function.name;
      let args = {};
      
      try {
        args = JSON.parse(toolCall.function.arguments);
      } catch (error) {
        console.error('Failed to parse function arguments', error);
      }
      
      return NextResponse.json({
        functionCall: {
          name: functionName,
          arguments: args
        }
      });
    }
    
    // Return the text response
    return NextResponse.json({ message: responseMessage.content });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate a response' },
      { status: 500 }
    );
  }
}
