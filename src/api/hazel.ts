import { theme } from '../theme';

export interface HazelMember {
  id: string;
  nickname: string;
  display_name: string;
  role: string;
}

export interface HazelServer {
  id: string;
  name: string;
  slug: string;
  state: string;
}

export interface HazelChannel {
  id: string;
  name: string;
  type: string;
  is_default: boolean;
}

export interface HazelMessage {
  id: string;
  channel_id: string;
  author: { nickname: string; display_name: string };
  content: string | null;
  created_at: string;
  deleted: boolean;
}

export interface JoinResult {
  token: string;
  expires_at: string;
  member: HazelMember;
  server: { id: string; slug: string; name: string };
}

export class HazelApi {
  private baseUrl: string;
  constructor(host: string, port: number) {
    this.baseUrl = `http://${host}:${port}`;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status} ${res.statusText}: ${text}`);
    }
    return (await res.json()) as T;
  }

  health() {
    return this.request<{ status: string }>('/health');
  }

  listServers() {
    return this.request<{ items: HazelServer[] }>('/api/v1/servers');
  }

  join(serverId: string, nickname: string) {
    return this.request<JoinResult>(`/api/v1/servers/${serverId}/join`, {
      method: 'POST',
      body: JSON.stringify({ nickname }),
    });
  }

  listChannels(serverId: string) {
    return this.request<{ items: HazelChannel[] }>(`/api/v1/servers/${serverId}/channels`);
  }

  listMessages(channelId: string, limit = 50) {
    return this.request<{ items: HazelMessage[]; next_cursor: string | null }>(
      `/api/v1/channels/${channelId}/messages?limit=${limit}`,
    );
  }

  sendMessage(channelId: string, token: string, content: string) {
    return this.request<HazelMessage>(`/api/v1/channels/${channelId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content, attachments: [] }),
    });
  }
}

export const wsUrl = (host: string, port: number, token: string) =>
  `ws://${host}:${port}/api/v1/ws?token=${encodeURIComponent(token)}`;
