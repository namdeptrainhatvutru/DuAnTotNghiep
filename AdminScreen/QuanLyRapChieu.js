"use client"

import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { addRapChieu, deleteRapChieu, fetchRapChieu, updateRapChieu } from "../redux/actions/RapChieuAction"
import { useNavigation } from "@react-navigation/native"

const { width } = Dimensions.get("window")

const QuanLyRapChieu = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [modalVisible2, setModalVisible2] = useState(false)
  const [ten_rap, setTenRap] = useState("")
  const [dia_chi, setDiaChi] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dispatch = useDispatch()
  const listRapChieu = useSelector((state) => state.rapchieu.listrapchieu)
  const [selectedRapChieu, setSelectedRapChieu] = useState(null)
  const navigation = useNavigation()

  useEffect(() => {
    setIsLoading(true)
    dispatch(fetchRapChieu()).finally(() => setIsLoading(false))
  }, [])

  const handleAddRapChieu = async () => {
    if (!ten_rap.trim() || !dia_chi.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!")
      return
    }

    setIsSubmitting(true)
    const rapchieu = { ten_rap: ten_rap.trim(), dia_chi: dia_chi.trim() }

    try {
      await dispatch(addRapChieu(rapchieu))
      setModalVisible(false)
      setTenRap("")
      setDiaChi("")
      Alert.alert("Thành công", "Đã thêm rạp chiếu mới!")
      setTimeout(() => {
        dispatch(fetchRapChieu())
      }, 300)
    } catch (error) {
      Alert.alert("Lỗi", "Không thể thêm rạp chiếu. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteRapChieu = (id) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa rạp chiếu này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          setIsSubmitting(true)
          try {
            await dispatch(deleteRapChieu(id))
            setModalVisible2(false)
            setTenRap("")
            setDiaChi("")
            setSelectedRapChieu(null)
            dispatch(fetchRapChieu())
            Alert.alert("Thành công", "Đã xóa rạp chiếu!")
          } catch (error) {
            Alert.alert("Lỗi", "Không thể xóa rạp chiếu. Vui lòng thử lại.")
          } finally {
            setIsSubmitting(false)
          }
        },
      },
    ])
  }

  const openChinhSuaRapChieu = (item) => {
    setSelectedRapChieu(item)
    setModalVisible2(true)
    setTenRap(item.ten_rap)
    setDiaChi(item.dia_chi)
  }

  const handleUpdateRapChieu = async () => {
    if (!ten_rap.trim() || !dia_chi.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!")
      return
    }

    setIsSubmitting(true)
    const updated = {
      ...selectedRapChieu,
      ten_rap: ten_rap.trim(),
      dia_chi: dia_chi.trim(),
    }

    try {
      await dispatch(updateRapChieu(updated))
      setModalVisible2(false)
      setSelectedRapChieu(null)
      setTenRap("")
      setDiaChi("")
      dispatch(fetchRapChieu())
      Alert.alert("Thành công", "Đã cập nhật rạp chiếu!")
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật rạp chiếu. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeModal = () => {
    setModalVisible(false)
    setModalVisible2(false)
    setTenRap("")
    setDiaChi("")
    setSelectedRapChieu(null)
  }

  const renderItem = ({ item, index }) => (
    <View style={[styles.card, { marginTop: index === 0 ? 0 : 16 }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cinemaIcon}>
          <Text style={styles.cinemaIconText}>🎭</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.ten_rap}
          </Text>
          <View style={styles.addressContainer}>
            <Text style={styles.addressIcon}>📍</Text>
            <Text style={styles.cardAddress} numberOfLines={2}>
              {item.dia_chi}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => {
            navigation.navigate("PhongChieu", {
              cinema_id: item.cinema_id,
              ten_rap: item.ten_rap,
            })
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.arrowIcon}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => openChinhSuaRapChieu(item)} activeOpacity={0.8}>
          <Text style={styles.editIcon}>✏️</Text>
          <Text style={styles.editBtnText}>Chỉnh sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.editBtn, { backgroundColor: "#ef4444", marginLeft: 10 }]}
          onPress={() => handleDeleteRapChieu(item.cinema_id)}
          activeOpacity={0.8}
        >
          <Text style={styles.editIcon}>🗑️</Text>
          <Text style={styles.editBtnText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.headerIcon}>🏢</Text>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Quản Lý Rạp Chiếu</Text>
          <Text style={styles.subtitle}>{listRapChieu?.length || 0} rạp chiếu</Text>
        </View>
      </View>
    </View>
  )

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🎭</Text>
      <Text style={styles.emptyTitle}>Chưa có rạp chiếu nào</Text>
      <Text style={styles.emptySubtitle}>Nhấn nút + để thêm rạp chiếu mới</Text>
    </View>
  )

  const InputField = ({ label, value, onChangeText, placeholder, icon }) => (
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
      />
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />

      {renderHeader()}

      <View style={styles.listWrapper}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>Đang tải...</Text>
          </View>
        ) : (
          <FlatList
            data={listRapChieu}
            keyExtractor={(item) => item.cinema_id?.toString() || Math.random().toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmpty}
          />
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
        <View style={styles.fabContent}>
          <Text style={styles.fabIcon}>+</Text>
        </View>
      </TouchableOpacity>

      {/* Add Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalIcon}>🏢</Text>
              <Text style={styles.modalTitle}>Thêm Rạp Chiếu</Text>
            </View>

            <InputField
              label="Tên rạp"
              icon="🎭"
              value={ten_rap}
              onChangeText={setTenRap}
              placeholder="Nhập tên rạp chiếu..."
            />

            <InputField
              label="Địa chỉ"
              icon="📍"
              value={dia_chi}
              onChangeText={setDiaChi}
              placeholder="Nhập địa chỉ rạp..."
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.primaryBtn]}
                onPress={handleAddRapChieu}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={styles.modalBtnIcon}>✨</Text>
                    <Text style={styles.modalBtnText}>Thêm</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalBtn, styles.secondaryBtn]} onPress={closeModal}>
                <Text style={styles.modalBtnIcon}>✕</Text>
                <Text style={[styles.modalBtnText, styles.secondaryBtnText]}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit/Delete Modal */}
      <Modal visible={modalVisible2} animationType="slide" transparent>
        {selectedRapChieu && (
          <View style={styles.modalBg}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalIcon}>✏️</Text>
                <Text style={styles.modalTitle}>Chỉnh Sửa Rạp Chiếu</Text>
              </View>

              <InputField
                label="Tên rạp"
                icon="🎭"
                value={ten_rap}
                onChangeText={setTenRap}
                placeholder="Nhập tên rạp chiếu..."
              />

              <InputField
                label="Địa chỉ"
                icon="📍"
                value={dia_chi}
                onChangeText={setDiaChi}
                placeholder="Nhập địa chỉ rạp..."
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.primaryBtn]}
                  onPress={handleUpdateRapChieu}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Text style={styles.modalBtnIcon}>💾</Text>
                      <Text style={styles.modalBtnText}>Cập nhật</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalBtn, styles.dangerBtn]}
                  onPress={() => handleDeleteRapChieu(selectedRapChieu.cinema_id)}
                  disabled={isSubmitting}
                >
                  <Text style={styles.modalBtnIcon}>🗑️</Text>
                  <Text style={styles.modalBtnText}>Xóa</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.modalBtn, styles.secondaryBtn]} onPress={closeModal}>
                  <Text style={styles.modalBtnIcon}>✕</Text>
                  <Text style={[styles.modalBtnText, styles.secondaryBtnText]}>Đóng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </View>
  )
}

export default QuanLyRapChieu

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#6366f1",
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  listWrapper: {
    flex: 1,
    paddingTop: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6b7280",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  cinemaIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cinemaIconText: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
    paddingRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
    lineHeight: 24,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  addressIcon: {
    fontSize: 14,
    marginRight: 6,
    marginTop: 2,
  },
  cardAddress: {
    fontSize: 14,
    color: "#6b7280",
    flex: 1,
    lineHeight: 20,
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowIcon: {
    fontSize: 20,
    color: "#6366f1",
    fontWeight: "bold",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  editBtn: {
    backgroundColor: "#6366f1",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  editIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  editBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  fabContent: {
    width: "100%",
    height: "100%",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  fabIcon: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "300",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.9,
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
    marginBottom: 25,
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
  modalActions: {
    marginTop: 10,
  },
  modalBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryBtn: {
    backgroundColor: "#6366f1",
  },
  dangerBtn: {
    backgroundColor: "#ef4444",
  },
  secondaryBtn: {
    backgroundColor: "#f3f4f6",
    marginBottom: 0,
  },
  modalBtnIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryBtnText: {
    color: "#6b7280",
  },
})
