export type AIProvider = 'openai' | 'gemini' | 'deepseek' | 'openrouter';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  enabled: boolean;
}

export interface ProviderModel {
  id: string;
  name: string;
  provider: AIProvider;
  maxTokens: number;
}

export interface AIResponse {
  content: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
