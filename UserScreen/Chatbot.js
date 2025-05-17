import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    const botMessage = { from: 'bot', text: getBotResponse(input) };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInput('');
  };

  const getBotResponse = (question) => {
    const q = question.toLowerCase();

    if (q.includes('đăng nhập')) return 'Chức năng đăng nhập giúp người dùng truy cập vào tài khoản của mình.';
    if (q.includes('đăng ký')) return 'Chức năng đăng ký cho phép người dùng tạo tài khoản mới.';
    if (q.includes('xem sản phẩm')) return 'Bạn có thể xem danh sách sản phẩm tại trang chủ.';
    if (q.includes('mua vé')) return 'Chức năng mua vé cho phép bạn chọn phim, giờ chiếu và đặt ghế.';
    if (q.includes('thanh toán')) return 'Bạn có thể thanh toán vé bằng thẻ ngân hàng hoặc ví điện tử.';
    if (q.includes('thống kê')) return 'Chức năng thống kê giúp bạn xem doanh thu, số vé đã bán,...';
    return 'Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể hỏi về: đăng nhập, đăng ký, mua vé, thống kê,...';
  };

  const renderItem = ({ item }) => (
    <View style={[styles.message, item.from === 'user' ? styles.user : styles.bot]}>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.chatArea}
      />
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Nhập câu hỏi..."
          value={input}
          onChangeText={setInput}
        />
        <Button title="Gửi" onPress={handleSend} />
      </View>
    </View>
  );
};

export default Chatbot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  chatArea: {
    paddingBottom: 20,
  },
  message: {
    padding: 10,
    marginVertical: 4,
    borderRadius: 10,
    maxWidth: '80%',
  },
  user: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  bot: {
    backgroundColor: '#f1f0f0',
    alignSelf: 'flex-start',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 5,
  },
});
