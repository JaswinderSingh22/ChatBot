"use client";

import { Workflow } from '@/types/chat';

interface WorkflowsPanelProps {
  onWorkflowSelect: (prompt: string) => void;
  isLoading: boolean;
}

const WORKFLOWS: Workflow[] = [
  {
    id: 'summarize',
    title: 'Summarize Document',
    description: 'Get a concise summary of uploaded documents',
    icon: '📄',
    prompt: 'Please provide a comprehensive summary of the uploaded document(s), highlighting the key points, main arguments, and important conclusions.'
  },
  {
    id: 'extract-dates',
    title: 'Extract Key Dates',
    description: 'Find and list important dates from documents',
    icon: '📅',
    prompt: 'Please extract and list all important dates mentioned in the uploaded document(s), including deadlines, events, milestones, and any time-sensitive information.'
  },
  {
    id: 'translate',
    title: 'Translate Text',
    description: 'Translate content to different languages',
    icon: '🌐',
    prompt: 'Please translate the content of the uploaded document(s) or the following text to [specify target language]. Maintain the original formatting and context.'
  },
  {
    id: 'draft-response',
    title: 'Draft Template Response',
    description: 'Create template-based responses',
    icon: '✍️',
    prompt: 'Based on the uploaded document(s) or context provided, please draft a professional response template that addresses the main points and can be customized for different recipients.'
  },
  {
    id: 'analyze-sentiment',
    title: 'Analyze Sentiment',
    description: 'Analyze the tone and sentiment of text',
    icon: '😊',
    prompt: 'Please analyze the sentiment and tone of the uploaded document(s) or text, identifying positive, negative, and neutral elements, as well as the overall emotional context.'
  },
  {
    id: 'extract-action-items',
    title: 'Extract Action Items',
    description: 'Find tasks and action items in documents',
    icon: '✅',
    prompt: 'Please identify and list all action items, tasks, and to-do items mentioned in the uploaded document(s), including any assigned responsibilities and deadlines.'
  }
];

export default function WorkflowsPanel({ onWorkflowSelect, isLoading }: WorkflowsPanelProps) {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Quick Workflows</h3>
      </div>
      
      <div className="space-y-3">
        {WORKFLOWS.map((workflow, index) => (
          <button
            key={workflow.id}
            onClick={() => onWorkflowSelect(workflow.prompt)}
            disabled={isLoading}
            className="w-full card p-4 text-left hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group animate-slide-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                {workflow.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {workflow.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {workflow.description}
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
              Pro Tip
            </h5>
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              Upload documents first to get more accurate and contextual results from these workflows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}