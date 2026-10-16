'use client';

import { apiClient } from './client';

export interface AiChatMessage {
  role: 'user' | 'assistant';
  parts: string[];
}

export interface AiChatRequest {
  message: string;
  history?: AiChatMessage[];
}

export interface AiChatResponse {
  reply: string;
  toolsUsed?: string[];
}

export async function aiChatClient(body: AiChatRequest): Promise<AiChatResponse> {
  return apiClient<AiChatResponse>('/ai/chat', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
