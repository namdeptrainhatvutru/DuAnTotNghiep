import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const SettingItem = ({ emoji, label, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <View style={styles.itemLeft}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.itemText}>{label}</Text>
    </View>
    <Text style={styles.chevron}>›</Text>
  </TouchableOpacity>
);

const SectionHeader = ({ title }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

const DifferentScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.header}>Tài khoản của bạn</Text>

        <SectionHeader title="THÔNG TIN" />
        <SettingItem
          emoji="🎫"
          label="Kho vé của bạn"
          onPress={() => navigation.navigate('KhoVe')}
        />
        <SettingItem
          emoji="🎁"
          label="Kho voucher của bạn"
          onPress={() => navigation.navigate('KhoVoucher')}
        />
        <SettingItem
          emoji="🤖"
          label="Chat bot"
          onPress={() => navigation.navigate('Chatbot')}
        />
        <SettingItem
          emoji="🔒"
          label="Đổi mật khẩu"
          onPress={() => navigation.navigate('ChangePass')}
        />

        <SectionHeader title="TÀI KHOẢN" />
        <SettingItem
          emoji="🚪"
          label="Logout"
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            })
          }
        />
      </View>
    </ScrollView>
  );
};

export default DifferentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  inner: {
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#EA5A5A',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    marginTop: 24,
    marginBottom: 10,
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 18,
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  chevron: {
    fontSize: 18,
    color: '#999',
  },
});
