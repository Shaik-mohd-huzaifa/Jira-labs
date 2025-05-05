"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white h-screen flex flex-col border-r border-gray-200 flex-shrink-0">
      {/* Removed logo div to avoid duplicate logo */}

      <div className="p-3 border-b border-gray-200 mt-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-blue-500 rounded-sm flex items-center justify-center">
            <span className="text-white font-medium text-xs">A</span>
          </div>
          <div>
            <Link href="/projects" className="block text-[13px] font-medium text-[#172b4d] hover:underline">
              AI powered Chatbot
            </Link>
            <p className="text-[11px] text-gray-500">Software project</p>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        <div className="py-3">
          <h4 className="px-3 py-1 text-[11px] font-bold text-gray-500 tracking-wide">PLANNING</h4>
          <ul>
            <li>
              <Link 
                href="/summary" 
                className={`flex items-center px-3 py-1 text-[13px] ${
                  pathname === '/summary' 
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                } rounded-sm`}
              >
                <svg className={`w-5 h-5 mr-2 ${pathname === '/summary' ? 'text-blue-700' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5h8a1 1 0 0 1 0 2H8a1 1 0 1 1 0-2zm0 6h8a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2zm0 6h4a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2z"></path>
                </svg>
                Summary
              </Link>
            </li>
            <li>
              <Link 
                href="/timeline" 
                className={`flex items-center px-3 py-1 text-[13px] ${
                  pathname === '/timeline' 
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                } rounded-sm`}
              >
                <svg className={`w-5 h-5 mr-2 ${pathname === '/timeline' ? 'text-blue-700' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8V4M12 20v-4M6 12H2M22 12h-4M19.778 19.778L17 17M19.778 4.222L17 7M4.222 19.778L7 17M4.222 4.222L7 7" />
                </svg>
                Timeline
              </Link>
            </li>
            <li>
              <Link 
                href="/backlog" 
                className={`flex items-center px-3 py-1 text-[13px] ${
                  pathname === '/backlog' 
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                } rounded-sm relative`}
              >
                <svg className={`w-5 h-5 mr-2 ${pathname === '/backlog' ? 'text-blue-700' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 5h18a1 1 0 0 1 0 2H3a1 1 0 1 1 0-2zm0 6h18a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2zm0 6h12a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2z"></path>
                </svg>
                Backlog
                <span className="absolute -top-1 -right-1 bg-gray-700 text-white text-[9px] rounded-full px-1.5 py-0.5">
                  Works
                </span>
              </Link>
            </li>
            <li>
              <Link 
                href="/board" 
                className={`flex items-center px-3 py-1 text-[13px] ${
                  pathname === '/board' 
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                } rounded-sm relative`}
              >
                <svg className={`w-5 h-5 mr-2 ${pathname === '/board' ? 'text-blue-700' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h16V5H4zm2 2h4v4H6V7zm0 6h4v4H6v-4zm6-6h8v10h-8V7z"></path>
                </svg>
                Board
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] rounded-full px-1.5 py-0.5">
                  Works
                </span>
              </Link>
            </li>
            <li>
              <Link 
                href="/calendar" 
                className={`flex items-center px-3 py-1 text-[13px] ${
                  pathname === '/calendar' 
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                } rounded-sm`}
              >
                <svg className={`w-5 h-5 mr-2 ${pathname === '/calendar' ? 'text-blue-700' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 7V5c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v2h4c.6 0 1 .4 1 1v12c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1V8c0-.6.4-1 1-1h4zm2 0h4V6h-4v1zM5 9v10h14V9H5z"></path>
                </svg>
                Calendar
              </Link>
            </li>
            <li>
              <Link 
                href="/list" 
                className={`flex items-center px-3 py-1 text-[13px] ${
                  pathname === '/list' 
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                } rounded-sm`}
              >
                <svg className={`w-5 h-5 mr-2 ${pathname === '/list' ? 'text-blue-700' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 5h18a1 1 0 0 1 0 2H3a1 1 0 1 1 0-2zm0 6h18a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2zm0 6h18a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2z"></path>
                </svg>
                List
              </Link>
            </li>
            <li>
              <button className="flex items-center text-[13px] text-gray-600 hover:text-gray-700 px-3 py-1 w-full">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1-2 0v-6H5a1 1 0 0 1 0-2h6V5a1 1 0 0 1 1-1z" />
                </svg>
                <span>Create</span>
              </button>
            </li>
          </ul>
        </div>
        
        <div className="py-3">
          <h4 className="px-3 py-1 text-[11px] font-bold text-gray-500 tracking-wide">DEVELOPMENT</h4>
          <ul>
            <li>
              <Link 
                href="/code" 
                className={`flex items-center px-3 py-1 text-[13px] ${
                  pathname === '/code' 
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                } rounded-sm`}
              >
                <svg className={`w-5 h-5 mr-2 ${pathname === '/code' ? 'text-blue-700' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"></path>
                </svg>
                Code
              </Link>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="p-3 border-t border-gray-200">
        <Link href="/project-pages" className="flex items-center text-[13px] text-gray-700 hover:underline">
          <svg className="w-4 h-4 mr-1 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1-2 0v-6H5a1 1 0 0 1 0-2h6V5a1 1 0 0 1 1-1z" />
          </svg>
          <span>Project pages</span>
        </Link>
        <Link href="/add-shortcut" className="flex items-center mt-3 text-[13px] text-gray-700 hover:underline">
          <svg className="w-4 h-4 mr-1 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1-2 0v-6H5a1 1 0 0 1 0-2h6V5a1 1 0 0 1 1-1z" />
          </svg>
          <span>Add shortcut</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
