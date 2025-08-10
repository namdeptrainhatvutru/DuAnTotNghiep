"use client"

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from "react-native"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchVoucher, addVoucher, deleteVoucher, updateVoucher } from "../redux/actions/VoucherAction"

const { width } = Dimensions.get("window")

const QuanLyVoucher = () => {
  const dispatch = useDispatch()
  const listvoucher = useSelector((state) => state.voucher.listvoucher)
  const [modalVisible, setModalVisible] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [currentVoucher, setCurrentVoucher] = useState(null)
  const [ma_voucher, setMaVoucher] = useState("")
  const [giam_gia, setGiamGia] = useState("")
  const [thoi_gian_het_han, setThoiGianHetHan] = useState("")
  const [khach_hang_id, setKhachHangId] = useState("")
  const [loading, setLoading] = useState(false)
  const [soLuong, setSoLuong] = useState("1")
  const [selectedTab, setSelectedTab] = useState("chuaSoHuu")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const chuaSoHuu = listvoucher.filter((v) => !v.khach_hang_id)
  const daSoHuu = listvoucher.filter((v) => v.khach_hang_id)

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
    setThoiGianHetHan(formatted)
  }

  useEffect(() => {
    setLoading(true)
    dispatch(fetchVoucher()).then(() => setLoading(false))
  }, [dispatch])

  const openAddModal = () => {
    setIsEdit(false)
    setCurrentVoucher(null)
    setMaVoucher("")
    setGiamGia("")
    setThoiGianHetHan("")
    setKhachHangId("")
    setSoLuong("1")
    setModalVisible(true)
  }

  const openEditModal = (voucher) => {
    setIsEdit(true)
    setCurrentVoucher(voucher)
    setMaVoucher(voucher.ma_voucher)
    setGiamGia(String(voucher.giam_gia))
    setThoiGianHetHan(voucher.thoi_gian_het_han)
    setKhachHangId(voucher.khach_hang_id ? String(voucher.khach_hang_id) : "")
    setModalVisible(true)
  }

  const handleSave = async () => {
    if (!ma_voucher || !giam_gia || !thoi_gian_het_han) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin")
      return
    }

    setIsSubmitting(true)
    const voucherData = {
      ma_voucher,
      giam_gia: Number(giam_gia),
      thoi_gian_het_han,
      khach_hang_id: "",
    }

    try {
      if (isEdit && currentVoucher) {
        await dispatch(updateVoucher({ ...currentVoucher, ...voucherData }))
        Alert.alert("Thành công", "Đã cập nhật voucher!")
      } else {
        const n = Number.parseInt(soLuong, 10)
        if (isNaN(n) || n <= 0) {
          Alert.alert("Lỗi", "Số lượng phải là số nguyên dương!")
          setIsSubmitting(false)
          return
        }
        for (let i = 0; i < n; i++) {
          const newVoucher = {
            ...voucherData,
            ma_voucher: n === 1 ? ma_voucher : `${ma_voucher}_${Date.now()}_${i}`,
          }
          await dispatch(addVoucher(newVoucher))
        }
        Alert.alert("Thành công", `Đã thêm ${n} voucher!`)
      }
      await dispatch(fetchVoucher())
      setModalVisible(false)
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu voucher. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = (voucher_id) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa voucher này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          setLoading(true)
          try {
            await dispatch(deleteVoucher(voucher_id))
            await dispatch(fetchVoucher())
            Alert.alert("Thành công", "Đã xóa voucher!")
          } catch (error) {
            Alert.alert("Lỗi", "Không thể xóa voucher. Vui lòng thử lại.")
          } finally {
            setLoading(false)
          }
        },
      },
    ])
  }

  const getVoucherStatus = (item) => {
    if (!item.thoi_gian_het_han) return { status: "Không xác định", isExpired: false }

    const now = new Date()
    let expire
    if (item.thoi_gian_het_han.includes("/")) {
      const [day, month, year] = item.thoi_gian_het_han.split("/")
      expire = new Date(`${year}-${month}-${day}`)
    } else {
      expire = new Date(item.thoi_gian_het_han)
    }

    const isExpired = expire < now
    return {
      status: isExpired ? "Hết hạn" : "Còn hạn",
      isExpired,
    }
  }

  const renderItem = ({ item, index }) => {
    const { status, isExpired } = getVoucherStatus(item)

    return (
      <View style={[styles.voucherCard, isExpired && styles.expiredCard]}>
        <View style={styles.voucherHeader}>
          <View style={styles.voucherIcon}>
            <Text style={styles.voucherIconText}>🎫</Text>
          </View>
          <View style={styles.voucherInfo}>
            <Text style={styles.voucherCode} numberOfLines={1}>
              {item.ma_voucher}
            </Text>
            <View style={styles.discountContainer}>
              <Text style={styles.discountIcon}>💰</Text>
              <Text style={styles.discountText}>Giảm {item.giam_gia}%</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, isExpired ? styles.expiredBadge : styles.validBadge]}>
            <Text style={[styles.statusText, isExpired ? styles.expiredStatusText : styles.validStatusText]}>
              {status}
            </Text>
          </View>
        </View>

        <View style={styles.voucherDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📅</Text>
            <Text style={styles.detailText}>Hết hạn: {item.thoi_gian_het_han || "Không xác định"}</Text>
          </View>
        </View>

        <View style={styles.voucherActions}>
          <TouchableOpacity style={styles.editBtn} onPress={() => openEditModal(item)} activeOpacity={0.8}>
            <Text style={styles.editIcon}>✏️</Text>
            <Text style={styles.editBtnText}>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item.voucher_id || item.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.deleteIcon}>🗑️</Text>
            <Text style={styles.deleteBtnText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.headerIcon}>🎫</Text>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Quản Lý Voucher</Text>
          <Text style={styles.headerSubtitle}>{listvoucher?.length || 0} voucher</Text>
        </View>
      </View>
    </View>
  )

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tabBtn, selectedTab === "chuaSoHuu" && styles.tabBtnActive]}
        onPress={() => setSelectedTab("chuaSoHuu")}
        activeOpacity={0.8}
      >
        <Text style={[styles.tabText, selectedTab === "chuaSoHuu" && styles.tabTextActive]}>
          🆓 Chưa sở hữu ({chuaSoHuu.length})
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabBtn, selectedTab === "daSoHuu" && styles.tabBtnActive]}
        onPress={() => setSelectedTab("daSoHuu")}
        activeOpacity={0.8}
      >
        <Text style={[styles.tabText, selectedTab === "daSoHuu" && styles.tabTextActive]}>
          ✅ Đã sở hữu ({daSoHuu.length})
        </Text>
      </TouchableOpacity>
    </View>
  )

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🎫</Text>
      <Text style={styles.emptyTitle}>Chưa có voucher nào</Text>
      <Text style={styles.emptySubtitle}>Nhấn nút + để thêm voucher mới</Text>
    </View>
  )

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

      {renderHeader()}

      <View style={styles.contentContainer}>
        {renderTabs()}

        <TouchableOpacity style={styles.addBtn} onPress={openAddModal} activeOpacity={0.8}>
          <Text style={styles.addBtnIcon}>✨</Text>
          <Text style={styles.addBtnText}>Thêm voucher</Text>
        </TouchableOpacity>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
          </View>
        ) : (
          <FlatList
            data={selectedTab === "chuaSoHuu" ? chuaSoHuu : daSoHuu}
            keyExtractor={(item) => item.voucher_id?.toString() || Math.random().toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmpty}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          />
        )}
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalIcon}>{isEdit ? "✏️" : "✨"}</Text>
              <Text style={styles.modalTitle}>{isEdit ? "Sửa Voucher" : "Thêm Voucher"}</Text>
            </View>

            <InputField
              label="Mã voucher"
              icon="🎫"
              value={ma_voucher}
              onChangeText={setMaVoucher}
              placeholder="Nhập mã voucher..."
            />

            <InputField
              label="Giảm giá (%)"
              icon="💰"
              value={giam_gia}
              onChangeText={setGiamGia}
              placeholder="Nhập % giảm giá..."
              keyboardType="numeric"
            />

            <InputField
              label="Thời gian hết hạn"
              icon="📅"
              value={thoi_gian_het_han}
              onChangeText={handleDateChange}
              placeholder="DD/MM/YYYY"
              keyboardType="numeric"
              maxLength={10}
            />

            {!isEdit && (
              <InputField
                label="Số lượng voucher"
                icon="🔢"
                value={soLuong}
                onChangeText={setSoLuong}
                placeholder="Nhập số lượng..."
                keyboardType="numeric"
              />
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.primaryBtn]}
                onPress={handleSave}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={styles.modalBtnIcon}>{isEdit ? "💾" : "✨"}</Text>
                    <Text style={styles.modalBtnText}>{isEdit ? "Cập nhật" : "Thêm"}</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.secondaryBtn]}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalBtnIcon}>✕</Text>
                <Text style={[styles.modalBtnText, styles.secondaryBtnText]}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default QuanLyVoucher

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
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  contentContainer: {
    flex: 1,
    paddingTop: 20,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  tabBtnActive: {
    backgroundColor: "#6366f1",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  tabTextActive: {
    color: "#fff",
  },
  addBtn: {
    backgroundColor: "#6366f1",
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addBtnIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
  voucherCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
  },
  expiredCard: {
    borderLeftColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  voucherHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  voucherIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  voucherIconText: {
    fontSize: 24,
  },
  voucherInfo: {
    flex: 1,
  },
  voucherCode: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  discountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  discountIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  discountText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  validBadge: {
    backgroundColor: "#dcfce7",
  },
  expiredBadge: {
    backgroundColor: "#fee2e2",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  validStatusText: {
    color: "#16a34a",
  },
  expiredStatusText: {
    color: "#dc2626",
  },
  voucherDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#6b7280",
  },
  voucherActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
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
  deleteBtn: {
    backgroundColor: "#ef4444",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  deleteBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
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
