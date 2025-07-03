import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'

const newsData = [
  {
    id: '1',
    title: 'CGV khai trương rạp mới tại Hà Nội',
    image: 'https://static.cgv.vn/media/news/2023/12/12/rap-moi.jpg',
    desc: 'CGV chính thức khai trương rạp chiếu phim mới với nhiều ưu đãi hấp dẫn cho khách hàng.',
    date: '12/12/2023',
    content: `CGV vừa khai trương rạp chiếu phim mới tại trung tâm Hà Nội với hệ thống phòng chiếu hiện đại, âm thanh sống động và nhiều tiện ích cao cấp. Nhân dịp này, khách hàng sẽ được nhận nhiều ưu đãi hấp dẫn như giảm giá vé, tặng bắp rang và nước uống miễn phí trong tuần đầu khai trương. Đừng bỏ lỡ cơ hội trải nghiệm không gian giải trí đẳng cấp cùng gia đình và bạn bè tại CGV!`
  },
  {
    id: '2',
    title: 'Phim bom tấn "Avengers: Tái Xuất" ra mắt',
    image: 'https://static.cgv.vn/media/news/2023/12/10/avengers.jpg',
    desc: 'Bom tấn siêu anh hùng được mong chờ nhất năm đã chính thức ra mắt tại các rạp trên toàn quốc.',
    date: '10/12/2023',
    content: `"Avengers: Tái Xuất" đã chính thức công chiếu với sự góp mặt của dàn diễn viên đình đám và kỹ xảo mãn nhãn. Bộ phim hứa hẹn sẽ phá vỡ nhiều kỷ lục phòng vé. Đặt vé ngay hôm nay để không bỏ lỡ những suất chiếu đầu tiên và nhận nhiều phần quà hấp dẫn từ rạp!`
  },
  {
    id: '3',
    title: 'Ưu đãi vé xem phim cuối tuần',
    image: 'https://static.cgv.vn/media/news/2023/12/08/khuyen-mai.jpg',
    desc: 'Mua 2 vé tặng 1 bắp rang cho khách hàng đặt vé online vào thứ 7, Chủ nhật hàng tuần.',
    date: '08/12/2023',
    content: `Chương trình ưu đãi đặc biệt dành cho khách hàng đặt vé online vào cuối tuần: Mua 2 vé xem phim bất kỳ sẽ được tặng ngay 1 bắp rang bơ size lớn. Áp dụng cho tất cả các suất chiếu vào thứ 7 và Chủ nhật hàng tuần.`
  },
  {
    id: '4',
    title: 'Ra mắt phim hoạt hình mới "Vùng Đất Kỳ Diệu"',
    image: 'https://static.cgv.vn/media/news/2023/12/05/hoathinh.jpg',
    desc: 'Bộ phim hoạt hình "Vùng Đất Kỳ Diệu" hứa hẹn mang đến trải nghiệm tuyệt vời cho gia đình và trẻ nhỏ.',
    date: '05/12/2023',
  },
  {
    id: '5',
    title: 'Sự kiện cosplay tại CGV cuối tuần này',
    image: 'https://static.cgv.vn/media/news/2023/12/03/cosplay.jpg',
    desc: 'Tham gia sự kiện cosplay nhận ngay vé xem phim miễn phí và nhiều phần quà hấp dẫn.',
    date: '03/12/2023',
  },
];

const PromotionalScreen = () => {
  const [selectedNews, setSelectedNews] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tin tức rạp chiếu phim</Text>
      <ScrollView>
        {newsData.map(item => (
          <TouchableOpacity key={item.id} style={styles.card} onPress={() => setSelectedNews(item)}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={{flex: 1}}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc} numberOfLines={2}>{item.desc}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal chi tiết tin tức */}
      <Modal visible={!!selectedNews} transparent animationType="slide" onRequestClose={() => setSelectedNews(null)}>
        <TouchableWithoutFeedback onPress={() => setSelectedNews(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedNews && (
              <>
                <Image source={{ uri: selectedNews.image }} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedNews.title}</Text>
                <Text style={styles.modalDate}>{selectedNews.date}</Text>
                <ScrollView style={{width: '100%'}} contentContainerStyle={{paddingHorizontal: 4, paddingBottom: 16}}>
                  <Text style={styles.modalDesc}>{selectedNews.desc}</Text>
                  <Text style={styles.modalContentText}>{selectedNews.content}</Text>
                </ScrollView>
                
              </>
            )}
          </View>
        </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

export default PromotionalScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#EA5A5A',
    marginBottom: 18,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
    alignItems: 'center',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 14,
    backgroundColor: '#eee',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    color: '#444',
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    width: '90%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  modalImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 14,
    backgroundColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EA5A5A',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDate: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 15,
    color: '#333',
    marginBottom: 18,
    textAlign: 'center',
  },
  modalContentText: {
    fontSize: 15,
    color: '#222',
    textAlign: 'left',
    lineHeight: 22,
    marginTop: 8,
  },
  closeButton: {
    backgroundColor: '#EA5A5A',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginTop: 10,
  },
});