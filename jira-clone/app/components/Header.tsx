"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 z-10">
      {/* Left section: App icon, logo and navigation */}
      <div className="flex items-center">
        {/* Jira logo */}
        <Link href="/" className="flex items-center mr-5">
          <div className="w-auto h-10 overflow-hidden flex items-center justify-center">
            <Image 
              src="/jira.svg.png" 
              alt="Jira Logo" 
              width={50} 
              height={40}
              className="object-contain"
            />
          </div>
        </Link>
        
        {/* Main Navigation */}
        <nav className="flex items-center h-14">
          <div className="relative group border-b-2 border-transparent hover:border-blue-500">
            <button className="px-3 py-1 text-sm text-gray-700 flex items-center h-14">
              <span className="font-medium">Your work</span>
              <svg className="ml-1 w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 9l4 4 4-4z" />
              </svg>
            </button>
          </div>
          
          <div className="relative group border-b-2 border-blue-500">
            <button className="px-3 py-1 text-sm text-gray-700 flex items-center h-14">
              <span className="font-medium">Projects</span>
              <svg className="ml-1 w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 9l4 4 4-4z" />
              </svg>
            </button>
          </div>
          
          <div className="relative group border-b-2 border-transparent hover:border-blue-500">
            <button className="px-3 py-1 text-sm text-gray-700 flex items-center h-14">
              <span className="font-medium">Filters</span>
              <svg className="ml-1 w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 9l4 4 4-4z" />
              </svg>
            </button>
          </div>
          
          <div className="relative group border-b-2 border-transparent hover:border-blue-500">
            <button className="px-3 py-1 text-sm text-gray-700 flex items-center h-14">
              <span className="font-medium">Dashboards</span>
              <svg className="ml-1 w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 9l4 4 4-4z" />
              </svg>
            </button>
          </div>
          
          <div className="relative group border-b-2 border-transparent hover:border-blue-500">
            <button className="px-3 py-1 text-sm text-gray-700 flex items-center h-14">
              <span className="font-medium">Teams</span>
              <svg className="ml-1 w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 9l4 4 4-4z" />
              </svg>
            </button>
          </div>
          
          <div className="relative group border-b-2 border-transparent hover:border-blue-500">
            <button className="px-3 py-1 text-sm text-gray-700 flex items-center h-14">
              <span className="font-medium">Plans</span>
              <svg className="ml-1 w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 9l4 4 4-4z" />
              </svg>
            </button>
          </div>
          
          <div className="relative group border-b-2 border-transparent hover:border-blue-500">
            <button className="px-3 py-1 text-sm text-gray-700 flex items-center h-14">
              <span className="font-medium">More</span>
              <svg className="ml-1 w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 9l4 4 4-4z" />
              </svg>
            </button>
          </div>
        </nav>
      </div>
      
      {/* Right section: Actions and user */}
      <div className="ml-auto flex items-center space-x-3">
        {/* Create button */}
        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded">
          Create
        </button>
        
        {/* Premium trial button */}
        <button className="hidden md:flex items-center px-3 py-1 border border-blue-600 text-blue-600 text-sm font-medium rounded">
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm6 9.09c0 4-2.55 7.7-6 8.83-3.45-1.13-6-4.82-6-8.83V6.31l6-2.12 6 2.12v4.78zm-9.18-.5L7.4 12l3.54 3.54 5.66-5.66-1.41-1.41-4.24 4.24-2.13-2.12z" />
          </svg>
          Premium trial
        </button>
        
        {/* Search box */}
        <div className="relative">
          <div className="flex items-center h-8 w-44 bg-gray-100 rounded-sm border border-gray-300">
            <svg className="ml-2 w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search" 
              className="h-full w-full bg-transparent pl-2 text-sm focus:outline-none"
            />
          </div>
        </div>
        
        {/* Icon buttons */}
        <div className="flex items-center space-x-1">
          <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22a2 2 0 0 1-2-2h4a2 2 0 0 1-2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
            </svg>
          </button>
          
          <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
          </button>
          
          <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-6 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-12a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm12 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 12a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
            </svg>
          </button>
          
          <button className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
            U
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
