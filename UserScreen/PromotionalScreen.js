import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Modal, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'

const PromotionalScreen = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    fetch('https://67ac56315853dfff53da3fd1.mockapi.io/Tin_Tuc')
      .then(res => res.json())
      .then(data => {
        setNewsData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getCurrentDate = () => {
    const d = new Date();
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tin tức rạp chiếu phim</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#EA5A5A" style={{marginTop: 40}} />
      ) : (
        <ScrollView>
          {newsData.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => setSelectedNews(item)}
              activeOpacity={0.8}
            >
              <View style={styles.row}>
                <Image source={{ uri: item.imgTinTuc }} style={styles.image} />
                <View style={styles.content}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text numberOfLines={1} style={styles.desc}>{item.desc}</Text>
                  <Text style={styles.date}>{getCurrentDate()}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Modal chi tiết tin tức */}
      <Modal visible={!!selectedNews} transparent animationType="fade" onRequestClose={() => setSelectedNews(null)}>
        <TouchableWithoutFeedback onPress={() => setSelectedNews(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedNews && (
                <>
                  <Image source={{ uri: selectedNews.imgTinTuc }} style={styles.modalImage} />
                  <Text style={styles.modalTitle}>{selectedNews.title}</Text>
                  <Text  style={styles.modalDesc}>{selectedNews.desc}</Text>
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
    backgroundColor: '#fff',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
    overflow: 'hidden',
    padding: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  image: {
    width: 110,
    height: 80,
    borderRadius: 8,
    margin: 10,
    backgroundColor: '#eee',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 10,
    marginRight: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
  },
  desc: {
    fontSize: 13,
    color: '#888',
  },
  date: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 2,
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
  modalDesc: {
    fontSize: 15,
    color: '#333',
    marginBottom: 18,
    textAlign: 'center',
  },
});