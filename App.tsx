import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ConnectionProvider, useConn } from './src/store';
import TopBar, { Tab } from './src/components/TopBar';
import ConnectScreen from './src/screens/ConnectScreen';
import ChannelsScreen from './src/screens/ChannelsScreen';
import ChatScreen from './src/screens/ChatScreen';
import { HazelChannel } from './src/api/hazel';
import { theme } from './src/theme';

function Shell() {
  const { connected, server } = useConn();
  const [tab, setTab] = useState<Tab>('connect');
  const [channel, setChannel] = useState<HazelChannel | null>(null);

  const handleOpenChat = (c: HazelChannel) => {
    setChannel(c);
    setTab('chat');
  };

  return (
    <View style={styles.root}>
      <TopBar active={tab} onChange={setTab} connected={connected} title={server?.name} />
      <View style={styles.body}>
        {tab === 'connect' && <ConnectScreen />}
        {tab === 'channels' && <ChannelsScreen onOpenChat={handleOpenChat} />}
        {tab === 'chat' && <ChatScreen channel={channel} />}
      </View>
      <Text style={styles.statusline}>
        hazel-client · hyperland mode · {connected ? 'connected' : 'disconnected'}
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <ConnectionProvider>
      <Shell />
    </ConnectionProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
  body: { flex: 1 },
  statusline: { color: theme.dim, fontFamily: theme.font, fontSize: 10, paddingHorizontal: 12, paddingVertical: 4, borderTopWidth: 1, borderTopColor: theme.border, backgroundColor: theme.panel },
});
