import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/chat/ChatInput';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { useChatStore } from '@/store/chatStore';
import { toast } from 'sonner';

export default function Chat() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCurrentChatroom, addMessage, isTyping, setIsTyping } = useChatStore();
  
  const chatroom = getCurrentChatroom();

  useEffect(() => {
    if (!chatroom) {
      toast.error('Chat not found');
      navigate('/dashboard');
    }
  }, [chatroom, navigate]);

  const simulateAIResponse = async (userMessage: string) => {
    if (!id) return;
    
    setIsTyping(true);
    
    // Simulate AI thinking time (1-3 seconds)
    const thinkingTime = 1000 + Math.random() * 2000;
    await new Promise((resolve) => setTimeout(resolve, thinkingTime));
    
    // Generate a simple response
    const responses = [
      "I understand your question. Let me help you with that.",
      "That's an interesting point. Here's what I think...",
      "I'd be happy to assist you with that!",
      "Based on what you've told me, I can suggest...",
      "Great question! Let me provide some insights.",
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    addMessage(id, {
      content: randomResponse + " " + userMessage.split(' ').slice(0, 5).join(' ') + "...",
      role: 'assistant',
    });
    
    setIsTyping(false);
  };

  const handleSendMessage = async (content: string, image?: string) => {
    if (!id) return;
    
    addMessage(id, {
      content,
      role: 'user',
      image,
    });
    
    toast.success('Message sent');
    
    // Trigger AI response
    await simulateAIResponse(content);
  };

  if (!chatroom) return null;

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-semibold">{chatroom.title}</h1>
            <p className="text-xs text-muted-foreground">
              {chatroom.messages.length} messages
            </p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <MessageList
        messages={chatroom.messages}
        isTyping={isTyping}
      />

      <ChatInput
        onSend={handleSendMessage}
        disabled={isTyping}
      />
    </div>
  );
}
