"use client";

import React, { useState, useEffect } from 'react';
import { teamMembers } from '../components/TeamMembers';
import MemberSelection from '../components/MemberSelection';

interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    }
  };
  html_url: string;
  author: {
    avatar_url: string;
    login: string;
  } | null;
}

interface Repository {
  id: string;
  name: string;
  description: string;
  language: string;
  lastUpdated: string;
  branch: string;
  owner: typeof teamMembers[0];
  url: string;
}

export default function CodePage() {
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('repositories');
  const [commits, setCommits] = useState<Commit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Your GitHub repository
  const userRepo = {
    id: 'travel-ai',
    name: 'travel-ai-agent',
    description: 'A conversational travel agent powered by AI',
    language: 'TypeScript',
    lastUpdated: 'fetching...',
    branch: 'main',
    owner: teamMembers[0],
    url: 'https://github.com/Shaik-mohd-huzaifa/travel-ai-agent'
  };
  
  // Repositories list - only contains the user repository
  const repositories: Repository[] = [userRepo];

  // Sample pull requests data
  const pullRequests = [
    {
      id: '1',
      title: 'Feature: Add real-time chat capability',
      repository: 'travel-ai-agent',
      author: teamMembers[5],
      reviewers: [teamMembers[0], teamMembers[2]],
      status: 'Open',
      created: '1 day ago',
      comments: 3,
      approvals: 1
    },
    {
      id: '2',
      title: 'Fix: Resolve authentication timeout issue',
      repository: 'travel-ai-agent',
      author: teamMembers[1],
      reviewers: [teamMembers[4], teamMembers[6]],
      status: 'Open',
      created: '3 days ago',
      comments: 5,
      approvals: 2
    },
    {
      id: '3',
      title: 'Refactor: Improve model prediction accuracy',
      repository: 'travel-ai-agent',
      author: teamMembers[7],
      reviewers: [teamMembers[3], teamMembers[4]],
      status: 'Open',
      created: '12 hours ago',
      comments: 2,
      approvals: 0
    },
    {
      id: '4',
      title: 'Docs: Update README with setup instructions',
      repository: 'travel-ai-agent',
      author: teamMembers[9],
      reviewers: [teamMembers[4]],
      status: 'Merged',
      created: '2 days ago',
      comments: 1,
      approvals: 1
    }
  ];

  // Fetch commits from GitHub API
  useEffect(() => {
    const fetchCommits = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('https://api.github.com/repos/Shaik-mohd-huzaifa/travel-ai-agent/commits');
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const data = await response.json();
        setCommits(data);
        
        // Update the lastUpdated field of the userRepo if we have commit data
        if (data && data.length > 0) {
          const lastCommitDate = new Date(data[0].commit.author.date);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - lastCommitDate.getTime());
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          
          let lastUpdatedText = 'just now';
          if (diffDays > 0) {
            lastUpdatedText = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
          } else {
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            if (diffHours > 0) {
              lastUpdatedText = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
            } else {
              const diffMinutes = Math.floor(diffTime / (1000 * 60));
              lastUpdatedText = `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
            }
          }
          
          repositories[0] = {
            ...repositories[0],
            lastUpdated: lastUpdatedText
          };
        }
      } catch (err) {
        console.error('Error fetching commits:', err);
        setError('Failed to fetch commits from GitHub. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCommits();
  }, []);

  // Handle member selection for filtering
  const handleMemberSelect = (memberIds: string[]) => {
    setSelectedMemberIds(memberIds);
  };

  // Filter repositories based on selected members
  const filteredRepositories = selectedMemberIds.length > 0
    ? repositories.filter(repo => {
        const teamMember = teamMembers.find(member => member.name === repo.owner.name);
        return teamMember && selectedMemberIds.includes(teamMember.id);
      })
    : repositories;

  // Filter pull requests based on selected members
  const filteredPullRequests = selectedMemberIds.length > 0
    ? pullRequests.filter(pr => {
        // Check if author is in selected members
        const authorMember = teamMembers.find(member => member.name === pr.author.name);
        if (authorMember && selectedMemberIds.includes(authorMember.id)) {
          return true;
        }
        
        // Check if any reviewer is in selected members
        return pr.reviewers.some(reviewer => {
          const reviewerMember = teamMembers.find(member => member.name === reviewer.name);
          return reviewerMember && selectedMemberIds.includes(reviewerMember.id);
        });
      })
    : pullRequests;

  // Add new tab for commits
  const renderCommitsTab = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      );
    }

    if (!commits.length) {
      return (
        <div className="py-8 text-center">
          <p className="text-gray-500">No commits found.</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-md border border-gray-200 shadow-sm">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commit
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {commits.map(commit => {
              const date = new Date(commit.commit.author.date);
              const formattedDate = new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }).format(date);
              
              return (
                <tr key={commit.sha} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <a 
                      href={commit.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      {commit.commit.message.split('\n')[0]}
                    </a>
                    <div className="text-xs text-gray-500 mt-1">
                      {commit.sha.substring(0, 7)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {commit.author ? (
                        <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                          <img 
                            src={commit.author.avatar_url}
                            alt={commit.author.login}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                          <span className="text-gray-500 text-xs">{commit.commit.author.name.substring(0, 2).toUpperCase()}</span>
                        </div>
                      )}
                      <div className="text-sm text-gray-900">
                        {commit.commit.author.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formattedDate}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-auto px-6 py-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="hover:underline cursor-pointer">Projects</span>
            <span className="mx-2">/</span>
            <span className="hover:underline cursor-pointer">AI powered Chatbot</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 relative inline-block">
            Code
            <span className="absolute -top-3 -right-16 bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-sm border border-green-200">
              ENHANCED
            </span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10z" />
            </svg>
          </button>
          
          <div className="relative">
            <button className="flex items-center space-x-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
              <span>Filter</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 9l4 4 4-4z" />
              </svg>
            </button>
          </div>
          
          {/* Team members display */}
          <MemberSelection 
            teamMembers={teamMembers}
            selectedMemberIds={selectedMemberIds}
            setSelectedMemberIds={setSelectedMemberIds}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`mr-2 py-2 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'repositories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('repositories')}
            >
              Repositories
            </button>
            <button
              className={`mr-2 py-2 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'pullRequests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('pullRequests')}
            >
              Pull Requests
            </button>
            <button
              className={`mr-2 py-2 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'commits'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('commits')}
            >
              Commits
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'repositories' && (
        <div className="bg-white rounded-md border border-gray-200 shadow-sm">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Repository
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Language
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRepositories.map(repo => (
                <tr key={repo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9.5 3h5a1.5 1.5 0 011.5 1.5v5.5a1.5 1.5 0 01-1.5 1.5h-5A1.5 1.5 0 018 10V4.5A1.5 1.5 0 019.5 3zm0 9h5a1.5 1.5 0 011.5 1.5v5.5a1.5 1.5 0 01-1.5 1.5h-5A1.5 1.5 0 018 19v-5.5A1.5 1.5 0 019.5 12z"></path>
                      </svg>
                      <div>
                        <a 
                          href={repo.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          {repo.name}
                        </a>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 ml-7">Updated {repo.lastUpdated}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{repo.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{repo.language}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <svg className="w-4 h-4 text-gray-400 mr-1" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.5 2a3.5 3.5 0 110 7 3.5 3.5 0 010-7zm-10 6a3.5 3.5 0 110 7 3.5 3.5 0 010-7zm10 10a3.5 3.5 0 110 7 3.5 3.5 0 010-7z"></path>
                      </svg>
                      {repo.branch}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                        <img src={repo.owner.avatar} alt={repo.owner.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="text-sm text-gray-900">{repo.owner.name}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRepositories.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-gray-500">No repositories found with the selected filters.</p>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'pullRequests' && (
        <div className="bg-white rounded-md border border-gray-200 shadow-sm">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Repository
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reviewers
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPullRequests.map(pr => (
                <tr key={pr.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{pr.title}</div>
                    <div className="text-xs text-gray-500 mt-1">Created {pr.created} • {pr.comments} comments</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{pr.repository}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                        <img src={pr.author.avatar} alt={pr.author.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="text-sm text-gray-900">{pr.author.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2">
                      {pr.reviewers.map((reviewer, index) => (
                        <div key={index} className="h-8 w-8 rounded-full overflow-hidden border-2 border-white">
                          <img src={reviewer.avatar} alt={reviewer.name} className="h-full w-full object-cover" title={reviewer.name} />
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      pr.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {pr.status}
                    </span>
                    {pr.approvals > 0 && (
                      <div className="text-xs text-gray-500 mt-1">{pr.approvals} approval{pr.approvals > 1 ? 's' : ''}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPullRequests.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-gray-500">No pull requests found with the selected filters.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'commits' && renderCommitsTab()}
    </div>
  );
}
