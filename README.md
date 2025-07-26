# Smart Document-Aware Chat Interface

A modern, intelligent chat interface that enables users to engage with an AI assistant through natural language queries. The system supports file uploads, maintains chat session history, and offers a clean, intuitive user experience with document analysis capabilities.

![Smart Document Chat Interface](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Smart+Document+Chat+Interface)

## 🚀 Features

### Core Chat Functionality
- **Natural Language Interface**: Intuitive text input with markdown rendering support
- **Real-time Responses**: Simulated AI responses with typing indicators
- **Auto-scroll**: Automatically scrolls to the latest message
- **Message History**: Persistent chat history across sessions

### File Upload & Document Processing
- **Drag & Drop Upload**: Support for PDF, DOCX, and TXT files
- **File Management**: Display uploaded files with removal options
- **Document Context**: Files serve as context for AI responses
- **File Type Validation**: Automatic filtering of supported file types

### Session Management
- **Multiple Chat Sessions**: Create and manage multiple conversation threads
- **Session Persistence**: Chat history stored in localStorage
- **Session Switching**: Seamlessly switch between different conversations
- **Auto-generated Titles**: Smart session naming based on conversation content

### Project & Knowledge Source Selection
- **Project Context**: Select from predefined projects for targeted responses
- **Knowledge Sources**: Choose from various knowledge bases (databases, repositories, documents)
- **Contextual Responses**: AI responses adapt based on selected project and knowledge source

### Quick Workflows
- **Document Summarization**: Generate concise summaries of uploaded documents
- **Date Extraction**: Find and list important dates and deadlines
- **Text Translation**: Translate content to different languages
- **Template Responses**: Create professional response templates
- **Sentiment Analysis**: Analyze tone and emotional context
- **Action Item Extraction**: Identify tasks and to-do items

### Enhanced User Experience
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Responsive Design**: Optimized for desktop and mobile devices
- **Suggested Prompts**: Quick-start prompts for common tasks
- **Response Actions**: Copy, rate, and provide feedback on responses
- **File Attachments Display**: Visual representation of uploaded files in messages

## 🛠 Tech Stack

- **Frontend**: Next.js 15.4.2 with React 19
- **Styling**: TailwindCSS 4.0 with custom components
- **TypeScript**: Full type safety throughout the application
- **State Management**: React hooks with localStorage persistence
- **Markdown**: react-markdown for rich text rendering
- **Date Handling**: date-fns for time formatting
- **Icons**: Heroicons via inline SVG

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-document-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── Avatar.tsx              # User avatar component
│   │   ├── ChatHistory.tsx         # Chat session management
│   │   ├── ChatInput.tsx           # Message input component
│   │   ├── ChatMessage.tsx         # Message display with actions
│   │   ├── FileUpload.tsx          # File upload with drag & drop
│   │   ├── NotificationBell.tsx    # Notification indicator
│   │   ├── ThemeToggle.tsx         # Dark/light theme switcher
│   │   ├── UserMenu.tsx            # User profile menu
│   │   └── WorkflowsPanel.tsx      # Quick workflow actions
│   ├── globals.css                 # Global styles and theme
│   ├── layout.tsx                  # Root layout component
│   └── page.tsx                    # Main application page
├── types/
│   └── chat.ts                     # TypeScript type definitions
└── utils/
    └── helpers.ts                  # Utility functions and mock data
```

## 🎨 Design Decisions

### Architecture
- **Component-based Design**: Modular components for maintainability
- **Type Safety**: Comprehensive TypeScript interfaces
- **State Management**: Centralized state with localStorage persistence
- **Responsive Layout**: Three-panel layout (sidebar, main, suggestions)

### User Experience
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Accessibility**: Semantic HTML and keyboard navigation support
- **Performance**: Optimized rendering with React best practices
- **Visual Feedback**: Loading states, animations, and status indicators

### Data Persistence
- **localStorage**: Client-side storage for chat history and preferences
- **Session Management**: Automatic session creation and management
- **File Handling**: In-memory file processing with content extraction

## 🔧 Configuration

### Mock Data
The application includes mock data for:
- **Projects**: 5 predefined project contexts
- **Knowledge Sources**: 5 different knowledge base types
- **AI Responses**: 10 contextual response templates

### Customization
- **Themes**: Modify CSS variables in `globals.css`
- **Workflows**: Add new workflows in `WorkflowsPanel.tsx`
- **Mock Responses**: Update responses in `utils/helpers.ts`

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
vercel --prod
```

### Other Platforms
```bash
npm run build
npm start
```

## 🔮 Future Enhancements

- **Real AI Integration**: Connect to OpenAI, Anthropic, or other AI APIs
- **Advanced File Processing**: OCR for images, better PDF parsing
- **Collaborative Features**: Share sessions, team workspaces
- **Search Functionality**: Search across chat history and documents
- **Export Options**: Export conversations and summaries
- **Voice Input**: Speech-to-text integration
- **Real-time Collaboration**: Multiple users in same session

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the excellent framework
- **Tailwind CSS** for the utility-first CSS framework
- **Heroicons** for the beautiful icon set
- **Vercel** for hosting and deployment platform

---