/**
 * Generates a unique ID for chat messages
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * Simulates a delay to mimic API response time
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mock responses for the chatbot
 */
export const mockResponses: string[] = [
  "I'm just a simple demo chatbot. How can I help you today?",
  "That's an interesting question! I'd need more information to give you a complete answer.",
  "I understand your query. Let me provide some information that might help.",
  "Thanks for your message! Is there anything specific you'd like to know about this topic?",
  "I'm here to assist with your questions. Could you provide more details?",
  "That's a great question! Here's what I know about that topic...",
  "I'm designed to help with various queries. What else would you like to know?",
  "I appreciate your patience. Let me think about how to best answer your question.",
  "I'm continuously learning to provide better responses. Your feedback helps me improve!",
  "Let me know if you need any clarification on my response."
];

/**
 * Gets a random response from the mock responses
 */
export function getRandomResponse(): string {
  const index = Math.floor(Math.random() * mockResponses.length);
  return mockResponses[index];
}