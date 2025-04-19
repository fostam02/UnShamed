import { SPARK_API_CONFIG, SPARK_MOCK_RESPONSES, SPARK_SYSTEM_PROMPT } from "@/config/ai-config";

// Types for the Spark service
export interface SparkMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface SparkConversation {
  id: string;
  messages: SparkMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SparkResponse {
  message: SparkMessage;
  conversation: SparkConversation;
}

// In-memory storage for conversations (would be replaced with Supabase in production)
const conversations = new Map<string, SparkConversation>();

// Generate a unique ID for new conversations
const generateConversationId = (): string => {
  return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Initialize a new conversation
export const initializeConversation = (): SparkConversation => {
  const id = generateConversationId();
  const conversation: SparkConversation = {
    id,
    messages: [
      {
        role: 'system',
        content: SPARK_SYSTEM_PROMPT
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  conversations.set(id, conversation);
  return conversation;
};

// Get a conversation by ID
export const getConversation = (id: string): SparkConversation | undefined => {
  return conversations.get(id);
};

// Add a user message to a conversation
export const addUserMessage = (conversationId: string, content: string): SparkConversation | undefined => {
  const conversation = conversations.get(conversationId);
  if (!conversation) return undefined;
  
  conversation.messages.push({
    role: 'user',
    content
  });
  
  conversation.updatedAt = new Date();
  return conversation;
};

// Send a message to the AI and get a response
export const sendMessage = async (
  conversationId: string, 
  message: string
): Promise<SparkResponse> => {
  // Add the user message to the conversation
  const conversation = addUserMessage(conversationId, message);
  if (!conversation) {
    throw new Error('Conversation not found');
  }
  
  try {
    // In a production environment, this would make an API call to the AI provider
    // For now, we'll use mock responses
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate a mock response
    let responseContent = '';
    
    // Check for specific keywords to provide relevant responses
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || conversation.messages.length <= 2) {
      responseContent = SPARK_MOCK_RESPONSES.greeting;
    } else if (lowerMessage.includes('add state') || lowerMessage.includes('new state')) {
      responseContent = "To add a new state, navigate to the 'Add State' page from the sidebar menu. Fill in the required information about the state, including its name, description, and any compliance requirements. Once you've completed the form, click 'Create State' to add it to your dashboard.";
    } else if (lowerMessage.includes('compliance')) {
      responseContent = "Compliance requirements vary by state and regulatory framework. The UnShamed application helps you track these requirements, set deadlines, and maintain proper documentation. You can view specific compliance details for each state by clicking on the state in your dashboard.";
    } else if (lowerMessage.includes('profile') || lowerMessage.includes('account')) {
      responseContent = "To update your profile, click on your avatar in the top-right corner and select 'Profile' from the dropdown menu. From there, you can edit your personal information, update your credentials, and manage your account settings.";
    } else if (lowerMessage.includes('dashboard') || lowerMessage.includes('metrics')) {
      responseContent = "The dashboard displays key metrics about your compliance status. This includes the number of states you're tracking, upcoming deadlines, compliance rate, and recent activity. The visual charts help you quickly assess your overall compliance health at a glance.";
    } else {
      // Default response for other queries
      responseContent = "I understand you're asking about " + message.substring(0, 30) + "... To get more specific information about this topic, you might want to check the documentation section or contact our support team for detailed guidance.";
    }
    
    // Add the assistant response to the conversation
    const assistantMessage: SparkMessage = {
      role: 'assistant',
      content: responseContent
    };
    
    conversation.messages.push(assistantMessage);
    conversation.updatedAt = new Date();
    
    return {
      message: assistantMessage,
      conversation
    };
  } catch (error) {
    console.error('Error sending message to Spark:', error);
    
    // Add a fallback response
    const fallbackMessage: SparkMessage = {
      role: 'assistant',
      content: SPARK_MOCK_RESPONSES.fallback
    };
    
    conversation.messages.push(fallbackMessage);
    conversation.updatedAt = new Date();
    
    return {
      message: fallbackMessage,
      conversation
    };
  }
};

// Get suggested questions
export const getSuggestions = (): string[] => {
  return SPARK_MOCK_RESPONSES.suggestions;
};
