"use client";

import React, { useState, useEffect } from 'react';
import { useJira } from '../context/JiraContext';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{type: 'user' | 'assistant', text: string}[]>([
    {type: 'assistant', text: 'Hi there! I\'m your Jira Labs assistant. How can I help you today? You can ask me to create tickets, list tasks, create columns, or update ticket statuses.'}
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFunction, setCurrentFunction] = useState<{
    name: string;
    arguments: Record<string, any>;
    pendingInput?: Record<string, boolean>;
  } | null>(null);

  // Access the Jira context for state management
  const { 
    createTicket, 
    updateTicketStatus, 
    createColumn, 
    getAllTickets, 
    getFilteredTickets,
    columns,
    teamMembers 
  } = useJira();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = { type: 'user' as const, text: message };
    setChatHistory(prev => [...prev, userMessage]);
    
    // Clear input
    setMessage('');
    
    // If we're waiting for function input, use the message to update function arguments
    if (currentFunction && currentFunction.pendingInput) {
      const updatedFunction = { ...currentFunction };
      const pendingArgs = { ...updatedFunction.pendingInput };
      const pendingArgName = Object.keys(pendingArgs)[0]; // Get the first pending argument
      
      if (pendingArgName) {
        // Update the argument with the user's message
        updatedFunction.arguments[pendingArgName] = message;
        delete pendingArgs[pendingArgName];
        
        // If there are more arguments to collect, update the pending state
        if (Object.keys(pendingArgs).length > 0) {
          updatedFunction.pendingInput = pendingArgs;
          setCurrentFunction(updatedFunction);
          
          // Ask for the next argument
          const nextArgName = Object.keys(pendingArgs)[0];
          setChatHistory(prev => [
            ...prev, 
            { type: 'assistant', text: `Please provide the ${nextArgName} for ${updatedFunction.name}:` }
          ]);
          
          return;
        } else {
          // All arguments collected, execute the function
          await executeFunctionCall(updatedFunction.name, updatedFunction.arguments);
          setCurrentFunction(null);
          return;
        }
      }
    }
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Prepare chat history in format expected by API
      const messages = chatHistory.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      
      // Add the new user message
      messages.push({
        role: 'user',
        content: userMessage.text
      });

      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }
      
      const data = await response.json();
      
      // Check if we got a function call
      if (data.functionCall) {
        handleFunctionCall(data.functionCall);
      } else {
        // Add AI response to chat
        setChatHistory(prev => [
          ...prev, 
          { type: 'assistant', text: data.message || 'Sorry, I couldn\'t process your request.' }
        ]);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      setChatHistory(prev => [
        ...prev, 
        { type: 'assistant', text: 'Sorry, there was an error processing your request. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle a function call from the API
  const handleFunctionCall = (functionCall: { name: string, arguments: any }) => {
    const { name, arguments: args } = functionCall;
    
    // Parse the arguments if they're a string
    const parsedArgs = typeof args === 'string' ? JSON.parse(args) : args;
    
    // Based on the function, we might need to collect additional information
    switch (name) {
      case 'create_ticket': {
        // Required: title, type
        const pendingInput: Record<string, boolean> = {};
        const functionArgs: Record<string, any> = { ...parsedArgs };
        
        if (!functionArgs.title) {
          pendingInput.title = true;
        }
        
        if (!functionArgs.type) {
          pendingInput.type = true;
        }
        
        // Optional: assignee, priority
        
        // If we need to collect arguments, set the current function and ask for input
        if (Object.keys(pendingInput).length > 0) {
          setCurrentFunction({
            name,
            arguments: functionArgs,
            pendingInput
          });
          
          // Ask for the first pending argument
          const firstArg = Object.keys(pendingInput)[0];
          setChatHistory(prev => [
            ...prev, 
            { type: 'assistant', text: `I'll help you create a ticket. Please provide the ${firstArg}:` }
          ]);
          
          return;
        }
        
        // If we have all arguments, execute the function
        executeFunctionCall(name, functionArgs);
        break;
      }
      
      case 'list_tickets': {
        // All arguments are optional for list_tickets
        executeFunctionCall(name, parsedArgs);
        break;
      }
      
      case 'create_column': {
        // Required: title
        const pendingInput: Record<string, boolean> = {};
        const functionArgs: Record<string, any> = { ...parsedArgs };
        
        if (!functionArgs.title) {
          pendingInput.title = true;
        }
        
        // If we need to collect arguments, set the current function and ask for input
        if (Object.keys(pendingInput).length > 0) {
          setCurrentFunction({
            name,
            arguments: functionArgs,
            pendingInput
          });
          
          // Ask for the title
          setChatHistory(prev => [
            ...prev, 
            { type: 'assistant', text: `I'll help you create a column. What title would you like for the column?` }
          ]);
          
          return;
        }
        
        // If we have all arguments, execute the function
        executeFunctionCall(name, functionArgs);
        break;
      }
      
      case 'update_ticket_status': {
        // Required: ticketId, status
        const pendingInput: Record<string, boolean> = {};
        const functionArgs: Record<string, any> = { ...parsedArgs };
        
        if (!functionArgs.ticketId) {
          pendingInput.ticketId = true;
        }
        
        if (!functionArgs.status) {
          pendingInput.status = true;
        }
        
        // If we need to collect arguments, set the current function and ask for input
        if (Object.keys(pendingInput).length > 0) {
          setCurrentFunction({
            name,
            arguments: functionArgs,
            pendingInput
          });
          
          // Ask for the first pending argument
          const firstArg = Object.keys(pendingInput)[0];
          setChatHistory(prev => [
            ...prev, 
            { type: 'assistant', text: `I'll help you update a ticket's status. Please provide the ${firstArg === 'ticketId' ? 'ticket ID' : 'new status'}:` }
          ]);
          
          return;
        }
        
        // If we have all arguments, execute the function
        executeFunctionCall(name, functionArgs);
        break;
      }
      
      case 'assign_ticket': {
        // Find the ticket
        const allTickets = getAllTickets();
        const ticket = allTickets.find(t => t.id === args.ticketId);
        
        if (!ticket) {
          setChatHistory(prev => [
            ...prev, 
            { type: 'assistant', text: `Ticket ${args.ticketId} not found` }
          ]);
          break;
        }
        
        // Find the team member - more intelligent matching allowing for partial names
        let teamMember = null;
        
        // If we have an exact match, use it
        if (args.assignee) {
          teamMember = teamMembers.find(m => 
            m.name.toLowerCase() === args.assignee.toLowerCase()
          );
          
          // If no exact match, try partial matches
          if (!teamMember) {
            for (const member of teamMembers) {
              const nameParts = member.name.toLowerCase().split(' ');
              
              // Check if the assignee matches first name
              if (nameParts[0] === args.assignee.toLowerCase() || 
                  member.name.toLowerCase().includes(args.assignee.toLowerCase())) {
                teamMember = member;
                break;
              }
            }
          }
        }
        
        if (!teamMember) {
          setChatHistory(prev => [
            ...prev, 
            { type: 'assistant', text: `Team member "${args.assignee}" not found. Available team members are: ${teamMembers.map(m => m.name).join(', ')}` }
          ]);
          break;
        }
        
        // Update the ticket's assignee
        ticket.assignee = {
          name: teamMember.name,
          avatar: teamMember.avatar
        };
        
        // Update the status (this is a shortcut - in a real app we'd update the ticket in place)
        updateTicketStatus(ticket.id, ticket.status);
        
        setChatHistory(prev => [
          ...prev, 
          { type: 'assistant', text: `Ticket ${ticket.id} assigned to ${teamMember.name}` }
        ]);
        break;
      }
      
      case 'get_board': {
        // No arguments needed for get_board
        executeFunctionCall(name, {});
        break;
      }
      
      default:
        // Unknown function
        setChatHistory(prev => [
          ...prev, 
          { type: 'assistant', text: `I'm not sure how to handle the function "${name}". Could you try rephrasing your request?` }
        ]);
    }
  };

  // Execute a function call using the global Jira context
  const executeFunctionCall = async (functionName: string, args: Record<string, any>) => {
    setIsLoading(true);
    
    try {
      let result;
      
      // Execute the function using the Jira context
      switch (functionName) {
        case 'create_ticket': {
          // Find assignee object if name is provided
          let assigneeObj = undefined;
          if (args.assignee) {
            const foundMember = teamMembers.find(m => 
              m.name.toLowerCase().includes(args.assignee.toLowerCase())
            );
            if (foundMember) {
              assigneeObj = {
                name: foundMember.name,
                avatar: foundMember.avatar
              };
            }
          }
          
          const newTicket = createTicket({
            title: args.title,
            type: args.type,
            priority: args.priority || 'medium',
            assignee: assigneeObj,
            status: 'To Do' // Default to To Do for new tickets
          });
          
          result = {
            success: true,
            ticket: newTicket
          };
          break;
        }
        
        case 'list_tickets': {
          const tickets = getFilteredTickets({
            assignee: args.assignee,
            status: args.status,
            type: args.type
          });
          
          result = {
            tickets,
            count: tickets.length
          };
          break;
        }
        
        case 'create_column': {
          const newColumn = createColumn(args.title, args.color);
          
          result = {
            success: true,
            column: newColumn
          };
          break;
        }
        
        case 'update_ticket_status': {
          const success = updateTicketStatus(args.ticketId, args.status);
          
          const ticket = getAllTickets().find(t => t.id === args.ticketId);
          
          result = {
            success,
            ticket
          };
          break;
        }
        
        case 'assign_ticket': {
          // Find the ticket
          const allTickets = getAllTickets();
          const ticket = allTickets.find(t => t.id === args.ticketId);
          
          if (!ticket) {
            result = {
              success: false,
              message: `Ticket ${args.ticketId} not found`
            };
            break;
          }
          
          // Find the team member - more intelligent matching allowing for partial names
          let teamMember = null;
          
          // If we have an exact match, use it
          if (args.assignee) {
            teamMember = teamMembers.find(m => 
              m.name.toLowerCase() === args.assignee.toLowerCase()
            );
            
            // If no exact match, try partial matches
            if (!teamMember) {
              for (const member of teamMembers) {
                const nameParts = member.name.toLowerCase().split(' ');
                
                // Check if the assignee matches first name
                if (nameParts[0] === args.assignee.toLowerCase() || 
                    member.name.toLowerCase().includes(args.assignee.toLowerCase())) {
                  teamMember = member;
                  break;
                }
              }
            }
          }
          
          if (!teamMember) {
            result = {
              success: false,
              message: `Team member "${args.assignee}" not found. Available team members are: ${teamMembers.map(m => m.name).join(', ')}`
            };
            break;
          }
          
          // Update the ticket's assignee
          ticket.assignee = {
            name: teamMember.name,
            avatar: teamMember.avatar
          };
          
          // Update the status (this is a shortcut - in a real app we'd update the ticket in place)
          updateTicketStatus(ticket.id, ticket.status);
          
          result = {
            success: true,
            ticket
          };
          break;
        }
        
        case 'get_board': {
          result = {
            columns
          };
          break;
        }
        
        default:
          throw new Error(`Unknown function: ${functionName}`);
      }
      
      // Call the API with the function name and result for formatting the response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [],  // Not needed for function execution
          functionResults: {
            function: functionName,
            result
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to execute function ${functionName}`);
      }
      
      const data = await response.json();
      
      // Add the response to the chat
      setChatHistory(prev => [
        ...prev, 
        { type: 'assistant', text: data.message || 'Function executed successfully.' }
      ]);
    } catch (error) {
      console.error(`Error executing function ${functionName}:`, error);
      setChatHistory(prev => [
        ...prev, 
        { type: 'assistant', text: `Sorry, there was an error executing the function ${functionName}. Please try again.` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-10 right-10 z-50">
        <button 
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-blue-700 transition-colors relative hover:scale-110 transform duration-200 ease-in-out"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Jira Labs"
          style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }}
        >
          <span className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 text-[10px] font-bold rounded-full px-1.5 py-0.5 border border-amber-500 shadow-sm">
            NEW
          </span>
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Chatbot modal */}
      {isOpen && (
        <div className="fixed top-0 right-0 w-[35%] h-full bg-white shadow-xl border-l border-gray-200 z-50 flex flex-col">
          <div className="p-3 bg-blue-600 text-white flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
              <h3 className="font-medium">Jira Labs</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 p-3 overflow-y-auto">
            {chatHistory.map((entry, index) => (
              <div 
                key={index} 
                className={`mb-3 ${entry.type === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg py-2 px-3 ${
                    entry.type === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{entry.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="bg-gray-100 text-gray-800 max-w-[80%] rounded-lg py-2 px-3 rounded-tl-none">
                  <div className="flex space-x-1 items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3">
            <div className="flex items-center">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 py-2 px-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={currentFunction ? `Enter ${Object.keys(currentFunction.pendingInput || {})[0] || 'details'}...` : "Type your message..."}
                disabled={isLoading}
              />
              <button 
                type="submit"
                className={`text-white py-2 px-4 rounded-r-md ${
                  isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={isLoading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
