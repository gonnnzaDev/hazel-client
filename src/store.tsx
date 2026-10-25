import React, { createContext, useContext, useState } from 'react';
import { HazelApi, JoinResult, HazelServer, HazelChannel } from './api/hazel';

export type ConnState = {
  host: string;
  port: number;
  api: HazelApi | null;
  token: string | null;
  member: JoinResult['member'] | null;
  server: JoinResult['server'] | null;
  channels: HazelChannel[];
  connected: boolean;
  error: string | null;
  setHost: (h: string) => void;
  setPort: (p: number) => void;
  connect: (nickname: string) => Promise<void>;
  disconnect: () => void;
  selectServer: (s: HazelServer) => Promise<void>;
};

const Ctx = createContext<ConnState | null>(null);

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [host, setHost] = useState('127.0.0.1');
  const [port, setPort] = useState(7272);
  const [api, setApi] = useState<HazelApi | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [member, setMember] = useState<JoinResult['member'] | null>(null);
  const [server, setServer] = useState<JoinResult['server'] | null>(null);
  const [channels, setChannels] = useState<HazelChannel[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async (nickname: string) => {
    setError(null);
    try {
      const a = new HazelApi(host, port);
      await a.health();
      const servers = await a.listServers();
      const list = servers.items || [];
      if (list.length === 0) throw new Error('no servers on this node');
      const target = list[0];
      const res = await a.join(target.id, nickname);
      setApi(a);
      setToken(res.token);
      setMember(res.member);
      setServer(res.server);
      const ch = await a.listChannels(res.server.id);
      setChannels(ch.items || []);
      setConnected(true);
    } catch (e: any) {
      setConnected(false);
      setError(e?.message ?? 'connection failed');
    }
  };

  const selectServer = async (s: HazelServer) => {
    if (!api || !member) return;
    try {
      const res = await api.join(s.id, member.nickname);
      setToken(res.token);
      setServer(res.server);
      const ch = await api.listChannels(res.server.id);
      setChannels(ch.items || []);
    } catch (e: any) {
      setError(e?.message ?? 'select failed');
    }
  };

  const disconnect = () => {
    setApi(null);
    setToken(null);
    setMember(null);
    setServer(null);
    setChannels([]);
    setConnected(false);
    setError(null);
  };

  return (
    <Ctx.Provider
      value={{ host, port, api, token, member, server, channels, connected, error, setHost, setPort, connect, disconnect, selectServer }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useConn = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('ConnectionProvider missing');
  return v;
};
