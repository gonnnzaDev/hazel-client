import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useConn } from '../store';
import { theme } from '../theme';

export default function ConnectScreen() {
  const { host, port, setHost, setPort, connect, connected, disconnect, error, member, server } = useConn();
  const [nick, setNick] = useState('guest');

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.wrap}>
      <View style={styles.panel}>
        <Text style={styles.title}>// connect to a hazel node</Text>
        <Text style={styles.hint}>enter host, port and a nickname. no account needed.</Text>

        <Text style={styles.label}>host</Text>
        <TextInput
          style={styles.input}
          value={host}
          onChangeText={setHost}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="127.0.0.1"
          placeholderTextColor={theme.dim}
        />

        <Text style={styles.label}>port</Text>
        <TextInput
          style={styles.input}
          value={String(port)}
          onChangeText={(v) => setPort(Number(v) || 0)}
          keyboardType="numeric"
          placeholder="7272"
          placeholderTextColor={theme.dim}
        />

        <Text style={styles.label}>nickname</Text>
        <TextInput
          style={styles.input}
          value={nick}
          onChangeText={setNick}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="guest"
          placeholderTextColor={theme.dim}
        />

        <View style={styles.row}>
          <Pressable style={styles.btn} onPress={() => connect(nick)}>
            <Text style={styles.btnText}>[ connect ]</Text>
          </Pressable>
          {connected && (
            <Pressable style={[styles.btn, styles.btnDanger]} onPress={disconnect}>
              <Text style={styles.btnText}>[ disconnect ]</Text>
            </Pressable>
          )}
        </View>

        {error && <Text style={styles.err}>{error}</Text>}

        {connected && member && server && (
          <View style={styles.status}>
            <Text style={styles.statusText}>joined as {member.display_name} ({member.role})</Text>
            <Text style={styles.statusText}>server: {server.name} [{server.slug}]</Text>
          </View>
        )}
      </View>

      <Text style={styles.footer}>keys: tab switch panels · enter confirm</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: theme.bg, padding: 16, justifyContent: 'center' },
  panel: { borderWidth: 1, borderColor: theme.border, backgroundColor: theme.panel, padding: 16 },
  title: { color: theme.accent, fontFamily: theme.font, fontSize: 13, marginBottom: 4 },
  hint: { color: theme.dim, fontFamily: theme.font, fontSize: 11, marginBottom: 16 },
  label: { color: theme.dim, fontFamily: theme.font, fontSize: 11, marginTop: 8, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.bg,
    color: theme.fg,
    fontFamily: theme.font,
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  row: { flexDirection: 'row', gap: 8, marginTop: 16 },
  btn: { borderWidth: 1, borderColor: theme.accent, paddingHorizontal: 12, paddingVertical: 8 },
  btnDanger: { borderColor: theme.danger },
  btnText: { color: theme.accent, fontFamily: theme.font, fontSize: 12 },
  err: { color: theme.danger, fontFamily: theme.font, fontSize: 11, marginTop: 12 },
  status: { marginTop: 16, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 12 },
  statusText: { color: theme.fg, fontFamily: theme.font, fontSize: 12, marginTop: 2 },
  footer: { color: theme.dim, fontFamily: theme.font, fontSize: 10, textAlign: 'center', marginTop: 16 },
});
