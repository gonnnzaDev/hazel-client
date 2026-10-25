import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '../theme';

export type Tab = 'connect' | 'channels' | 'chat';

type Props = {
  active: Tab;
  onChange: (t: Tab) => void;
  connected: boolean;
  title?: string;
};

const TABS: { key: Tab; label: string }[] = [
  { key: 'connect', label: 'connect' },
  { key: 'channels', label: 'channels' },
  { key: 'chat', label: 'chat' },
];

export default function TopBar({ active, onChange, connected, title }: Props) {
  return (
    <View style={styles.bar}>
      <View style={styles.left}>
        <Text style={styles.brand}>◈ hazel-client</Text>
      </View>

      <View style={styles.center}>
        {TABS.map((t, i) => (
          <Pressable key={t.key} onPress={() => onChange(t.key)} style={styles.tabWrap}>
            <Text style={[styles.tab, active === t.key && styles.tabActive]}>
              {active === t.key ? `[ ${t.label} ]` : `  ${t.label}  `}
            </Text>
            {i < TABS.length - 1 && <Text style={styles.sep}>│</Text>}
          </Pressable>
        ))}
      </View>

      <View style={styles.right}>
        <View style={[styles.dot, connected ? styles.dotOn : styles.dotOff]} />
        <Text style={styles.statusText}>{connected ? (title ?? 'online') : 'offline'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.panel,
  },
  left: { flex: 1 },
  brand: { color: theme.accent, fontFamily: theme.font, fontSize: 12, letterSpacing: 1 },
  center: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  tabWrap: { flexDirection: 'row', alignItems: 'center' },
  tab: { color: theme.dim, fontFamily: theme.font, fontSize: 12, paddingHorizontal: 4 },
  tabActive: { color: theme.accent },
  sep: { color: theme.border, fontFamily: theme.font, fontSize: 12, marginHorizontal: 2 },
  right: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  dot: { width: 8, height: 8 },
  dotOn: { backgroundColor: theme.accent },
  dotOff: { backgroundColor: theme.danger },
  statusText: { color: theme.dim, fontFamily: theme.font, fontSize: 11 },
});
