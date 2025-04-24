import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Zap, MessageSquare, Bot, Settings, RefreshCw, Save, Code, FileText } from 'lucide-react';

export function AISettings() {
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);

  return (
    <div className="container p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">AI Settings</h1>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground">AI Configuration</span>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <CardTitle>General AI Settings</CardTitle>
              </div>
              <CardDescription>
                Configure general AI behavior and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="ai-enabled">Enable AI Features</Label>
                      <p className="text-sm text-muted-foreground">
                        Turn AI functionality on or off globally
                      </p>
                    </div>
                    <Switch id="ai-enabled" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-suggestions">Automatic Suggestions</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow AI to provide automatic suggestions
                      </p>
                    </div>
                    <Switch id="auto-suggestions" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="data-collection">Data Collection</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow anonymous data collection to improve AI
                      </p>
                    </div>
                    <Switch id="data-collection" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ai-language">Primary Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger id="ai-language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="response-type">Response Type</Label>
                    <Select defaultValue="balanced">
                      <SelectTrigger id="response-type">
                        <SelectValue placeholder="Select response type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concise">Concise</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cache-duration">Cache Duration</Label>
                    <Select defaultValue="1h">
                      <SelectTrigger id="cache-duration">
                        <SelectValue placeholder="Select cache duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15m">15 minutes</SelectItem>
                        <SelectItem value="30m">30 minutes</SelectItem>
                        <SelectItem value="1h">1 hour</SelectItem>
                        <SelectItem value="4h">4 hours</SelectItem>
                        <SelectItem value="24h">24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between">
                  <Label htmlFor="temperature">Temperature: {temperature.toFixed(1)}</Label>
                  <span className="text-sm text-muted-foreground">
                    {temperature < 0.4 ? 'More deterministic' : temperature > 0.8 ? 'More creative' : 'Balanced'}
                  </span>
                </div>
                <Slider
                  id="temperature"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Controls randomness: Lower values are more deterministic, higher values are more creative.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="max-tokens">Max Tokens: {maxTokens}</Label>
                  <span className="text-sm text-muted-foreground">
                    {maxTokens < 1000 ? 'Short responses' : maxTokens > 3000 ? 'Long responses' : 'Medium responses'}
                  </span>
                </div>
                <Slider
                  id="max-tokens"
                  min={256}
                  max={4096}
                  step={256}
                  value={[maxTokens]}
                  onValueChange={(value) => setMaxTokens(value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum length of AI responses. Higher values allow for longer responses but may increase costs.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline">Reset to Defaults</Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <CardTitle>AI Models Configuration</CardTitle>
              </div>
              <CardDescription>
                Configure AI models and their parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-model">Primary AI Model</Label>
                  <Select defaultValue="gpt-4">
                    <SelectTrigger id="primary-model">
                      <SelectValue placeholder="Select primary model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4 (Recommended)</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude-3">Claude 3</SelectItem>
                      <SelectItem value="llama-3">Llama 3</SelectItem>
                      <SelectItem value="custom">Custom Model</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    The primary AI model used for most operations.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fallback-model">Fallback AI Model</Label>
                  <Select defaultValue="gpt-3.5-turbo">
                    <SelectTrigger id="fallback-model">
                      <SelectValue placeholder="Select fallback model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Recommended)</SelectItem>
                      <SelectItem value="claude-3">Claude 3</SelectItem>
                      <SelectItem value="llama-3">Llama 3</SelectItem>
                      <SelectItem value="none">None (Disable fallback)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Used when the primary model is unavailable or rate-limited.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="embedding-model">Embedding Model</Label>
                  <Select defaultValue="text-embedding-3-large">
                    <SelectTrigger id="embedding-model">
                      <SelectValue placeholder="Select embedding model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text-embedding-3-large">text-embedding-3-large (Recommended)</SelectItem>
                      <SelectItem value="text-embedding-3-small">text-embedding-3-small</SelectItem>
                      <SelectItem value="text-embedding-ada-002">text-embedding-ada-002 (Legacy)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Used for semantic search and document retrieval.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Label htmlFor="custom-model-url">Custom Model Endpoint (Optional)</Label>
                <Input
                  id="custom-model-url"
                  placeholder="https://api.your-custom-model.com/v1"
                />
                <p className="text-xs text-muted-foreground">
                  URL for a custom model API endpoint that's compatible with OpenAI's API format.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your API key"
                  value="sk-••••••••••••••••••••••••••••••••••••••••••••••"
                />
                <p className="text-xs text-muted-foreground">
                  Your API key for accessing the selected AI models.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline">Test Connection</Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Model Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prompts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <CardTitle>System Prompts</CardTitle>
              </div>
              <CardDescription>
                Configure system prompts used for different AI functions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="compliance-prompt">Compliance Assistant Prompt</Label>
                  <Textarea
                    id="compliance-prompt"
                    rows={4}
                    defaultValue="You are a compliance assistant for UnShamed, a platform that helps users track regulatory compliance across different states. Provide helpful, accurate information about compliance requirements. If you're unsure about specific regulations, acknowledge the limitations and suggest reliable sources for verification."
                  />
                  <p className="text-xs text-muted-foreground">
                    System prompt for the compliance assistant chatbot.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document-analysis-prompt">Document Analysis Prompt</Label>
                  <Textarea
                    id="document-analysis-prompt"
                    rows={4}
                    defaultValue="Analyze the following regulatory document and extract key compliance requirements, deadlines, and obligations. Format the output as a structured list of actionable items with their respective due dates and importance levels."
                  />
                  <p className="text-xs text-muted-foreground">
                    System prompt for document analysis and information extraction.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary-prompt">Summary Generation Prompt</Label>
                  <Textarea
                    id="summary-prompt"
                    rows={4}
                    defaultValue="Create a concise summary of the following compliance information. Highlight the most important requirements, deadlines, and potential risks. The summary should be clear, accurate, and actionable for compliance professionals."
                  />
                  <p className="text-xs text-muted-foreground">
                    System prompt for generating summaries of compliance information.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline">Reset to Defaults</Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Prompts
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>AI Integrations</CardTitle>
              </div>
              <CardDescription>
                Configure integrations with external AI services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="openai-integration">OpenAI Integration</Label>
                    <p className="text-sm text-muted-foreground">
                      Connect with OpenAI services (GPT models)
                    </p>
                  </div>
                  <Switch id="openai-integration" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="anthropic-integration">Anthropic Integration</Label>
                    <p className="text-sm text-muted-foreground">
                      Connect with Anthropic services (Claude models)
                    </p>
                  </div>
                  <Switch id="anthropic-integration" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="huggingface-integration">Hugging Face Integration</Label>
                    <p className="text-sm text-muted-foreground">
                      Connect with Hugging Face model hub
                    </p>
                  </div>
                  <Switch id="huggingface-integration" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="azure-integration">Azure OpenAI Integration</Label>
                    <p className="text-sm text-muted-foreground">
                      Connect with Azure OpenAI services
                    </p>
                  </div>
                  <Switch id="azure-integration" />
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Label htmlFor="webhook-url">AI Webhook URL (Optional)</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://your-webhook-endpoint.com/ai-events"
                />
                <p className="text-xs text-muted-foreground">
                  Receive notifications about AI processing events.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-integration">Custom Integration (JSON Config)</Label>
                <Textarea
                  id="custom-integration"
                  rows={4}
                  placeholder='{"provider": "custom", "endpoint": "https://api.example.com", "auth_type": "bearer", "model_mapping": {"default": "your-model-name"}}'
                />
                <p className="text-xs text-muted-foreground">
                  JSON configuration for custom AI service integration.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Test Connections
                </Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Integrations
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AISettings;


