import { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Brain,
  Send,
  User,
  Sparkles,
  GraduationCap,
  Briefcase,
  Target,
  RefreshCw,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIRole {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
}

const aiRoles: AIRole[] = [
  { id: 'counselor', name: 'Career Counselor', icon: GraduationCap, description: 'General career guidance and planning' },
  { id: 'mentor', name: 'Industry Mentor', icon: Briefcase, description: 'Industry-specific advice and insights' },
  { id: 'coach', name: 'Skill Coach', icon: Target, description: 'Skill development and learning paths' },
];

export default function AIMentor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Career Mentor powered by advanced AI. I can help you with career guidance, skill development, and industry insights. What would you like to discuss today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeRole, setActiveRole] = useState<string>('counselor');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    // Dynamically import streamChat to reduce initial bundle size
    const { streamChat } = await import('@/lib/ai-chat');

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    // ... rest of handleSend logic ...
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Prepare messages for API (convert to API format)
    const apiMessages = messages
      .filter(m => m.id !== '1') // Exclude initial greeting
      .concat(userMessage)
      .map(m => ({ role: m.role, content: m.content }));

    let assistantContent = '';
    const assistantId = crypto.randomUUID();

    // Add empty assistant message that we'll stream into
    setMessages(prev => [...prev, {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }]);

    await streamChat({
      messages: apiMessages,
      role: activeRole,
      onDelta: (chunk) => {
        assistantContent += chunk;
        setMessages(prev => prev.map(m =>
          m.id === assistantId
            ? { ...m, content: assistantContent }
            : m
        ));
      },
      onDone: () => {
        setIsTyping(false);
      },
      onError: (error) => {
        setIsTyping(false);
        toast.error(error);
        // Remove the empty assistant message on error
        setMessages(prev => prev.filter(m => m.id !== assistantId));
      },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRoleChange = (roleId: string) => {
    setActiveRole(roleId);
    const role = aiRoles.find(r => r.id === roleId);
    const switchMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `Switched to ${role?.name}. ${role?.description}. How can I help you?`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, switchMessage]);
  };

  const handleReset = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Career Mentor powered by advanced AI. I can help you with career guidance, skill development, and industry insights. What would you like to discuss today?",
      timestamp: new Date(),
    }]);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary rounded-xl">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Career Mentor</h1>
              <p className="text-sm text-muted-foreground">Powered by real AI • Get personalized guidance</p>
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={handleReset}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Role Selector */}
        <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
          {aiRoles.map(role => (
            <button
              key={role.id}
              onClick={() => handleRoleChange(role.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all shrink-0 ${activeRole === role.id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-foreground border-border hover:border-primary/50'
                }`}
            >
              <role.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{role.name}</span>
            </button>
          ))}
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-card rounded-xl border border-border overflow-hidden flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${message.role === 'assistant' ? 'bg-primary/10' : 'bg-secondary'
                    }`}
                >
                  {message.role === 'assistant' ? (
                    <Sparkles className="w-5 h-5 text-primary" />
                  ) : (
                    <User className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div
                  className={`max-w-[70%] ${message.role === 'assistant' ? 'chat-bubble-ai' : 'chat-bubble-user'
                    }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-50 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && messages[messages.length - 1]?.content === '' && (
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="chat-bubble-ai">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your career path..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button variant="hero" onClick={handleSend} disabled={!input.trim() || isTyping}>
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Powered by Google Gemini AI • Responses are for guidance purposes
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
