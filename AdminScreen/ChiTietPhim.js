"use client"

import { StyleSheet, Text, View, Image, ScrollView, Modal, TextInput, TouchableOpacity } from "react-native"
import { useState } from "react"
import WebView from "react-native-webview"
import { useDispatch } from "react-redux"
import { deletePhim, updatePhim } from "../redux/actions/PhimAction"
import { useNavigation } from "@react-navigation/native"
import { launchImageLibrary } from "react-native-image-picker"
import { Picker } from "@react-native-picker/picker"

const getYouTubeEmbedUrl = (url) => {
  if (!url) return ""
  const videoId = url.split("v=")[1]
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&showinfo=0`
}

const imgbbApiKey = "d698d3c569cf045e45516a8fc568c999"

const uploadToImgbb = async (base64) => {
  const formData = new FormData()
  formData.append("key", imgbbApiKey)
  formData.append("image", base64)
  const res = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: formData,
  })
  const data = await res.json()
  return data.data?.url
}

const THE_LOAI_OPTIONS = [
  "Hành động",
  "Phiêu lưu",
  "Hài",
  "Tình cảm / Lãng mạn",
  "Tâm lý",
  "Kinh dị",
  "Giật gân",
  "Bí ẩn",
  "Khoa học viễn tưởng",
  "Viễn tưởng - Giả tưởng",
  "Hình sự",
  "Chiến tranh",
  "Chính kịch",
  "Tài liệu",
  "Phim tiểu sử",
  "Âm nhạc",
  "Gia đình",
  "Thể thao",
  "Phim thiếu nhi",
]

const ChiTietPhim = ({ route }) => {
  const { phim } = route.params
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const [modal, setModal] = useState(false)
  const [editPhim, setEditPhim] = useState(phim)
  const [currentPhim, setCurrentPhim] = useState(phim)

  const handleDelete = (phim_id) => {
    dispatch(deletePhim(phim_id)).then(() => {
      navigation.goBack()
    })
  }

  const handleUpdate = () => {
    dispatch(updatePhim(editPhim)).then(() => {
      setCurrentPhim(editPhim)
      setModal(false)
    })
  }

  const handlePickImage = async () => {
    launchImageLibrary({ mediaType: "photo", includeBase64: true }, async (response) => {
      if (response.didCancel || response.errorCode) return
      const base64 = response.assets[0].base64
      const url = await uploadToImgbb(base64)
      if (url) {
        setEditPhim({ ...editPhim, poster_url: url })
      }
    })
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết phim</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Movie Poster */}
        <View style={styles.posterContainer}>
          <Image style={styles.poster} source={{ uri: currentPhim.poster_url }} />
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{currentPhim.do_tuoi}+</Text>
          </View>
        </View>

        {/* Movie Title */}
        <Text style={styles.movieTitle}>{currentPhim.ten_phim}</Text>

        {/* Trailer */}
        <View style={styles.trailerContainer}>
          <Text style={styles.sectionTitle}>🎬 Trailer</Text>
          <View style={styles.trailerWrapper}>
            <WebView
              source={{ uri: getYouTubeEmbedUrl(currentPhim.trailer_url) }}
              allowsFullscreenVideo
              javaScriptEnabled
              domStorageEnabled
              startInLoadingState
              mediaPlaybackRequiresUserAction={false}
              style={styles.webview}
            />
          </View>
        </View>

        {/* Movie Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>📋 Thông tin phim</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🎭</Text>
            <Text style={styles.infoLabel}>Đạo diễn:</Text>
            <Text style={styles.infoValue}>{currentPhim.dao_dien}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🎪</Text>
            <Text style={styles.infoLabel}>Thể loại:</Text>
            <Text style={styles.infoValue}>{currentPhim.the_loai}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🌍</Text>
            <Text style={styles.infoLabel}>Ngôn ngữ:</Text>
            <Text style={styles.infoValue}>{currentPhim.ngon_ngu}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>⏱️</Text>
            <Text style={styles.infoLabel}>Thời lượng:</Text>
            <Text style={styles.infoValue}>{currentPhim.thoi_luong} phút</Text>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>📝 Mô tả</Text>
            <Text style={styles.descriptionText}>{currentPhim.mo_ta}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={() => setModal(true)}>
            <Text style={styles.editButtonText}>✏️ Cập nhật</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(currentPhim.phim_id)}>
            <Text style={styles.deleteButtonText}>🗑️ Xóa phim</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={modal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>✏️ Cập nhật phim</Text>
              <TouchableOpacity onPress={() => setModal(false)} style={styles.closeButton}>
                <Text style={styles.closeIcon}>❌</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>🎬 Tên phim</Text>
                <TextInput
                  placeholder="Nhập tên phim"
                  value={editPhim.ten_phim}
                  onChangeText={(text) => setEditPhim({ ...editPhim, ten_phim: text })}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>🎭 Đạo diễn</Text>
                <TextInput
                  placeholder="Nhập tên đạo diễn"
                  value={editPhim.dao_dien}
                  onChangeText={(text) => setEditPhim({ ...editPhim, dao_dien: text })}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>🎪 Thể loại</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={editPhim.the_loai}
                    onValueChange={(value) => setEditPhim({ ...editPhim, the_loai: value })}
                    style={styles.picker}
                  >
                    <Picker.Item label="Chọn thể loại..." value="" />
                    {THE_LOAI_OPTIONS.map((option) => (
                      <Picker.Item key={option} label={option} value={option} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>🌍 Ngôn ngữ</Text>
                <TextInput
                  placeholder="Nhập ngôn ngữ"
                  value={editPhim.ngon_ngu}
                  onChangeText={(text) => setEditPhim({ ...editPhim, ngon_ngu: text })}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>👶 Độ tuổi</Text>
                <TextInput
                  placeholder="Nhập độ tuổi"
                  value={editPhim.do_tuoi?.toString()}
                  onChangeText={(text) => setEditPhim({ ...editPhim, do_tuoi: text })}
                  style={styles.input}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>⏱️ Thời lượng (phút)</Text>
                <TextInput
                  placeholder="Nhập thời lượng"
                  value={editPhim.thoi_luong?.toString()}
                  onChangeText={(text) => setEditPhim({ ...editPhim, thoi_luong: text })}
                  style={styles.input}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>🖼️ Poster</Text>
                <View style={styles.imageInputContainer}>
                  <TextInput
                    placeholder="URL poster"
                    value={editPhim.poster_url}
                    onChangeText={(text) => setEditPhim({ ...editPhim, poster_url: text })}
                    style={[styles.input, styles.imageInput]}
                  />
                  <TouchableOpacity style={styles.imagePickButton} onPress={handlePickImage}>
                    <Text style={styles.imagePickText}>📷</Text>
                  </TouchableOpacity>
                </View>
                {editPhim.poster_url ? (
                  <Image source={{ uri: editPhim.poster_url }} style={styles.previewImage} />
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>🎥 Trailer URL</Text>
                <TextInput
                  placeholder="Nhập URL trailer YouTube"
                  value={editPhim.trailer_url}
                  onChangeText={(text) => setEditPhim({ ...editPhim, trailer_url: text })}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>📝 Mô tả</Text>
                <TextInput
                  placeholder="Nhập mô tả phim"
                  value={editPhim.mo_ta}
                  onChangeText={(text) => setEditPhim({ ...editPhim, mo_ta: text })}
                  style={[styles.input, styles.textArea]}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.primaryButton} onPress={handleUpdate}>
                  <Text style={styles.primaryButtonText}>💾 Cập nhật</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => setModal(false)}>
                  <Text style={styles.secondaryButtonText}>↩️ Hủy</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default ChiTietPhim

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 20,
    color: "#333",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  posterContainer: {
    alignItems: "center",
    marginVertical: 20,
    position: "relative",
  },
  poster: {
    width: 200,
    height: 300,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  ratingBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#EA5A5A",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#EA5A5A",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  trailerContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  trailerWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  webview: {
    width: "100%",
    height: 200,
  },
  infoContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 24,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginRight: 8,
    minWidth: 80,
  },
  infoValue: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  descriptionContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    marginHorizontal: 20,
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#EA5A5A",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#EA5A5A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#6C757D",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    minHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#EA5A5A",
  },
  closeButton: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 18,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
  },
  picker: {
    height: 50,
  },
  imageInputContainer: {
    flexDirection: "row",
    gap: 8,
  },
  imageInput: {
    flex: 1,
  },
  imagePickButton: {
    width: 50,
    height: 50,
    backgroundColor: "#EA5A5A",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePickText: {
    fontSize: 20,
  },
  previewImage: {
    width: 120,
    height: 180,
    borderRadius: 12,
    alignSelf: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  modalActions: {
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: "#EA5A5A",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#EA5A5A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "#6C757D",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
})
