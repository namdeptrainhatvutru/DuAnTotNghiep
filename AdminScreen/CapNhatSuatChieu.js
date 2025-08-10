"use client"

import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from "react-native"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateSuatChieu } from "../redux/actions/SuatChieuAction"

const { width } = Dimensions.get("window")

const CapNhatSuatChieu = ({ route, navigation }) => {
  const { phim, suat_chieu } = route.params
  const dispatch = useDispatch()
  const listphim = useSelector((state) => state.phim.listphim)

  // State cho các trường chỉnh sửa
  const [ngay_chieu, setngay_chieu] = useState(suat_chieu.ngay_chieu.toString())
  const [thoi_gian_bat_dau, setthoi_gian_bat_dau] = useState(suat_chieu.thoi_gian_bat_dau.toString())
  const [thoi_gian_ket_thuc, setthoi_gian_ket_thuc] = useState(suat_chieu.thoi_gian_ket_thuc.toString())
  const [phim_id, setphim_id] = useState(suat_chieu.phim_id)
  const [phimModal, setPhimModal] = useState(false)
  const [searchPhim, setSearchPhim] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDateChange = (text) => {
    const cleaned = text.replace(/[^\d]/g, "")
    let formatted = ""
    if (cleaned.length <= 2) {
      formatted = cleaned
    } else if (cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`
    } else {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`
    }

    const parts = formatted.split("/")
    const day = Number.parseInt(parts[0], 10)
    const month = Number.parseInt(parts[1], 10)
    if (day > 31) parts[0] = "31"
    if (month > 12) parts[1] = "12"

    if (parts.length === 3) {
      formatted = `${parts[0]}/${parts[1]}/${parts[2]}`
    } else if (parts.length === 2) {
      formatted = `${parts[0]}/${parts[1]}`
    } else {
      formatted = parts[0]
    }
    setngay_chieu(formatted)
  }

  const handleUpdate = async () => {
    if (!ngay_chieu || !thoi_gian_bat_dau || !thoi_gian_ket_thuc || !phim_id) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin")
      return
    }

    setIsSubmitting(true)
    const updated = {
      ...suat_chieu,
      ngay_chieu,
      thoi_gian_bat_dau,
      thoi_gian_ket_thuc,
      phim_id,
    }

    try {
      await dispatch(updateSuatChieu(updated))
      Alert.alert("Thành công", "Đã cập nhật suất chiếu!", [{ text: "OK", onPress: () => navigation.goBack() }])
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật suất chiếu. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedMovie = listphim.find((p) => p.phim_id === phim_id)

  const InputField = ({ label, value, onChangeText, placeholder, icon, ...props }) => (
    <View style={styles.inputContainer}>
      <View style={styles.inputLabelContainer}>
        <Text style={styles.inputIcon}>{icon}</Text>
        <Text style={styles.inputLabel}>{label}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#999"
        {...props}
      />
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerIcon}>✏️</Text>
          <Text style={styles.headerTitle}>Cập Nhật Suất Chiếu</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            {/* Current Movie Display */}
            <View style={styles.currentMovieContainer}>
              <Text style={styles.sectionTitle}>🎬 Phim hiện tại</Text>
              <View style={styles.currentMovieCard}>
                <Image source={{ uri: phim?.poster_url }} style={styles.currentMoviePoster} />
                <View style={styles.currentMovieInfo}>
                  <Text style={styles.currentMovieTitle} numberOfLines={2}>
                    {phim?.ten_phim || "Không tìm thấy phim"}
                  </Text>
                  <Text style={styles.currentMovieDetails}>Thời lượng: {phim?.thoi_luong || "N/A"} phút</Text>
                </View>
              </View>
            </View>

            {/* Form Fields */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>📝 Thông tin suất chiếu</Text>

              <InputField
                label="Ngày chiếu"
                icon="📅"
                value={ngay_chieu}
                onChangeText={handleDateChange}
                placeholder="DD/MM/YYYY"
                keyboardType="numeric"
                maxLength={10}
              />

              <InputField
                label="Thời gian bắt đầu"
                icon="⏰"
                value={thoi_gian_bat_dau}
                onChangeText={setthoi_gian_bat_dau}
                placeholder="VD: 14 (14h)"
                keyboardType="numeric"
              />

              <InputField
                label="Thời gian kết thúc"
                icon="⏱️"
                value={thoi_gian_ket_thuc}
                onChangeText={setthoi_gian_ket_thuc}
                placeholder="VD: 16 (16h)"
                keyboardType="numeric"
              />

              {/* Movie Selector */}
              <View style={styles.inputContainer}>
                <View style={styles.inputLabelContainer}>
                  <Text style={styles.inputIcon}>🎭</Text>
                  <Text style={styles.inputLabel}>Phim</Text>
                </View>
                <TouchableOpacity style={styles.movieSelector} onPress={() => setPhimModal(true)} activeOpacity={0.8}>
                  <View style={styles.movieSelectorContent}>
                    {selectedMovie && (
                      <Image source={{ uri: selectedMovie.poster_url }} style={styles.selectedMoviePoster} />
                    )}
                    <Text style={[styles.movieSelectorText, selectedMovie && styles.movieSelectorTextSelected]}>
                      {selectedMovie?.ten_phim || "Chọn phim"}
                    </Text>
                  </View>
                  <Text style={styles.arrowIcon}>→</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={[styles.saveBtn, isSubmitting && styles.saveBtnDisabled]}
                onPress={handleUpdate}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={styles.saveBtnIcon}>💾</Text>
                    <Text style={styles.saveBtnText}>Cập nhật</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
                <Text style={styles.cancelBtnIcon}>✕</Text>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Movie Selection Modal */}
      <Modal visible={phimModal} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalIcon}>🎭</Text>
              <Text style={styles.modalTitle}>Chọn Phim</Text>
              <TouchableOpacity onPress={() => setPhimModal(false)} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Tìm kiếm phim..."
              value={searchPhim}
              onChangeText={setSearchPhim}
              style={styles.searchInput}
              placeholderTextColor="#999"
            />

            <ScrollView showsVerticalScrollIndicator={false} style={styles.movieList}>
              {listphim
                .filter((item) => item.ten_phim.toLowerCase().includes(searchPhim.toLowerCase()))
                .map((item) => (
                  <TouchableOpacity
                    key={item.phim_id}
                    onPress={() => {
                      setphim_id(item.phim_id)
                      setPhimModal(false)
                    }}
                    style={[styles.movieItem, phim_id === item.phim_id && styles.movieItemSelected]}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: item.poster_url }} style={styles.moviePoster} />
                    <View style={styles.movieItemInfo}>
                      <Text
                        style={[styles.movieName, phim_id === item.phim_id && styles.movieNameSelected]}
                        numberOfLines={2}
                      >
                        {item.ten_phim}
                      </Text>
                      <Text style={styles.movieDuration}>Thời lượng: {item.thoi_luong || "N/A"} phút</Text>
                    </View>
                    {phim_id === item.phim_id && <Text style={styles.selectedIcon}>✓</Text>}
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default CapNhatSuatChieu

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#6366f1",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  headerIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSpacer: {
    width: 40,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  currentMovieContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 15,
  },
  currentMovieCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  currentMoviePoster: {
    width: 60,
    height: 90,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    marginRight: 16,
  },
  currentMovieInfo: {
    flex: 1,
  },
  currentMovieTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 6,
    lineHeight: 22,
  },
  currentMovieDetails: {
    fontSize: 14,
    color: "#6b7280",
  },
  formSection: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#374151",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  movieSelector: {
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  movieSelectorContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  selectedMoviePoster: {
    width: 40,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    marginRight: 12,
  },
  movieSelectorText: {
    fontSize: 16,
    color: "#999",
    flex: 1,
  },
  movieSelectorTextSelected: {
    color: "#374151",
    fontWeight: "500",
  },
  arrowIcon: {
    fontSize: 16,
    color: "#6b7280",
  },
  actionContainer: {
    gap: 16,
  },
  saveBtn: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelBtn: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 16,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelBtnIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  cancelBtnText: {
    color: "#6b7280",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  modalIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
  },
  closeBtn: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtnText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "bold",
  },
  searchInput: {
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#fff",
    color: "#374151",
  },
  movieList: {
    maxHeight: 400,
  },
  movieItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 2,
    borderColor: "transparent",
  },
  movieItemSelected: {
    backgroundColor: "#eff6ff",
    borderColor: "#6366f1",
  },
  moviePoster: {
    width: 50,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    marginRight: 12,
  },
  movieItemInfo: {
    flex: 1,
  },
  movieName: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 4,
    lineHeight: 22,
  },
  movieNameSelected: {
    color: "#6366f1",
    fontWeight: "600",
  },
  movieDuration: {
    fontSize: 12,
    color: "#6b7280",
  },
  selectedIcon: {
    fontSize: 18,
    color: "#6366f1",
    fontWeight: "bold",
  },
})
