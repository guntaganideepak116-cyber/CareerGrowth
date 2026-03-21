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
  const [activeRole, setActiveRole] = useState<string>('counselor');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchHistory = async (roleId: string) => {
    try {
      const { auth } = await import('@/lib/firebase');
      const user = auth.currentUser;
      const token = await user?.getIdToken();

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/history?roleId=${roleId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages.map((m: Message) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          })));
        } else {
          // Default initial message for new chat
          const role = aiRoles.find(r => r.id === roleId);
          setMessages([{
            id: '1',
            role: 'assistant',
            content: `Hello! I'm your ${role?.name}. ${role?.description}. How can I help you today?`,
            timestamp: new Date(),
          }]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    fetchHistory(activeRole);
  }, [activeRole]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // ------------------------------------------------------------
    // STEP 9: TIMEOUT/LOADING HANDLING
    // ------------------------------------------------------------
    const assistantId = crypto.randomUUID();
    // Use "Generating response..." as requested
    setMessages(prev => [...prev, {
      id: assistantId,
      role: 'assistant',
      content: 'Generating response...',
      timestamp: new Date(),
    }]);

    try {
      const { auth } = await import('@/lib/firebase');
      const user = auth.currentUser;
      const token = await user?.getIdToken();

      // ------------------------------------------------------------
      // STEP 6: FRONTEND CONNECTION
      // ------------------------------------------------------------
      // Determine field/specialization from profile or context if available
      // For now, we use a simple default or active role as context
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage.content,
          field: activeRole === 'counselor' ? 'Career Guidance' : activeRole === 'mentor' ? 'Industry Insights' : 'Skill Development',
          specialization: activeRole,
          roleId: activeRole
        })
      });

      const data = await response.json().catch(() => ({ error: "Server did not return JSON" }));

      if (!response.ok) {
        // STEP 7 & 10 (REFINE): Throw the real message from our server
        throw new Error(data.message || data.error || "AI service temporarily unavailable");
      }

      // ------------------------------------------------------------
      // STEP 7 & 10: RESPONSE HANDLING
      // ------------------------------------------------------------
      setMessages(prev => prev.map(m =>
        m.id === assistantId
          ? { ...m, content: data.response || data.message || "I apologize, but I couldn't generate a response." }
          : m
      ));

    } catch (err: unknown) {
      console.error("Chat error:", err);
      const errorMessage = err instanceof Error ? err.message : "AI service temporarily unavailable";
      toast.error(errorMessage);
      setMessages(prev => prev.filter(m => m.id !== assistantId));
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRoleChange = (roleId: string) => {
    if (roleId === activeRole) return;
    setActiveRole(roleId);
    setMessages([]); // Clear while loading history
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
      <div className="w-full h-[calc(100vh-6rem)] flex flex-col lg:h-[calc(100vh-5rem)]">
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
                  className={`max-w-[85%] md:max-w-[80%] ${message.role === 'assistant' ? 'chat-bubble-ai' : 'chat-bubble-user'
                    }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
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
                className="flex-1 py-6 text-base"
                disabled={isTyping}
              />
              <Button variant="hero" onClick={handleSend} disabled={!input.trim() || isTyping} className="h-auto px-6">
                <Send className="w-6 h-6" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Powered by Groq AI • High-performance Career Guidance
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
