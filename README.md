# Jira Reimagined

A modern, lightweight Jira clone built with Next.js, React, and OpenAI integration. This project reimagines Jira with a clean light-themed UI and AI-powered assistance for project management tasks.

![Jira Reimagined](/jira-clone/public/jira.svg.png)

## Features

- **Kanban Board**: Visualize work with a drag-and-drop interface for moving tasks between columns
- **Backlog Management**: Create and organize tickets in the backlog and sprints
- **Jira Labs AI Assistant**: Intelligent AI assistant that understands natural language requests
- **Team Member Filtering**: Filter tasks across the application by assignee
- **Responsive Design**: Light-themed modern UI that works on various screen sizes

## Jira Labs AI Assistant

The Jira Labs assistant uses OpenAI's API to understand natural language requests and perform actions like:

- **Creating tickets**: "Create a bug ticket for navigation bar not working on mobile"
- **Assigning tickets**: "Assign JR-106 to Alex" (supports partial name matching)
- **Updating ticket status**: "Move JR-102 to Done"
- **Creating columns**: "Create a new column for Testing"
- **Getting board state**: "Show me the current board"

## Tech Stack

- **Frontend**: React, Next.js, TailwindCSS
- **State Management**: React Context API
- **AI Integration**: OpenAI API for Jira Labs assistant
- **Styling**: Modern light theme with TailwindCSS

## Setup

1. **Clone the repository**

```bash
git clone https://github.com/Shaik-mohd-huzaifa/Jira-labs.git
cd Jira-labs
```

2. **Install dependencies**

```bash
cd jira-clone
npm install
```

3. **Environment variables**

Create a `.env.local` file in the jira-clone directory with your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key_here
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

- `/app` - Next.js app directory
  - `/api` - API routes for the Jira Labs assistant
  - `/components` - Reusable React components
  - `/context` - Global state management with React Context
  - `/board` - Kanban board page
  - `/backlog` - Backlog management page
  - `/code` - Code repository view page

## Deployment

The project is deployed on Netlify and can be accessed at [jira-reimagined-hackathon.windsurf.build](https://jira-reimagined-hackathon.windsurf.build).

## Future Enhancements

- Database integration for persistent storage
- Authentication and user management
- More advanced AI features for sprint planning and analytics
- Mobile application with React Native

## License

MIT

---

Created as part of a hackathon project.
