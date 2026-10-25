import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { useConn } from '../store';
import { HazelChannel } from '../api/hazel';
import { theme } from '../theme';

export default function ChannelsScreen({ onOpenChat }: { onOpenChat: (c: HazelChannel) => void }) {
  const { channels, connected } = useConn();
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (channels.length && !selected) setSelected(channels[0].id);
  }, [channels]);

  if (!connected) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.msg}>// not connected. go to connect.</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>// channels ({channels.length})</Text>
      <FlatList
        data={channels}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => {
          const active = item.id === selected;
          return (
            <Pressable
              style={[styles.row, active && styles.rowActive]}
              onPress={() => { setSelected(item.id); onOpenChat(item); }}
            >
              <Text style={styles.hash}>#</Text>
              <Text style={[styles.name, active && styles.nameActive]}>{item.name}</Text>
              <Text style={styles.meta}>{item.type}{item.is_default ? ' · default' : ''}</Text>
            </Pressable>
          );
        }}
        ListEmptyComponent={<Text style={styles.msg}>no channels</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: theme.bg, padding: 16 },
  title: { color: theme.accent, fontFamily: theme.font, fontSize: 13, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: theme.border },
  rowActive: { backgroundColor: theme.panel, borderLeftWidth: 2, borderLeftColor: theme.accent },
  hash: { color: theme.dim, fontFamily: theme.font, fontSize: 13 },
  name: { color: theme.fg, fontFamily: theme.font, fontSize: 13, flex: 1 },
  nameActive: { color: theme.accent },
  meta: { color: theme.dim, fontFamily: theme.font, fontSize: 10 },
  msg: { color: theme.dim, fontFamily: theme.font, fontSize: 12, marginTop: 24, textAlign: 'center' },
});
