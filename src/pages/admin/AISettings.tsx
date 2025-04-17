import React from 'react';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AIProvider } from '@/types/ai';

const AI_MODELS = {
  openai: [
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }
  ],
  gemini: [
    { id: 'gemini-pro', name: 'Gemini Pro' },
    { id: 'gemini-pro-vision', name: 'Gemini Pro Vision' }
  ],
  openrouter: [
    { id: 'openai/gpt-4', name: 'GPT-4 (via OpenRouter)' },
    { id: 'anthropic/claude-2', name: 'Claude 2 (via OpenRouter)' },
    { id: 'google/gemini-pro', name: 'Gemini Pro (via OpenRouter)' },
    { id: 'meta-llama/llama-2-70b-chat', name: 'Llama 2 70B (via OpenRouter)' }
  ],
  deepseek: [
    { id: 'deepseek-coder', name: 'DeepSeek Coder' },
    { id: 'deepseek-chat', name: 'DeepSeek Chat' }
  ]
};

// Add named export
export const AISettings = () => {
  const [selectedProvider, setSelectedProvider] = React.useState<AIProvider>('openai');
  const [systemPrompt, setSystemPrompt] = React.useState(
    "You are Spark, an AI assistant focused on helping users with compliance and regulatory tasks. " +
    "You are knowledgeable, professional, and always aim to provide accurate, actionable information."
  );

  return (
    <AdminPageLayout title="AI Settings">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Model Configuration</CardTitle>
            <CardDescription>Configure the AI model settings and behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="provider-select">AI Provider</Label>
                  <Select 
                    defaultValue="openai"
                    onValueChange={(value) => setSelectedProvider(value as AIProvider)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="gemini">Google Gemini</SelectItem>
                      <SelectItem value="openrouter">OpenRouter</SelectItem>
                      <SelectItem value="deepseek">DeepSeek</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="model-select">AI Model</Label>
                  <Select defaultValue={AI_MODELS[selectedProvider][0].id}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {AI_MODELS[selectedProvider].map(model => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Temperature</Label>
                <Slider 
                  defaultValue={[0.7]} 
                  max={1} 
                  step={0.1} 
                  className="w-[200px]" 
                />
                <p className="text-sm text-muted-foreground">
                  Controls randomness in responses (0 = deterministic, 1 = creative)
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Context Memory</Label>
                  <p className="text-sm text-muted-foreground">Enable chat history retention</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spark Personality</CardTitle>
            <CardDescription>Configure how Spark interacts with users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="system-prompt">System Prompt</Label>
              <textarea
                id="system-prompt"
                className="w-full min-h-[200px] p-3 rounded-md border bg-background text-sm"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Define Spark's behavior and knowledge..."
              />
              <p className="text-sm text-muted-foreground">
                This prompt defines Spark's personality, expertise, and behavior when interacting with users.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>Manage API keys and endpoints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input 
                id="api-key" 
                type="password" 
                placeholder="Enter API key" 
                className="max-w-md"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endpoint">Custom Endpoint URL</Label>
              <Input 
                id="endpoint" 
                type="url" 
                placeholder="https://api.example.com/v1" 
                className="max-w-md"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Limits</CardTitle>
            <CardDescription>Configure AI usage restrictions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="max-tokens">Max Tokens per Request</Label>
              <Input 
                id="max-tokens" 
                type="number" 
                defaultValue={2048} 
                className="max-w-[200px]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Rate Limiting</Label>
                <p className="text-sm text-muted-foreground">Limit requests per user</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requests-per-minute">Requests per Minute</Label>
              <Input 
                id="requests-per-minute" 
                type="number" 
                defaultValue={60} 
                className="max-w-[200px]"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button variant="outline">Reset to Defaults</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </AdminPageLayout>
  );
};

// Add default export
export default AISettings;


