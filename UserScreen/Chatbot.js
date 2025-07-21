import React, {useState, useRef, useEffect} from 'react';
import {Alert, Image, Linking} from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {from: 'bot', text: 'Xin chào quý khách! Tôi là Movix Bot. Bạn cần hỗ trợ gì?'},
  ]);
  const flatListRef = useRef();
const suggestions = [
  'mua vé',
  'voucher',
  'đăng ký',
  'đăng nhập',
  'xem phim',
  'thanh toán',
  'thống kê',
  'hỗ trợ'
];

const handleSuggestionPress = (text) => {
  setInput(text);
  const userMessage = {from: 'user', text};
  const botMessage = {from: 'bot', text: getBotResponse(text)};
  setMessages(prev => [...prev, userMessage, botMessage]);
  Keyboard.dismiss();
};

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = {from: 'user', text: input};
    const botMessage = {from: 'bot', text: getBotResponse(input)};
    setMessages(prev => [...prev, userMessage, botMessage]);
    setInput('');
    Keyboard.dismiss();
  };

  const includesAny = (text, keywords) => {
    return keywords.some(keyword => text.includes(keyword));
  };

  const getBotResponse = question => {
    const q = question.toLowerCase();

    if (includesAny(q, ['đăng nhập', 'login'])) {
      return (
        '🔐 **Đăng nhập tài khoản Movix**\n\n' +
        'Chức năng đăng nhập cho phép bạn truy cập vào hệ thống Movix để sử dụng đầy đủ các tính năng như:\n' +
        '- Đặt vé xem phim\n' +
        '- Lưu lịch sử giao dịch\n' +
        '- Nhận thông báo về phim mới hoặc ưu đãi\n\n' +
        '👉 Cách đăng nhập:\n' +
        '1. Nhấn vào nút "Đăng nhập" ở góc trên cùng\n' +
        '2. Nhập email và mật khẩu của bạn\n' +
        '3. Nhấn "Xác nhận" để hoàn tất\n\n' +
        'Nếu bạn quên mật khẩu, hãy chọn "Quên mật khẩu?" để đặt lại.'
      );
    }

    if (includesAny(q, ['đăng ký', 'tạo tài khoản', 'sign up'])) {
      return (
        '📝 **Đăng ký tài khoản mới**\n\n' +
        'Việc đăng ký tài khoản Movix giúp bạn trải nghiệm tốt hơn, lưu thông tin người dùng và nhận ưu đãi dành riêng cho thành viên.\n\n' +
        '📌 Thao tác:\n' +
        '1. Chọn "Đăng ký" trên giao diện chính\n' +
        '2. Nhập tên, email, mật khẩu\n' +
        '3. Xác nhận lại mật khẩu\n' +
        '4. Nhấn "Tạo tài khoản"\n\n' +
        '🎁 Khi đăng ký mới, bạn sẽ nhận được 1 voucher giảm 10% cho lần đặt vé đầu tiên!'
      );
    }

    if (
      includesAny(q, [
        'xem phim',
        'xem sản phẩm',
        'phim',
        'phim gì',
        'phim nào',
      ])
    ) {
      return (
        '🎬 **Xem phim tại Movix**\n\n' +
        'Bạn có thể duyệt danh sách các bộ phim đang chiếu, sắp chiếu hoặc theo thể loại tại mục "Phim".\n\n' +
        '🔎 Có thể lọc theo:\n' +
        '- Thể loại (Hành động, Tình cảm, Hài, Kinh dị,...)\n' +
        '- Độ tuổi phù hợp\n' +
        '- Rạp chiếu\n\n' +
        '📺 Mỗi phim đều có mô tả chi tiết, trailer, thời lượng và đánh giá từ người xem. Nhấn vào phim để xem chi tiết!'
      );
    }

   if (includesAny(q, ['mua vé', 'vé', 'đặt vé', 'đặt chỗ'])) {
  return (
    <View style={{ padding: 12, alignItems: 'center' }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>🎟️ Mua vé xem phim tại Movix</Text>

      <Text style={{ marginBottom: 6 }}>Việc đặt vé online giúp bạn:</Text>
      <Text style={{ marginBottom: 2 }}>• Giữ chỗ trước, không sợ hết vé</Text>
      <Text style={{ marginBottom: 2 }}>• Tự chọn ghế theo sở thích</Text>
      <Text style={{ marginBottom: 10 }}>• Thanh toán nhanh chóng và an toàn</Text>

      <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>🛒 Các bước mua vé:</Text>
      <Text style={{ marginBottom: 2 }}>1. Chọn phim muốn xem</Text>
      <Text style={{ marginBottom: 2 }}>2. Chọn suất chiếu, ngày và giờ phù hợp</Text>
      <Text style={{ marginBottom: 2 }}>3. Chọn ghế trong sơ đồ rạp</Text>
      <Text style={{ marginBottom: 10 }}>4. Tiến hành thanh toán và nhận mã vé</Text>
      <Image
        source={require('../img/thanhtoan.png')}
        style={{ width: 500, height: 200, borderRadius: 12 }}
        resizeMode="contain"
      />
    </View>
  );
}


    if (
      includesAny(q, ['thanh toán', 'thẻ', 'chuyển khoản', 'momo', 'zalopay'])
    ) {
      return (
        '💳 **Thanh toán vé online**\n\n' +
        'Chúng tôi hỗ trợ nhiều hình thức thanh toán để bạn dễ dàng lựa chọn:\n\n' +
        '✅ Thẻ ngân hàng nội địa (ATM)\n' +
        '✅ Thẻ Visa/MasterCard\n' +
        '✅ Ví điện tử: Momo, ZaloPay, VNPay\n\n' +
        '📌 Khi thanh toán thành công, bạn sẽ nhận được mã QR để quét tại rạp hoặc mã vé gửi về email.'
      );
    }

    if (includesAny(q, ['thống kê', 'doanh thu', 'báo cáo', 'số liệu'])) {
      return (
        '📊 **Thống kê hệ thống** (dành cho quản trị viên)\n\n' +
        'Bạn có thể theo dõi:\n' +
        '- Tổng doanh thu theo ngày/tháng/năm\n' +
        '- Số lượng vé đã bán\n' +
        '- Phim có lượng vé cao nhất\n' +
        '- Tần suất sử dụng voucher\n\n' +
        '📈 Dữ liệu hiển thị dưới dạng biểu đồ trực quan, có thể lọc theo thời gian hoặc rạp chiếu.'
      );
    }

    if (includesAny(q, ['voucher', 'mã giảm giá', 'ưu đãi'])) {
      return (
        '🎁 **Sử dụng và nhận voucher**\n\n' +
        'Movix tặng bạn các mã giảm giá khi:\n' +
        '- Đăng ký tài khoản mới\n' +
        '- Mua vé nhiều lần\n' +
        '- Tham gia sự kiện hoặc chương trình ưu đãi\n\n' +
        '🎟️ Bạn có thể nhập mã voucher khi thanh toán để được giảm giá. Vào mục "Tài khoản > Voucher" để quản lý mã bạn đang có.'
      );
    }

    if (includesAny(q, ['hỗ trợ', 'giúp đỡ', 'help', 'trợ giúp'])) {
      return (
        <View style={{padding: 12}}>
          <Text style={{fontWeight: 'bold', fontSize: 16, marginBottom: 8}}>
            🤝 Tôi có thể hỗ trợ bạn về các chủ đề sau:
          </Text>

          <Text style={{marginBottom: 4}}>• Đăng nhập / Đăng ký</Text>
          <Text style={{marginBottom: 4}}>• Xem phim</Text>
          <Text style={{marginBottom: 4}}>• Mua vé</Text>
          <Text style={{marginBottom: 4}}>• Thanh toán</Text>
          <Text style={{marginBottom: 4}}>• Sử dụng voucher</Text>
          <Text style={{marginBottom: 12}}>• Xem thống kê</Text>

          <Text style={{fontStyle: 'italic', marginBottom: 16}}>
            Ví dụ: "Cách mua vé?", "Thanh toán bằng Momo được không?", hoặc
            "Đăng nhập thế nào?"
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: '#EA5A5A',
              paddingVertical: 10,
              borderRadius: 8,
              alignItems: 'center',
            }}
            onPress={() => {
              Linking.openURL('tel:0888610010').catch(() =>
                Alert.alert('Lỗi', 'Không thể mở trình gọi điện thoại'),
              );
            }}>
            <Text style={{color: '#fff', fontWeight: 'bold'}}>
              📞 Liên hệ hỗ trợ: 0888 610 010
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      '❓ Tôi chưa hiểu rõ câu hỏi của bạn.\n' +
      'Hãy thử hỏi về một trong các chủ đề như: "mua vé", "voucher", "thanh toán", "xem phim","liên hệ, "thống kê", hoặc gõ "hỗ trợ" để xem danh sách đầy đủ.'
    );
  };

  useEffect(() => {
    // Tự động scroll xuống cuối khi có tin nhắn mới
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  }, [messages]);

  const renderItem = ({item}) => (
    <View
      style={[styles.message, item.from === 'user' ? styles.user : styles.bot]}>
      {item.from === 'bot' && (
        <View style={styles.avatarBot}>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>M</Text>
        </View>
      )}
      <Text style={styles.messageText}>{item.text}</Text>
      {item.from === 'user' && (
        <View style={styles.avatarUser}>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>U</Text>
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🤖 Movix Bot</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.chatArea}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.suggestionWrapper}>
  <FlatList
    data={suggestions}
    horizontal
    showsHorizontalScrollIndicator={false}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={styles.suggestionItem}
        onPress={() => handleSuggestionPress(item)}
      >
        <Text style={styles.suggestionText}>{item}</Text>
      </TouchableOpacity>
    )}
  />
</View>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Nhập câu hỏi cho Movix Bot..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendBtnText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chatbot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  header: {
    paddingTop: 38,
    paddingBottom: 16,
    backgroundColor: '#8B0000',
    alignItems: 'center',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    marginBottom: 4,
    elevation: 2,
    shadowColor: '#EA5A5A',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
    letterSpacing: 1,
  },
  chatArea: {
    padding: 16,
    paddingBottom: 30,
  },
  message: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 6,
    maxWidth: '90%',
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4,
    padding: 12,
    marginLeft: 40,
  },
  bot: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 12,
    marginRight: 40,
    borderWidth: 1,
    borderColor: '#EA5A5A22',
  },
  messageText: {
    fontSize: 15,
    color: '#222',
    flexShrink: 1,
  },
  avatarBot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EA5A5A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarUser: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8889D6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#EA5A5A',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 15,
    backgroundColor: '#fafafa',
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: '#8B0000',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 1,
  },
  suggestionWrapper: {
  paddingHorizontal: 12,
  paddingBottom: 6,
},
suggestionItem: {
  backgroundColor: '#8B0000',
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 20,
  marginRight: 8,
},
suggestionText: {
  color: '#fff',
  fontWeight: '500',
  fontSize: 14,
},
});
