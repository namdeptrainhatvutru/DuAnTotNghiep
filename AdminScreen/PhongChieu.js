"use client"

import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addPhongChieu, deletePhongChieu, fetchPhongChieu, updatePhongChieu } from "../redux/actions/PhongChieuAction"
import { useNavigation } from "@react-navigation/native"
import { deleteAllSuatChieuByRoomId } from "../redux/actions/SuatChieuAction"

const PhongChieu = ({ route }) => {
  const { cinema_id, ten_rap } = route.params
  const dispatch = useDispatch()
  const [ten_phong, setTen_Phong] = useState("")
  const listPhongChieu = useSelector((state) => state.phongchieu.listphongchieu)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const navigation = useNavigation()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    dispatch(fetchPhongChieu(cinema_id)).then(() => {
      setLoading(false)
    })
  }, [cinema_id, dispatch])

  const handleAdd = () => {
    if (ten_phong.trim() === "") {
      alert("Vui lòng nhập tên phòng")
      return
    }

    const newRoom = {
      ten_phong: ten_phong,
      cinema_id: cinema_id,
    }

    dispatch(addPhongChieu(newRoom)).then((res) => {
      setTen_Phong("")
      const createdRoom = res.payload
      setTimeout(() => {
        dispatch(fetchPhongChieu(cinema_id))
      }, 400)
    })
  }

  const handleDelete = (room_id) => {
    dispatch(deletePhongChieu(room_id))
    dispatch(deleteAllSuatChieuByRoomId(room_id))
  }

  const handleEdit = () => {
    const updatedRoom = {
      room_id: selectedRoom.room_id,
      ten_phong: ten_phong,
    }

    dispatch(updatePhongChieu(updatedRoom)).then(() => {
      setModalVisible(false)
      setTen_Phong("")
      setSelectedRoom(null)
    })
  }

  const openModal = (item) => {
    setModalVisible(true)
    setSelectedRoom(item)
    setTen_Phong(item.ten_phong)
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.roomIcon}>
          <Text style={styles.roomIconText}>🎬</Text>
        </View>
        <View style={styles.roomInfo}>
          <Text style={styles.roomTitle}>{item.ten_phong}</Text>
          <Text style={styles.roomId}>ID: {item.room_id}</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.room_id)}>
          <Text style={styles.btnText}>🗑️ Xóa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editBtn} onPress={() => openModal(item)}>
          <Text style={styles.btnText}>✏️ Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.scheduleBtn}
          onPress={() => {
            navigation.navigate("SuatChieu", {
              room_id: item.room_id,
              ten_phong: item.ten_phong,
            })
          }}
        >
          <Text style={styles.btnText}>📅 Suất chiếu</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎭 {ten_rap}</Text>
        <Text style={styles.headerSubtitle}>Quản lý phòng chiếu</Text>
      </View>

      {/* Add Room Form */}
      <View style={styles.addSection}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>🎬 Tên phòng chiếu</Text>
          <TextInput
            placeholder="Nhập tên phòng chiếu..."
            value={ten_phong}
            onChangeText={setTen_Phong}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>➕ Thêm phòng chiếu</Text>
        </TouchableOpacity>
      </View>

      {/* Room List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D32F2F" />
          <Text style={styles.loadingText}>Đang tải danh sách phòng chiếu...</Text>
        </View>
      ) : !listPhongChieu || listPhongChieu.length === 0 || listPhongChieu === "Not found" ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎭</Text>
          <Text style={styles.emptyText}>Chưa có phòng chiếu nào</Text>
          <Text style={styles.emptySubtext}>Thêm phòng chiếu đầu tiên để bắt đầu</Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>📋 Danh sách phòng chiếu ({listPhongChieu.length})</Text>
          <FlatList
            data={listPhongChieu}
            keyExtractor={(item) => item.room_id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {/* Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>✏️ Cập nhật phòng chiếu</Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false)
                  setTen_Phong("")
                }}
                style={styles.closeButton}
              >
                <Text style={styles.closeIcon}>❌</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>🎬 Tên phòng chiếu</Text>
                <TextInput
                  placeholder="Nhập tên phòng chiếu..."
                  value={ten_phong}
                  onChangeText={setTen_Phong}
                  style={styles.input}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.primaryButton} onPress={handleEdit}>
                  <Text style={styles.primaryButtonText}>💾 Cập nhật</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => {
                    setModalVisible(false)
                    setTen_Phong("")
                  }}
                >
                  <Text style={styles.secondaryButtonText}>↩️ Hủy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default PhongChieu

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D32F2F",
    textAlign: "center",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  addSection: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  addBtn: {
    backgroundColor: "#388E3C",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#388E3C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  roomIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  roomIconText: {
    fontSize: 20,
  },
  roomInfo: {
    flex: 1,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  roomId: {
    fontSize: 14,
    color: "#666",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  deleteBtn: {
    backgroundColor: "#E53935",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  editBtn: {
    backgroundColor: "#1976D2",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  scheduleBtn: {
    backgroundColor: "#388E3C",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#D32F2F",
  },
  closeButton: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 16,
  },
  modalContent: {
    padding: 20,
  },
  modalActions: {
    gap: 12,
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: "#D32F2F",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#D32F2F",
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
