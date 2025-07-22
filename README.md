# Chatbot Query Interface

A simple chat interface where users can type queries, see AI-like responses, and view previous queries in the same session.

## Tech Stack

- **Next.js** - React framework for building the UI
- **TypeScript** - For type safety
- **TailwindCSS** - For styling
- **React Markdown** - For rendering markdown in chat messages
- **date-fns** - For formatting timestamps
- **LocalStorage** - For persisting chat history

## Features

- Clean chat UI with user and assistant messages
- Auto-scroll to the latest message
- Persistence of chat history in local storage
- Markdown support for rich text in messages
- Suggested prompts shown beside the chat window (on desktop)
- Responsive design that works on mobile and desktop
- User profile with avatar and online status indicator
- Theme toggle (light/dark mode)
- Notification system
- User menu with options to clear chat history

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd chatbot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Design Decisions

- **Mock Responses**: Since this is a frontend-only demo, the AI responses are mocked with a set of predefined messages.
- **Local Storage**: Chat history is saved to the browser's local storage, allowing users to refresh the page without losing their conversation.
- **Responsive Design**: The interface adapts to different screen sizes. On mobile, the suggested prompts are hidden to maximize chat space.
- **Markdown Support**: Added markdown rendering to support rich text formatting in messages.
- **Auto-scroll**: The chat automatically scrolls to the latest message when new messages are added.
- **Loading States**: Visual feedback is provided when messages are being processed.

## Future Improvements

- Connect to a real AI backend for genuine responses
- Add user authentication to persist chats across devices
- Implement chat history management (clear, export, etc.)
- Add voice input/output capabilities
- Implement typing indicators and read receipts