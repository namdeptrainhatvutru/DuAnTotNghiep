"use client"

import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from "react-native"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addSuatChieu, deleteSuatChieu, fetchSuatChieu } from "../redux/actions/SuatChieuAction"
import { fetchPhim } from "../redux/actions/PhimAction"
import { useNavigation } from "@react-navigation/native"
import { addGhe, deleteGheBySuatChieuId, fetchGheByRoomId } from "../redux/actions/GheAction"

const { width } = Dimensions.get("window")

const SuatChieu = ({ route }) => {
  const { room_id, ten_phong } = route.params
  const dispatch = useDispatch()
  const [ngay_chieu, setngay_chieu] = useState("")
  const [thoi_gian_bat_dau, setthoi_gian_bat_dau] = useState("")
  const [thoi_gian_ket_thuc, setthoi_gian_ket_thuc] = useState("")
  const [phim_id, setphim_id] = useState("")
  const [modal, setModal] = useState(false)
  const [phimModal, setPhimModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchPhim, setSearchPhim] = useState("")
  const [activeTab, setActiveTab] = useState("chua")

  const listsuatchieu = useSelector((state) => state.suatchieu.listsuatchieu)
  const listphim = useSelector((state) => state.phim.listphim)
  const navigation = useNavigation()

  // Cập nhật hàm handleDateChange để validate tốt hơn
  const handleDateChange = (text) => {
    // Chỉ cho phép nhập số
    const cleaned = text.replace(/[^\d]/g, "")
    let formatted = ""

    // Format theo dd/mm/yyyy
    if (cleaned.length <= 2) {
      formatted = cleaned
    } else if (cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`
    } else {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`
    }

    // Validate ngày/tháng hợp lệ
    const parts = formatted.split("/")

    // Validate ngày
    let day = Number.parseInt(parts[0], 10)
    if (isNaN(day)) day = 0
    if (day > 31) parts[0] = "31"
    else if (day < 1 && parts[0].length === 2) parts[0] = "01"

    // Validate tháng
    if (parts.length > 1) {
      let month = Number.parseInt(parts[1], 10)
      if (isNaN(month)) month = 0
      if (month > 12) parts[1] = "12"
      else if (month < 1 && parts[1].length === 2) parts[1] = "01"

      // Validate số ngày trong tháng
      if (parts[1] === "02") {
        // Tháng 2
        if (parts.length > 2) {
          const year = Number.parseInt(parts[2], 10)
          const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
          if (day > (isLeapYear ? 29 : 28)) parts[0] = isLeapYear ? "29" : "28"
        } else if (day > 29) {
          parts[0] = "29" // Tối đa 29 cho tháng 2
        }
      } else if (["04", "06", "09", "11"].includes(parts[1])) {
        if (day > 30) parts[0] = "30"
      }
    }

    // Ghép lại thành chuỗi định dạng
    if (parts.length === 3) {
      formatted = `${parts[0]}/${parts[1]}/${parts[2]}`
    } else if (parts.length === 2) {
      formatted = `${parts[0]}/${parts[1]}`
    } else {
      formatted = parts[0]
    }

    setngay_chieu(formatted)
  }

  useEffect(() => {
    setLoading(true)
    dispatch(fetchPhim())
    dispatch(fetchSuatChieu(room_id)).then(() => {
      setLoading(false)
    })
  }, [dispatch, room_id])

  const getTrangThai = (item) => {
    if (!item.ngay_chieu) return ""
    const [day, month, year] = item.ngay_chieu.split("/")
    const ngayChieuDate = new Date(`${year}-${month}-${day}`)
    const now = new Date()
    ngayChieuDate.setHours(0, 0, 0, 0)
    now.setHours(0, 0, 0, 0)
    const diffTime = ngayChieuDate.getTime() - now.getTime()
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
    const nowHour = new Date().getHours()
    const gioKetThuc = Number.parseInt(item.thoi_gian_ket_thuc, 10)

    if (diffDays === 0) {
      if (nowHour >= gioKetThuc) return "Đã kết thúc"
      return "Chưa chiếu"
    } else if (diffDays < 0) {
      return "Đã kết thúc"
    } else {
      return "Chưa chiếu"
    }
  }

  const getDetailedStatus = (item) => {
    if (!item.ngay_chieu) return { status: "", color: "#6b7280" }
    const [day, month, year] = item.ngay_chieu.split("/")
    const ngayChieuDate = new Date(`${year}-${month}-${day}`)
    const now = new Date()
    ngayChieuDate.setHours(0, 0, 0, 0)
    now.setHours(0, 0, 0, 0)
    const diffTime = ngayChieuDate.getTime() - now.getTime()
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
    const nowHour = new Date().getHours()
    const gioKetThuc = Number.parseInt(item.thoi_gian_ket_thuc, 10)

    if (diffDays === 0) {
      if (nowHour >= gioKetThuc) {
        return { status: "Đã kết thúc", color: "#6b7280" }
      } else {
        return { status: "Đang chiếu", color: "#10b981" }
      }
    } else if (diffDays < 0) {
      return { status: "Đã kết thúc", color: "#6b7280" }
    } else if (diffDays === 1) {
      return { status: "Sắp chiếu", color: "#f59e0b" }
    } else if (diffDays > 1) {
      return { status: "Chưa chiếu", color: "#6366f1" }
    }
    return { status: "", color: "#6b7280" }
  }

  const filteredList = Array.isArray(listsuatchieu)
    ? listsuatchieu.filter((item) =>
        activeTab === "chua" ? getTrangThai(item) !== "Đã kết thúc" : getTrangThai(item) === "Đã kết thúc",
      )
    : []

  // Cập nhật hàm handleAddSuatChieu để validate định dạng ngày
const handleAddSuatChieu = async () => {
  // Validate ngày chiếu đúng định dạng dd/mm/yyyy
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  if (!ngay_chieu || !dateRegex.test(ngay_chieu)) {
    Alert.alert("Lỗi", "Vui lòng nhập đúng định dạng ngày chiếu DD/MM/YYYY");
    return;
  }

  // Kiểm tra thời gian bắt đầu và kết thúc
  if (!thoi_gian_bat_dau || !thoi_gian_ket_thuc) {
    Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thời gian");
    return;
  }

  const startTime = parseInt(thoi_gian_bat_dau);
  const endTime = parseInt(thoi_gian_ket_thuc);
  if (isNaN(startTime) || isNaN(endTime) || startTime < 0 || startTime > 23 || endTime < 0 || endTime > 23) {
    Alert.alert("Lỗi", "Thời gian phải là số từ 0 đến 23");
    return;
  }
  if (startTime >= endTime) {
    Alert.alert("Lỗi", "Thời gian kết thúc phải sau thời gian bắt đầu");
    return;
  }

  if (!phim_id) {
    Alert.alert("Lỗi", "Vui lòng chọn phim");
    return;
  }

  setIsSubmitting(true);

  const suatchieu = {
    room_id,
    ngay_chieu,
    thoi_gian_bat_dau,
    thoi_gian_ket_thuc,
    phim_id,
  };

  try {
    const res = await dispatch(addSuatChieu(suatchieu));
    const createdSuatChieu = res.payload;
    const suatChieuId = createdSuatChieu?.suat_chieu_id;

    if (!suatChieuId) {
      Alert.alert("Lỗi", "Không lấy được ID suất chiếu!");
      return;
    }

    // ---- Tạo ghế cho suất chiếu ----
    const gheConfigs = [
      { type: "vip", prefix: "V", count: 10 },
      { type: "thuong", prefix: "G", count: 15 },
      { type: "couple", prefix: "C", count: 5 },
    ];

    for (const config of gheConfigs) {
      const { type, prefix, count } = config;
      for (let i = 1; i <= count; i++) {
        const newGhe = {
          vi_tri: `${prefix}${i}`,
          suat_chieu_id: suatChieuId,
          trang_thai: "trống",
          loai_ghe: type, // chắc chắn có
        };
        const createdGhe = await dispatch(addGhe(newGhe));
        console.log("DEBUG createdGhe:", createdGhe);
      }
    }

    // Cập nhật lại danh sách ghế cho room
    await dispatch(fetchGheByRoomId(suatChieuId));

    Alert.alert("Thành công", "Đã thêm suất chiếu mới!");
    setModal(false);
    setngay_chieu("");
    setthoi_gian_bat_dau("");
    setthoi_gian_ket_thuc("");
    setphim_id("");
  } catch (err) {
    Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại!");
    console.log("Add suatchieu error:", err);
  } finally {
    setIsSubmitting(false);
  }
};




  const handleDeleteShowtime = (item) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa suất chiếu này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await dispatch(deleteSuatChieu(item.suat_chieu_id))
            await dispatch(deleteGheBySuatChieuId(item.suat_chieu_id))
            Alert.alert("Thành công", "Đã xóa suất chiếu!")
          } catch (error) {
            Alert.alert("Lỗi", "Không thể xóa suất chiếu. Vui lòng thử lại.")
          }
        },
      },
    ])
  }

  const renderItem = ({ item, index }) => {
    const phim = listphim.find((p) => p.phim_id === item.phim_id)
    const { status, color } = getDetailedStatus(item)

    return (
      <View style={[styles.showtimeCard, { marginTop: index === 0 ? 0 : 16 }]}>
        <View style={styles.cardHeader}>
          <View style={styles.posterContainer}>
            <Image source={{ uri: phim?.poster_url }} style={styles.poster} />
            <View style={[styles.statusBadge, { backgroundColor: color }]}>
              <Text style={styles.statusText}>{status}</Text>
            </View>
          </View>

          <View style={styles.movieInfo}>
            <Text style={styles.movieTitle} numberOfLines={2}>
              {phim ? phim.ten_phim : "Không tìm thấy phim"}
            </Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📅</Text>
              <Text style={styles.infoText}>Ngày chiếu: {item.ngay_chieu}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>⏰</Text>
              <Text style={styles.infoText}>
                Thời gian: {item.thoi_gian_bat_dau}h - {item.thoi_gian_ket_thuc}h
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              navigation.navigate("CapNhatSuatChieu", {
                phim: phim,
                suat_chieu: item,
              })
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.editIcon}>✏️</Text>
            <Text style={styles.editBtnText}>Chỉnh sửa</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteShowtime(item)} activeOpacity={0.8}>
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
        <Text style={styles.headerIcon}>🎬</Text>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Suất Chiếu</Text>
          <Text style={styles.headerSubtitle}>Phòng: {ten_phong}</Text>
        </View>
      </View>
    </View>
  )

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tabBtn, activeTab === "chua" && styles.tabBtnActive]}
        onPress={() => setActiveTab("chua")}
        activeOpacity={0.8}
      >
        <Text style={[styles.tabText, activeTab === "chua" && styles.tabTextActive]}>
           Chưa chiếu 
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabBtn, activeTab === "ketthuc" && styles.tabBtnActive]}
        onPress={() => setActiveTab("ketthuc")}
        activeOpacity={0.8}
      >
        <Text style={[styles.tabText, activeTab === "ketthuc" && styles.tabTextActive]}>
           Đã kết thúc 
        </Text>
      </TouchableOpacity>
    </View>
  )

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🎬</Text>
      <Text style={styles.emptyTitle}>Chưa có suất chiếu nào</Text>
      <Text style={styles.emptySubtitle}>Nhấn nút + để thêm suất chiếu mới</Text>
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />

      {renderHeader()}

      <View style={styles.contentContainer}>
        {renderTabs()}

        {filteredList.length === 0 ? (
          renderEmpty()
        ) : (
          <FlatList
            data={filteredList}
            keyExtractor={(item) => item.suat_chieu_id?.toString() || Math.random().toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setModal(true)} activeOpacity={0.8}>
        <View style={styles.fabContent}>
          <Text style={styles.fabIcon}>+</Text>
        </View>
      </TouchableOpacity>

      {/* Add Showtime Modal */}
      <Modal visible={modal} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalIcon}>🎬</Text>
              <Text style={styles.modalTitle}>Thêm Suất Chiếu</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
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

              <View style={styles.inputContainer}>
                <View style={styles.inputLabelContainer}>
                  <Text style={styles.inputIcon}>🎭</Text>
                  <Text style={styles.inputLabel}>Phim</Text>
                </View>
                <TouchableOpacity style={styles.movieSelector} onPress={() => setPhimModal(true)}>
                  <Text style={[styles.movieSelectorText, phim_id && styles.movieSelectorTextSelected]}>
                    {phim_id ? listphim.find((p) => p.phim_id === phim_id)?.ten_phim || "Chọn phim" : "Chọn phim"}
                  </Text>
                  <Text style={styles.arrowIcon}>→</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.primaryBtn]}
                onPress={handleAddSuatChieu}
                disabled={isSubmitting}
                activeOpacity={0.8}
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

              <TouchableOpacity
                style={[styles.modalBtn, styles.secondaryBtn]}
                onPress={() => setModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalBtnIcon}>✕</Text>
                <Text style={[styles.modalBtnText, styles.secondaryBtnText]}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
                    <Text
                      style={[styles.movieName, phim_id === item.phim_id && styles.movieNameSelected]}
                      numberOfLines={2}
                    >
                      {item.ten_phim}
                    </Text>
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

export default SuatChieu

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
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6b7280",
  },
  showtimeCard: {
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
    marginBottom: 16,
  },
  posterContainer: {
    position: "relative",
    marginRight: 16,
  },
  poster: {
    width: 70,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },
  statusBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  movieInfo: {
    flex: 1,
    justifyContent: "center",
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#6b7280",
    flex: 1,
  },
  cardActions: {
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
    maxHeight: "90%",
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
  movieSelectorText: {
    fontSize: 16,
    color: "#999",
    flex: 1,
  },
  movieSelectorTextSelected: {
    color: "#374151",
  },
  arrowIcon: {
    fontSize: 16,
    color: "#6b7280",
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
    maxHeight: 300,
  },
  movieItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
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
  movieName: {
    fontSize: 16,
    color: "#374151",
    flex: 1,
  },
  movieNameSelected: {
    color: "#6366f1",
    fontWeight: "600",
  },
  selectedIcon: {
    fontSize: 18,
    color: "#6366f1",
    fontWeight: "bold",
  },
  modalActions: {
    marginTop: 20,
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
