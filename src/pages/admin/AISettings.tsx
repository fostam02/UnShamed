import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AIConfig, AIProvider, ProviderModel } from '@/types/ai';
import { SPARK_SYSTEM_PROMPT } from '@/config/ai-config';

// Define available models for each provider
const providerModels: Record<AIProvider, ProviderModel[]> = {
  openai: [
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', maxTokens: 4096 },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai', maxTokens: 4096 },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', maxTokens: 4096 }
  ],
  gemini: [
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'gemini', maxTokens: 8192 },
    { id: 'gemini-ultra', name: 'Gemini Ultra', provider: 'gemini', maxTokens: 8192 }
  ],
  deepseek: [
    { id: 'deepseek-chat', name: 'DeepSeek Chat', provider: 'deepseek', maxTokens: 4096 },
    { id: 'deepseek-coder', name: 'DeepSeek Coder', provider: 'deepseek', maxTokens: 4096 }
  ],
  openrouter: [
    { id: 'openai/gpt-4o', name: 'OpenAI GPT-4o', provider: 'openrouter', maxTokens: 4096 },
    { id: 'anthropic/claude-3-opus', name: 'Anthropic Claude 3 Opus', provider: 'openrouter', maxTokens: 4096 },
    { id: 'meta-llama/llama-3-70b-instruct', name: 'Meta Llama 3 70B', provider: 'openrouter', maxTokens: 4096 }
  ]
};

// Default configuration for each provider
const defaultConfigs: Record<AIProvider, Omit<AIConfig, 'provider'>> = {
  openai: {
    apiKey: '',
    model: 'gpt-4o',
    systemPrompt: SPARK_SYSTEM_PROMPT,
    temperature: 0.7,
    maxTokens: 1000,
    enabled: true
  },
  gemini: {
    apiKey: '',
    model: 'gemini-pro',
    systemPrompt: SPARK_SYSTEM_PROMPT,
    temperature: 0.7,
    maxTokens: 1000,
    enabled: false
  },
  deepseek: {
    apiKey: '',
    model: 'deepseek-chat',
    systemPrompt: SPARK_SYSTEM_PROMPT,
    temperature: 0.7,
    maxTokens: 1000,
    enabled: false
  },
  openrouter: {
    apiKey: '',
    model: 'openai/gpt-4o',
    systemPrompt: SPARK_SYSTEM_PROMPT,
    temperature: 0.7,
    maxTokens: 1000,
    enabled: false
  }
};

export const AISettings = () => {
  const { toast } = useToast();
  const [activeProvider, setActiveProvider] = useState<AIProvider>('openai');
  const [configs, setConfigs] = useState<Record<AIProvider, AIConfig>>({
    openai: { ...defaultConfigs.openai, provider: 'openai' },
    gemini: { ...defaultConfigs.gemini, provider: 'gemini' },
    deepseek: { ...defaultConfigs.deepseek, provider: 'deepseek' },
    openrouter: { ...defaultConfigs.openrouter, provider: 'openrouter' }
  });
  const [activeConfig, setActiveConfig] = useState<AIConfig>(configs[activeProvider]);

  // Load saved configurations from localStorage
  useEffect(() => {
    const savedConfigs = localStorage.getItem('aiConfigs');
    if (savedConfigs) {
      try {
        const parsedConfigs = JSON.parse(savedConfigs) as Record<AIProvider, AIConfig>;
        setConfigs(parsedConfigs);
        setActiveConfig(parsedConfigs[activeProvider]);
      } catch (error) {
        console.error('Error parsing saved AI configurations:', error);
      }
    }
  }, []);

  // Update active config when provider changes
  useEffect(() => {
    setActiveConfig(configs[activeProvider]);
  }, [activeProvider, configs]);

  const handleConfigChange = (field: keyof AIConfig, value: any) => {
    const updatedConfig = { ...activeConfig, [field]: value };
    setActiveConfig(updatedConfig);

    // Update the configs state with the new configuration
    setConfigs(prev => ({
      ...prev,
      [activeProvider]: updatedConfig
    }));
  };

  const handleSaveConfig = () => {
    // Save to localStorage
    localStorage.setItem('aiConfigs', JSON.stringify(configs));

    // Set the active provider as the default if it's enabled
    if (configs[activeProvider].enabled) {
      localStorage.setItem('activeAIProvider', activeProvider);
    }

    toast({
      title: 'AI Settings Saved',
      description: `Configuration for ${activeProvider} has been saved.`,
    });
  };

  const handleResetConfig = () => {
    const resetConfig = { ...defaultConfigs[activeProvider], provider: activeProvider };
    setActiveConfig(resetConfig);
    setConfigs(prev => ({
      ...prev,
      [activeProvider]: resetConfig
    }));

    toast({
      title: 'Configuration Reset',
      description: `${activeProvider} configuration has been reset to defaults.`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">AI Provider Settings</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleResetConfig}>Reset</Button>
          <Button onClick={handleSaveConfig}>Save Settings</Button>
        </div>
      </div>

      <Tabs value={activeProvider} onValueChange={(value) => setActiveProvider(value as AIProvider)}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="openai">OpenAI</TabsTrigger>
          <TabsTrigger value="gemini">Google Gemini</TabsTrigger>
          <TabsTrigger value="deepseek">DeepSeek</TabsTrigger>
          <TabsTrigger value="openrouter">OpenRouter</TabsTrigger>
        </TabsList>

        {Object.keys(configs).map((provider) => (
          <TabsContent key={provider} value={provider} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{provider === 'openai' ? 'OpenAI' :
                           provider === 'gemini' ? 'Google Gemini' :
                           provider === 'deepseek' ? 'DeepSeek' :
                           'OpenRouter'} Configuration</CardTitle>
                <CardDescription>
                  Configure settings for the {provider === 'openai' ? 'OpenAI' :
                                             provider === 'gemini' ? 'Google Gemini' :
                                             provider === 'deepseek' ? 'DeepSeek' :
                                             'OpenRouter'} AI provider.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor={`${provider}-enabled`}>Enable Provider</Label>
                    <p className="text-sm text-muted-foreground">Allow this provider to be used by the AI concierge</p>
                  </div>
                  <Switch
                    id={`${provider}-enabled`}
                    checked={activeConfig.enabled}
                    onCheckedChange={(checked) => handleConfigChange('enabled', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${provider}-api-key`}>API Key</Label>
                  <Input
                    id={`${provider}-api-key`}
                    type="password"
                    value={activeConfig.apiKey}
                    onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                    placeholder={`Enter your ${provider} API key`}
                  />
                  <p className="text-xs text-muted-foreground">
                    {provider === 'openai' ? 'Get your API key from OpenAI dashboard' :
                     provider === 'gemini' ? 'Get your API key from Google AI Studio' :
                     provider === 'deepseek' ? 'Get your API key from DeepSeek platform' :
                     'Get your API key from OpenRouter dashboard'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${provider}-model`}>Model</Label>
                  <Select
                    value={activeConfig.model}
                    onValueChange={(value) => handleConfigChange('model', value)}
                  >
                    <SelectTrigger id={`${provider}-model`}>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {providerModels[provider as AIProvider].map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor={`${provider}-temperature`}>Temperature: {activeConfig.temperature.toFixed(1)}</Label>
                  </div>
                  <Slider
                    id={`${provider}-temperature`}
                    min={0}
                    max={1}
                    step={0.1}
                    value={[activeConfig.temperature]}
                    onValueChange={(value) => handleConfigChange('temperature', value[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    Lower values produce more consistent outputs, higher values more creative ones.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${provider}-max-tokens`}>Max Tokens: {activeConfig.maxTokens}</Label>
                  <Slider
                    id={`${provider}-max-tokens`}
                    min={100}
                    max={4000}
                    step={100}
                    value={[activeConfig.maxTokens]}
                    onValueChange={(value) => handleConfigChange('maxTokens', value[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum number of tokens to generate in the response.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${provider}-system-prompt`}>System Prompt</Label>
                  <Textarea
                    id={`${provider}-system-prompt`}
                    value={activeConfig.systemPrompt}
                    onChange={(e) => handleConfigChange('systemPrompt', e.target.value)}
                    placeholder="Enter system prompt for the AI"
                    className="min-h-[200px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    The system prompt defines the AI's behavior and personality.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleResetConfig}>Reset to Defaults</Button>
                <Button onClick={handleSaveConfig}>Save Configuration</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
