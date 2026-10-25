import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useConn } from '../store';
import { HazelChannel, HazelMessage } from '../api/hazel';
import { theme } from '../theme';

export default function ChatScreen({ channel }: { channel: HazelChannel | null }) {
  const { api, token, connected } = useConn();
  const [msgs, setMsgs] = useState<HazelMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = async () => {
    if (!api || !channel) return;
    try {
      const r = await api.listMessages(channel.id, 50);
      setMsgs(r.items || []);
      setErr(null);
    } catch (e: any) {
      setErr(e?.message ?? 'load failed');
    }
  };

  useEffect(() => {
    load();
    timer.current = setInterval(load, 4000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [channel?.id]);

  const send = async () => {
    if (!api || !token || !channel || !input.trim()) return;
    setSending(true);
    try {
      await api.sendMessage(channel.id, token, input.trim());
      setInput('');
      await load();
    } catch (e: any) {
      setErr(e?.message ?? 'send failed');
    } finally {
      setSending(false);
    }
  };

  if (!connected || !channel) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.msg}>// pick a channel first.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.headerText}># {channel.name}</Text>
        <Text style={styles.headerSub}>{msgs.length} msgs · polling 4s</Text>
      </View>

      <FlatList
        data={msgs}
        keyExtractor={(m) => m.id}
        inverted
        renderItem={({ item }) => (
          <View style={styles.msgRow}>
            <Text style={styles.author}>{item.author.display_name || item.author.nickname}</Text>
            <Text style={styles.content}>{item.deleted ? '[deleted]' : item.content}</Text>
            <Text style={styles.time}>{new Date(item.created_at).toLocaleTimeString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.msg}>no messages yet. say hi.</Text>}
        contentContainerStyle={{ padding: 8 }}
      />

      {err && <Text style={styles.err}>{err}</Text>}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="message…"
          placeholderTextColor={theme.dim}
          onSubmitEditing={send}
        />
        <Pressable style={styles.sendBtn} onPress={send} disabled={sending}>
          <Text style={styles.sendText}>{sending ? '…' : 'send'}</Text>
        </Pressable>
      </View>

      <Text style={styles.footer}>enter send · auto-refresh 4s</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: theme.bg },
  header: { padding: 12, borderBottomWidth: 1, borderBottomColor: theme.border, backgroundColor: theme.panel },
  headerText: { color: theme.accent, fontFamily: theme.font, fontSize: 13 },
  headerSub: { color: theme.dim, fontFamily: theme.font, fontSize: 10, marginTop: 2 },
  msgRow: { paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: theme.border },
  author: { color: theme.magenta, fontFamily: theme.font, fontSize: 11, fontWeight: '700' },
  content: { color: theme.fg, fontFamily: theme.font, fontSize: 13, marginTop: 2 },
  time: { color: theme.dim, fontFamily: theme.font, fontSize: 9, marginTop: 2 },
  err: { color: theme.danger, fontFamily: theme.font, fontSize: 11, padding: 8 },
  inputRow: { flexDirection: 'row', gap: 8, padding: 8, borderTopWidth: 1, borderTopColor: theme.border, backgroundColor: theme.panel },
  input: { flex: 1, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.bg, color: theme.fg, fontFamily: theme.font, fontSize: 13, paddingHorizontal: 10, paddingVertical: 8 },
  sendBtn: { borderWidth: 1, borderColor: theme.accent, paddingHorizontal: 12, justifyContent: 'center' },
  sendText: { color: theme.accent, fontFamily: theme.font, fontSize: 12 },
  msg: { color: theme.dim, fontFamily: theme.font, fontSize: 12, marginTop: 24, textAlign: 'center' },
  footer: { color: theme.dim, fontFamily: theme.font, fontSize: 10, textAlign: 'center', padding: 4 },
});
