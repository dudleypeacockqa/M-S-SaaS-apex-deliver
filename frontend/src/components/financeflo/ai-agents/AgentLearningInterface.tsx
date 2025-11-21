import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  BookOpen, 
  Zap,
  Activity,
  Award,
  LineChart,
  Settings,
  Upload,
  Download,
  RefreshCw
} from 'lucide-react';
import { AIAgent } from '@/types/saas';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface AgentLearningInterfaceProps {
  agents: AIAgent[];
}

interface LearningMetric {
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface TrainingData {
  id: string;
  name: string;
  type: 'conversation' | 'workflow' | 'performance' | 'feedback';
  size: number;
  quality: number;
  lastUpdated: Date;
}

const LEARNING_METRICS: LearningMetric[] = [
  {
    name: 'Model Accuracy',
    value: 94.2,
    trend: 'up',
    description: 'Overall prediction accuracy across all agents'
  },
  {
    name: 'Response Quality',
    value: 87.8,
    trend: 'up',
    description: 'Quality of agent responses based on user feedback'
  },
  {
    name: 'Learning Rate',
    value: 72.5,
    trend: 'stable',
    description: 'Speed of adaptation to new patterns'
  },
  {
    name: 'Knowledge Retention',
    value: 96.1,
    trend: 'up',
    description: 'Ability to retain learned information over time'
  }
];

const TRAINING_DATASETS: TrainingData[] = [
  {
    id: '1',
    name: 'Customer Support Conversations',
    type: 'conversation',
    size: 15420,
    quality: 92,
    lastUpdated: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Sales Workflow Patterns',
    type: 'workflow',
    size: 8750,
    quality: 88,
    lastUpdated: new Date('2024-01-18')
  },
  {
    id: '3',
    name: 'Performance Optimization Data',
    type: 'performance',
    size: 12300,
    quality: 95,
    lastUpdated: new Date('2024-01-19')
  },
  {
    id: '4',
    name: 'User Feedback Corpus',
    type: 'feedback',
    size: 6890,
    quality: 90,
    lastUpdated: new Date('2024-01-21')
  }
];

export const AgentLearningInterface: React.FC<AgentLearningInterfaceProps> = ({ agents }) => {
  const { toast } = useToast();
  const [selectedAgent, setSelectedAgent] = useState<string>(agents[0]?.id || '');
  const [isTraining, setIsTraining] = useState(false);
  const [autoLearning, setAutoLearning] = useState(true);
  const [feedbackText, setFeedbackText] = useState('');

  const startTraining = async (datasetId: string) => {
    setIsTraining(true);
    
    try {
      // Simulate training process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Training Started",
        description: "Agent training has been initiated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start training process",
        variant: "destructive",
      });
    } finally {
      setIsTraining(false);
    }
  };

  const submitFeedback = async () => {
    if (!feedbackText.trim()) return;
    
    try {
      // Submit feedback for learning
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Feedback Submitted",
        description: "Your feedback will help improve agent performance",
      });
      
      setFeedbackText('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'conversation':
        return <BookOpen className="w-4 h-4" />;
      case 'workflow':
        return <Activity className="w-4 h-4" />;
      case 'performance':
        return <LineChart className="w-4 h-4" />;
      case 'feedback':
        return <Award className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return <Target className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Learning Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {LEARNING_METRICS.map((metric) => (
          <Card key={metric.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                {getTrendIcon(metric.trend)}
              </div>
              <p className="text-2xl font-bold">{metric.value}%</p>
              <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
              <Progress value={metric.value} className="mt-3 h-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Learning Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Learning Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="agent-select">Select Agent</Label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Learning</Label>
                  <p className="text-sm text-muted-foreground">
                    Continuously learn from interactions
                  </p>
                </div>
                <Switch
                  checked={autoLearning}
                  onCheckedChange={setAutoLearning}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Learning Rate</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Conservative</SelectItem>
                    <SelectItem value="medium">Balanced</SelectItem>
                    <SelectItem value="high">Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Model Type</Label>
                <Select defaultValue="transformer">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transformer">Transformer</SelectItem>
                    <SelectItem value="lstm">LSTM</SelectItem>
                    <SelectItem value="gpt">GPT-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Button className="w-full gap-2" disabled={isTraining}>
                {isTraining ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Training...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Start Training
                  </>
                )}
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Upload className="w-3 h-3" />
                  Import
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="w-3 h-3" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Data & Feedback */}
      <Tabs defaultValue="datasets" className="space-y-6">
        <TabsList>
          <TabsTrigger value="datasets">Training Datasets</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Learning</TabsTrigger>
          <TabsTrigger value="models">Model Management</TabsTrigger>
          <TabsTrigger value="insights">Learning Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="datasets" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TRAINING_DATASETS.map((dataset) => (
              <Card key={dataset.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {getTypeIcon(dataset.type)}
                      </div>
                      <div>
                        <h3 className="font-medium">{dataset.name}</h3>
                        <Badge variant="outline" className="text-xs mt-1">
                          {dataset.type}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Size:</span>
                      <span>{dataset.size.toLocaleString()} samples</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Quality:</span>
                        <span>{dataset.quality}%</span>
                      </div>
                      <Progress value={dataset.quality} className="h-2" />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span>{dataset.lastUpdated.toLocaleDateString()}</span>
                    </div>

                    <Button 
                      className="w-full mt-4" 
                      size="sm"
                      onClick={() => startTraining(dataset.id)}
                      disabled={isTraining}
                    >
                      Train with Dataset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Provide Learning Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Agent Performance Feedback</Label>
                <Textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Describe how the agent performed and what could be improved..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={submitFeedback} disabled={!feedbackText.trim()}>
                  Submit Feedback
                </Button>
                <Button variant="outline" onClick={() => setFeedbackText('')}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Learning Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    type: 'improvement',
                    message: 'Agent response accuracy improved by 3.2% based on user feedback',
                    time: '2 hours ago'
                  },
                  {
                    type: 'pattern',
                    message: 'New conversation pattern detected and learned',
                    time: '4 hours ago'
                  },
                  {
                    type: 'optimization',
                    message: 'Workflow efficiency increased through reinforcement learning',
                    time: '6 hours ago'
                  }
                ].map((update, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-2",
                      update.type === 'improvement' ? 'bg-green-500' :
                      update.type === 'pattern' ? 'bg-blue-500' : 'bg-purple-500'
                    )} />
                    <div className="flex-1">
                      <p className="text-sm">{update.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{update.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models">
          <Card>
            <CardHeader>
              <CardTitle>Model Versions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { version: 'v2.1.0', accuracy: 94.2, status: 'active', date: '2024-01-21' },
                  { version: 'v2.0.3', accuracy: 91.8, status: 'archived', date: '2024-01-15' },
                  { version: 'v1.9.8', accuracy: 89.5, status: 'archived', date: '2024-01-10' }
                ].map((model) => (
                  <div key={model.version} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                        {model.status}
                      </Badge>
                      <div>
                        <p className="font-medium">{model.version}</p>
                        <p className="text-sm text-muted-foreground">{model.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{model.accuracy}%</p>
                        <p className="text-xs text-muted-foreground">Accuracy</p>
                      </div>
                      <Button variant="outline" size="sm">
                        {model.status === 'active' ? 'Current' : 'Restore'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h4 className="font-medium text-green-800 dark:text-green-400">Positive Trends</h4>
                    <ul className="text-sm mt-2 space-y-1 text-green-700 dark:text-green-300">
                      <li>• Response quality improved 15% this week</li>
                      <li>• Customer satisfaction increased 8%</li>
                      <li>• Error rate decreased by 22%</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-400">Optimization Opportunities</h4>
                    <ul className="text-sm mt-2 space-y-1 text-blue-700 dark:text-blue-300">
                      <li>• Focus on complex query handling</li>
                      <li>• Improve multi-step workflow efficiency</li>
                      <li>• Enhance context understanding</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Knowledge Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { area: 'Customer Support', confidence: 95, coverage: 87 },
                    { area: 'Sales Processes', confidence: 89, coverage: 82 },
                    { area: 'Technical Documentation', confidence: 91, coverage: 76 },
                    { area: 'Product Knowledge', confidence: 88, coverage: 90 }
                  ].map((knowledge) => (
                    <div key={knowledge.area} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{knowledge.area}</span>
                        <span className="text-muted-foreground">
                          {knowledge.confidence}% confidence
                        </span>
                      </div>
                      <Progress value={knowledge.coverage} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {knowledge.coverage}% coverage
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};