// AMMA Healthcare Platform - Research Chatbot Page

import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Brain,
  Database,
  BarChart3,
  Download,
  Loader2,
  Info,
  User,
  Bot,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useResearcherStore, useAIStore } from '@/store';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { ChatMessage } from '@/types';
import { aiClient } from '@/services/aiClient';
import MarkdownRenderer from '@/components/MarkdownRenderer';

const suggestedQueries = [
  'Show me diabetes prevalence by age group in Maharashtra',
  'What are the most common chronic conditions in patients over 60?',
  'Compare hypertension rates between urban and rural areas',
  'Show vaccination coverage trends over the last 5 years',
];

export default function ResearchChatbot() {
  const { currentSession, createChatSession, addChatMessage, setCurrentSession } = useResearcherStore();
  const { isProcessing } = useAIStore();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize session
  useEffect(() => {
    if (!currentSession) {
      const sessionId = createChatSession();
      setCurrentSession(sessionId);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Add loading message
    const loadingMessage: ChatMessage = {
      id: `loading_${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages(prev => [...prev, loadingMessage]);

    // Process query using aiClient directly for real chatting
    const chatHistory = messages.filter(m => !m.isLoading).map(m => ({
      role: m.role as 'user' | 'system' | 'assistant',
      content: m.content
    }));

    // Add current user message
    chatHistory.push({ role: 'user', content: input });

    // Query AI with system prompt for structured output
    const systemPrompt = {
      role: 'system' as const,
      content: 'You are AMMA Research Assistant, a medical research AI. Always respond with well-structured markdown formatting. Use **Bold** for key terms. Use ## Headings for sections. Use markdown tables (| col | col |) for data comparisons. Use numbered lists for rankings. Use bullet points for findings. Use backtick code for medical terms. Provide detailed, data-driven responses with clear sections.'
    };
    const resultContent = await aiClient.generateChatResponse([systemPrompt, ...chatHistory]);

    // Remove loading and add response
    setMessages(prev => prev.filter(m => !m.isLoading));

    const assistantMessage: ChatMessage = {
      id: `msg_${Date.now() + 1}`,
      role: 'assistant',
      content: resultContent || 'I apologize, but I was unable to process your query. Please try again.',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);

    if (currentSession) {
      addChatMessage(currentSession, userMessage);
      addChatMessage(currentSession, assistantMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    toast.success(`Exporting as ${format.toUpperCase()}...`);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1f1f1f]">AI Research Assistant</h1>
          <p className="text-[#626a72]">Query anonymized health data using natural language</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#e6f7ff] text-[#0070a0] rounded-full text-sm">
            <Database className="w-4 h-4" />
            <span>1.2M records</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6">
        {/* Main Chat Area */}
        <Card className="flex-1 flex flex-col">
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-[#e6f7ff] rounded-xl flex items-center justify-center mb-4">
                    <Brain className="w-8 h-8 text-[#0070a0]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1f1f1f] mb-2">
                    Welcome to the AMMA Research Assistant
                  </h3>
                  <p className="text-[#626a72] max-w-md mb-6">
                    Ask questions about anonymized health data in natural language.
                    No SQL required.
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 w-full max-w-lg">
                    {suggestedQueries.map((query) => (
                      <button
                        key={query}
                        onClick={() => {
                          setInput(query);
                        }}
                        className="p-3 text-left text-sm bg-[#f7f9fa] hover:bg-[#e6f7ff] rounded-lg transition-colors text-[#626a72] hover:text-[#0070a0]"
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 bg-[#0070a0] rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[70%] rounded-2xl p-4 ${message.role === 'user'
                          ? 'bg-[#0070a0] text-white'
                          : 'bg-[#f7f9fa] text-[#1f1f1f]'
                          }`}
                      >
                        {message.isLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Analyzing data...</span>
                          </div>
                        ) : (
                          <>
                            {message.role === 'user' ? (
                              <p className="text-sm leading-relaxed">{message.content}</p>
                            ) : (
                              <MarkdownRenderer content={message.content} />
                            )}

                            {/* Results Visualization */}
                            {message.results && (
                              <div className="mt-4 space-y-3">
                                {/* Statistics */}
                                {message.results.statistics && (
                                  <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(message.results.statistics).slice(0, 4).map(([key, value]) => (
                                      <div key={key} className="bg-white rounded-lg p-2">
                                        <p className="text-xs text-[#626a72] capitalize">{key.replace(/_/g, ' ')}</p>
                                        <p className="text-lg font-semibold text-[#0070a0]">{value}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Export Buttons */}
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleExport('csv')}
                                  >
                                    <Download className="w-3 h-3 mr-1" />
                                    Export CSV
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleExport('pdf')}
                                  >
                                    <Download className="w-3 h-3 mr-1" />
                                    Export PDF
                                  </Button>
                                </div>
                              </div>
                            )}

                            <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/70' : 'text-[#99a4af]'
                              }`}>
                              {format(new Date(message.timestamp), 'h:mm a')}
                            </p>
                          </>
                        )}
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 bg-[#cce5f3] rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-[#0070a0]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-[#dee5eb]">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask a question about health data..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                  disabled={isProcessing}
                />
                <Button
                  className="bg-[#0070a0] hover:bg-[#00577c]"
                  onClick={handleSend}
                  disabled={!input.trim() || isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-[#99a4af] mt-2 flex items-center gap-1">
                <Info className="w-3 h-3" />
                All queries are logged for compliance. No PII is ever exposed.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <Card className="w-80 hidden lg:block">
          <CardContent className="p-4">
            <h3 className="font-semibold text-[#1f1f1f] mb-4">Available Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#626a72]">Age Group</label>
                <select className="w-full mt-1 h-9 px-2 rounded-md border border-input bg-background text-sm">
                  <option>All Ages</option>
                  <option>0-18</option>
                  <option>19-35</option>
                  <option>36-50</option>
                  <option>51-65</option>
                  <option>65+</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-[#626a72]">Gender</label>
                <select className="w-full mt-1 h-9 px-2 rounded-md border border-input bg-background text-sm">
                  <option>All</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-[#626a72]">Region</label>
                <select className="w-full mt-1 h-9 px-2 rounded-md border border-input bg-background text-sm">
                  <option>All Regions</option>
                  <option>North India</option>
                  <option>South India</option>
                  <option>East India</option>
                  <option>West India</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-[#626a72]">Time Period</label>
                <select className="w-full mt-1 h-9 px-2 rounded-md border border-input bg-background text-sm">
                  <option>All Time</option>
                  <option>Last 6 months</option>
                  <option>Last 1 year</option>
                  <option>Last 5 years</option>
                </select>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[#dee5eb]">
              <h3 className="font-semibold text-[#1f1f1f] mb-3">Query Tips</h3>
              <ul className="space-y-2 text-sm text-[#626a72]">
                <li className="flex items-start gap-2">
                  <BarChart3 className="w-4 h-4 mt-0.5 text-[#0070a0]" />
                  Be specific about demographics
                </li>
                <li className="flex items-start gap-2">
                  <BarChart3 className="w-4 h-4 mt-0.5 text-[#0070a0]" />
                  Mention time periods clearly
                </li>
                <li className="flex items-start gap-2">
                  <BarChart3 className="w-4 h-4 mt-0.5 text-[#0070a0]" />
                  Use medical condition names
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
