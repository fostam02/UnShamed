import { useState, useEffect, useRef } from 'react';
import { Bot, X, Minimize2, Maximize2, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { SPARK_MOCK_RESPONSES } from '@/config/ai-config';

// Mock implementation to avoid errors
const initializeConversation = () => {
  return {
    id: 'mock-conversation-' + Date.now(),
    messages: [
      {
        role: 'system',
        content: 'You are Spark, an AI assistant for UnShamed.'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

const sendMessage = async (conversationId: string, message: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Generate a mock response
  let responseContent = '';
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    responseContent = SPARK_MOCK_RESPONSES.greeting;
  } else if (lowerMessage.includes('add state') || lowerMessage.includes('new state')) {
    responseContent = "To add a new state, navigate to the 'Add State' page from the sidebar menu. Fill in the required information about the state, including its name, description, and any compliance requirements. Once you've completed the form, click 'Create State' to add it to your dashboard.";
  } else if (lowerMessage.includes('compliance')) {
    responseContent = "Compliance requirements vary by state and regulatory framework. The UnShamed application helps you track these requirements, set deadlines, and maintain proper documentation. You can view specific compliance details for each state by clicking on the state in your dashboard.";
  } else {
    responseContent = "I understand you're asking about " + message.substring(0, 30) + "... To get more specific information about this topic, you might want to check the documentation section or contact our support team for detailed guidance.";
  }

  return {
    message: {
      role: 'assistant',
      content: responseContent
    },
    conversation: {
      id: conversationId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  };
};

const getSuggestions = () => {
  return SPARK_MOCK_RESPONSES.suggestions;
};

interface SparkConversation {
  id: string;
  messages: any[];
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'spark';
  timestamp: Date;
  isLoading?: boolean;
}

export function SparkChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<SparkConversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm Spark, your AI concierge. How can I help you today?",
      sender: 'spark',
      timestamp: new Date(),
    },
  ]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation when component mounts
  useEffect(() => {
    try {
      const newConversation = initializeConversation();
      setConversation(newConversation);
      setSuggestions(getSuggestions());
    } catch (error) {
      console.error('Error initializing Spark conversation:', error);
      // Add a fallback conversation if initialization fails
      setConversation({
        id: 'fallback_' + Date.now(),
        messages: [
          {
            role: 'system',
            content: 'You are Spark, an AI assistant for UnShamed.'
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      setSuggestions([
        'How do I use this app?',
        'What features are available?'
      ]);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    // Validate input and conversation
    if (!message.trim()) return;

    if (!conversation) {
      // If conversation is null, try to initialize it again
      try {
        const newConversation = initializeConversation();
        setConversation(newConversation);
      } catch (error) {
        console.error('Failed to initialize conversation:', error);
        setMessages((prev) => [...prev, {
          id: Date.now().toString(),
          content: "I'm having trouble connecting. Please refresh the page and try again.",
          sender: 'spark',
          timestamp: new Date(),
        }]);
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
    };

    // Add loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      sender: 'spark',
      timestamp: new Date(),
      isLoading: true,
    };

    // Store the message text before clearing the input
    const messageText = message;

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // Send message to Spark service
      const response = await sendMessage(conversation!.id, messageText);

      // Remove loading message and add response
      setMessages((prev) => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, {
          id: (Date.now() + 2).toString(),
          content: response.message.content,
          sender: 'spark',
          timestamp: new Date(),
        }];
      });
    } catch (error) {
      console.error('Error sending message:', error);

      // Remove loading message and add error message
      setMessages((prev) => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, {
          id: (Date.now() + 2).toString(),
          content: "I'm sorry, I couldn't process your request. Please try again.",
          sender: 'spark',
          timestamp: new Date(),
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className={cn(
          "w-[380px] shadow-lg transition-all duration-200",
          isMinimized ? "h-[60px]" : "h-[600px]"
        )}>
          <div className="p-4 border-b flex items-center justify-between bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">Spark</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-primary/50"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-primary/50"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <ScrollArea className="flex-1 p-4 h-[480px]">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.sender === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg p-3",
                          msg.sender === 'user'
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        {msg.isLoading ? (
                          <div className="flex items-center justify-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span>Thinking...</span>
                          </div>
                        ) : (
                          msg.content
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {messages.length === 1 && suggestions.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Try asking:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setMessage(suggestion);
                            // We need to use setTimeout to ensure the message state is updated
                            // before we call handleSendMessage
                            setTimeout(() => {
                              const userMessage: Message = {
                                id: Date.now().toString(),
                                content: suggestion,
                                sender: 'user',
                                timestamp: new Date(),
                              };

                              // Add loading message
                              const loadingMessage: Message = {
                                id: (Date.now() + 1).toString(),
                                content: '',
                                sender: 'spark',
                                timestamp: new Date(),
                                isLoading: true,
                              };

                              setMessages((prev) => [...prev, userMessage, loadingMessage]);
                              setMessage('');
                              setIsLoading(true);

                              // Send the suggestion to the Spark service
                              if (conversation) {
                                sendMessage(conversation.id, suggestion)
                                  .then(response => {
                                    // Remove loading message and add response
                                    setMessages((prev) => {
                                      const filtered = prev.filter(msg => !msg.isLoading);
                                      return [...filtered, {
                                        id: (Date.now() + 2).toString(),
                                        content: response.message.content,
                                        sender: 'spark',
                                        timestamp: new Date(),
                                      }];
                                    });
                                  })
                                  .catch(error => {
                                    console.error('Error sending suggestion:', error);
                                    // Remove loading message and add error message
                                    setMessages((prev) => {
                                      const filtered = prev.filter(msg => !msg.isLoading);
                                      return [...filtered, {
                                        id: (Date.now() + 2).toString(),
                                        content: "I'm sorry, I couldn't process your request. Please try again.",
                                        sender: 'spark',
                                        timestamp: new Date(),
                                      }];
                                    });
                                  })
                                  .finally(() => {
                                    setIsLoading(false);
                                  });
                              }
                            }, 0);
                          }}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </ScrollArea>

              <div className="p-4 border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={isLoading || !message.trim()}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </>
          )}
        </Card>
      ) : (
        <Button
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}