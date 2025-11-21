import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Textarea } from '@/components/marketing/financeflo/ui/textarea';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { ScrollArea } from '@/components/marketing/financeflo/ui/scroll-area';
import { 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  Play, 
  Pause, 
  Square,
  Zap,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { AIAgent } from '@/types/saas';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/marketing/financeflo/ui/use-toast';

interface AgentCommandInterfaceProps {
  agents: AIAgent[];
}

interface Command {
  id: string;
  input: string;
  output?: string;
  timestamp: Date;
  type: 'user' | 'agent' | 'system';
  status: 'pending' | 'processing' | 'completed' | 'error';
  agentId?: string;
}

const COMMAND_EXAMPLES = [
  "Start agent 'Sales Bot' and monitor its performance",
  "Pause all agents in the marketing workflow",
  "Show me the last 10 executions for Data Analyzer",
  "Create a new workflow agent for customer support",
  "Optimize the response time for Chatbot Agent",
  "Schedule a batch process for all inactive agents"
];

export const AgentCommandInterface: React.FC<AgentCommandInterfaceProps> = ({ agents }) => {
  const { toast } = useToast();
  const [command, setCommand] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [commandHistory, setCommandHistory] = useState<Command[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new commands are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [commandHistory]);

  const addCommand = (input: string, type: 'user' | 'agent' | 'system' = 'user') => {
    const newCommand: Command = {
      id: Date.now().toString(),
      input,
      timestamp: new Date(),
      type,
      status: type === 'user' ? 'pending' : 'completed'
    };
    
    setCommandHistory(prev => [...prev, newCommand]);
    return newCommand.id;
  };

  const updateCommand = (id: string, updates: Partial<Command>) => {
    setCommandHistory(prev => 
      prev.map(cmd => cmd.id === id ? { ...cmd, ...updates } : cmd)
    );
  };

  const processNaturalLanguageCommand = async (input: string) => {
    setIsProcessing(true);
    const commandId = addCommand(input);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateCommand(commandId, { status: 'processing' });
      
      // Simulate AI processing the command
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Parse command and generate appropriate response
      const response = generateCommandResponse(input);
      
      updateCommand(commandId, { 
        status: 'completed',
        output: response.message
      });
      
      // Add system response
      addCommand(response.result, 'agent');
      
      if (response.action) {
        toast({
          title: "Command Executed",
          description: response.action,
        });
      }
      
    } catch (error) {
      updateCommand(commandId, { 
        status: 'error',
        output: 'Failed to process command. Please try again.'
      });
      
      toast({
        title: "Error",
        description: "Failed to process command",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateCommandResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('start') || lowerInput.includes('activate')) {
      return {
        message: "Analyzing command to start agent...",
        result: `✅ Agent activation command processed. Identified targets: ${agents.filter(a => a.status !== 'active').length} agents`,
        action: "Agent start command executed"
      };
    }
    
    if (lowerInput.includes('pause') || lowerInput.includes('stop')) {
      return {
        message: "Processing pause command...",
        result: `⏸️ Pause command executed. ${agents.filter(a => a.status === 'active').length} active agents will be paused`,
        action: "Agents paused successfully"
      };
    }
    
    if (lowerInput.includes('status') || lowerInput.includes('show') || lowerInput.includes('report')) {
      return {
        message: "Generating status report...",
        result: `📊 Status Report:\n• Active: ${agents.filter(a => a.status === 'active').length}\n• Paused: ${agents.filter(a => a.status === 'paused').length}\n• Total Executions: ${agents.reduce((sum, a) => sum + (a.execution_count || 0), 0)}`,
        action: "Status report generated"
      };
    }
    
    if (lowerInput.includes('create') || lowerInput.includes('new')) {
      return {
        message: "Processing agent creation request...",
        result: "🤖 New agent creation request received. Please specify agent type and configuration through the Create Agent dialog.",
        action: "Ready to create new agent"
      };
    }
    
    if (lowerInput.includes('optimize') || lowerInput.includes('improve')) {
      return {
        message: "Analyzing optimization opportunities...",
        result: "⚡ Optimization analysis complete. Found 3 potential improvements: reduce response time by 15%, increase success rate by 8%, optimize resource usage.",
        action: "Optimization recommendations ready"
      };
    }
    
    return {
      message: "Processing your request...",
      result: `🔍 Command "${input}" has been processed. AI is learning to better understand this type of request.`,
      action: "Command processed"
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim() && !isProcessing) {
      processNaturalLanguageCommand(command.trim());
      setCommand('');
    }
  };

  const handleSampleCommand = (sampleCommand: string) => {
    setCommand(sampleCommand);
    textareaRef.current?.focus();
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Start voice recognition (would integrate with Web Speech API)
      toast({
        title: "Voice Input",
        description: "Voice input would be activated here",
      });
    }
  };

  const getStatusIcon = (status: Command['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing':
        return <Zap className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Command Interface */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Natural Language Commands
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Command History */}
            <ScrollArea className="h-96 mb-4 border rounded-lg p-4" ref={scrollAreaRef}>
              {commandHistory.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Start by typing a command below</p>
                  <p className="text-sm">Try: "Show me agent status" or "Start all paused agents"</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {commandHistory.map((cmd) => (
                    <div key={cmd.id} className="space-y-2">
                      {/* User Input */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {cmd.type === 'user' ? (
                            <User className="w-4 h-4" />
                          ) : cmd.type === 'agent' ? (
                            <Bot className="w-4 h-4" />
                          ) : (
                            <Settings className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {cmd.type === 'user' ? 'You' : cmd.type === 'agent' ? 'AI Agent' : 'System'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {cmd.timestamp.toLocaleTimeString()}
                            </span>
                            {cmd.type === 'user' && getStatusIcon(cmd.status)}
                          </div>
                          <div className={cn(
                            "p-3 rounded-lg text-sm",
                            cmd.type === 'user' 
                              ? "bg-primary/10 border border-primary/20" 
                              : "bg-muted"
                          )}>
                            {cmd.input}
                          </div>
                          {cmd.output && (
                            <div className="mt-2 p-3 bg-muted/50 rounded-lg text-sm">
                              {cmd.output}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Command Input */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="Type a natural language command... (e.g., 'Start all paused agents' or 'Show me performance metrics')"
                  rows={3}
                  disabled={isProcessing}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={toggleVoiceInput}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="text-xs">
                  AI-Powered Natural Language Processing
                </Badge>
                <Button 
                  type="submit" 
                  disabled={!command.trim() || isProcessing}
                  className="gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Zap className="w-4 h-4 animate-pulse" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Command
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Side Panel */}
      <div className="space-y-4">
        {/* Quick Commands */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Commands</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {COMMAND_EXAMPLES.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full text-left h-auto py-2 px-3 justify-start"
                onClick={() => handleSampleCommand(example)}
              >
                <span className="text-xs">{example}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Agent Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Agent Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {agents.slice(0, 5).map((agent) => (
              <div key={agent.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    agent.status === 'active' ? "bg-green-500" : 
                    agent.status === 'paused' ? "bg-yellow-500" : "bg-red-500"
                  )} />
                  <span className="text-sm font-medium truncate">{agent.name}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {agent.status}
                </Badge>
              </div>
            ))}
            {agents.length > 5 && (
              <p className="text-xs text-muted-foreground text-center">
                +{agents.length - 5} more agents
              </p>
            )}
          </CardContent>
        </Card>

        {/* Command Help */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Command Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p><strong>Start/Stop:</strong> "Start agent X", "Pause all agents"</p>
              <p><strong>Status:</strong> "Show agent status", "Performance report"</p>
              <p><strong>Management:</strong> "Create new agent", "Optimize agents"</p>
              <p><strong>Monitoring:</strong> "Show last executions", "Error summary"</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};