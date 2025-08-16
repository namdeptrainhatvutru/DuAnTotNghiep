"use client"

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  ScrollView,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native"
import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigation } from "@react-navigation/native"
import { updateUser } from "../redux/actions/UserAction"
import BASE from "../config/BaseUrl"

const { width } = Dimensions.get("window")

const Profile = () => {
  const user = useSelector((state) => state.user.user)
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)
  const [hoTen, setHoTen] = React.useState(user.ho_ten || "")
  const [email, setEmail] = React.useState(user.email || "")
  const [soDienThoai, setSoDienThoai] = React.useState(user.so_dien_thoai || "")
  const [ngaySinh, setNgaySinh] = React.useState(user.ngay_sinh || "")
  const [gioiTinh, setGioiTinh] = React.useState(user.gioi_tinh?.toString() || "")
  const [tongChiTieu, setTongChiTieu] = useState(0)

  useEffect(() => {
    if (!user?.khach_hang_id) return
    fetch(`http://${BASE}:3000/thanhtoan?khach_hang_id=${user.khach_hang_id}`)
      .then((res) => res.json())
      .then((data) => {
        // data là mảng các giao dịch
        const total = Array.isArray(data) ? data.reduce((sum, item) => sum + (item.so_tien || 0), 0) : 0
        setTongChiTieu(total)
      })
      .catch(() => setTongChiTieu(0))
  }, [user?.khach_hang_id])

  const openModal = () => {
    setHoTen(user.ho_ten || "")
    setEmail(user.email || "")
    setSoDienThoai(user.so_dien_thoai || "")
    setNgaySinh(user.ngay_sinh || "")
    setGioiTinh(user.gioi_tinh?.toString() || "")
    setModalVisible(true)
  }

  const handleSave = async () => {
    if (!hoTen.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập họ tên!")
      return
    }

    const updatedUser = {
      ...user,
      ho_ten: hoTen.trim(),
      email,
      so_dien_thoai: soDienThoai.trim(),
      ngay_sinh: ngaySinh.trim(),
      gioi_tinh: gioiTinh,
    }

    try {
      await dispatch(updateUser(updatedUser))
      setModalVisible(false)
      Alert.alert("Thành công", "Cập nhật thông tin thành công!")
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật thông tin. Vui lòng thử lại.")
    }
  }

  const handleLogout = () => {
    Alert.alert("Xác nhận đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        },
      },
    ])
  }

  const formatGender = (gender) => {
    if (gender === "1") return "Nam"
    if (gender === "2") return "Nữ"
    return "Chưa cập nhật"
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerBackground}>
        <Text style={styles.headerIcon}>👤</Text>
        <Text style={styles.headerTitle}>Hồ Sơ Cá Nhân</Text>
        <Text style={styles.headerSubtitle}>Quản lý thông tin của bạn</Text>
      </View>
    </View>
  )

  const renderProfileCard = () => (
    <View style={styles.profileCard}>
      {/* Edit Button */}
      <TouchableOpacity style={styles.editBtn} onPress={openModal} activeOpacity={0.8}>
        <Text style={styles.editIcon}>✏️</Text>
      </TouchableOpacity>

      {/* Profile Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarWrapper}>
          <Image style={styles.avatar} source={require("../img/profile.png")} />
          <View style={styles.avatarBadge}>
            <Text style={styles.avatarBadgeText}>VIP</Text>
          </View>
        </View>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.ho_ten || "Chưa cập nhật"}</Text>
        <Text style={styles.userTitle}>Thành viên MOVIX</Text>
      </View>

      {/* Membership Card */}
      <View style={styles.membershipCard}>
        <View style={styles.membershipHeader}>
          <Text style={styles.membershipIcon}>💳</Text>
          <Text style={styles.membershipTitle}>Thẻ Thành Viên</Text>
        </View>
        <Image source={require("../img/thanhvien.png")} style={styles.membershipImage} />
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>💰</Text>
          <Text style={styles.statValue}>{tongChiTieu.toLocaleString("vi-VN")}đ</Text>
          <Text style={styles.statLabel}>Tổng chi tiêu</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={styles.statValue}>{user.diem || 0}</Text>
          <Text style={styles.statLabel}>Điểm thưởng</Text>
        </View>
      </View>

      {/* User Details */}
      <View style={styles.detailsSection}>
        <Text style={styles.detailsTitle}>📋 Thông tin chi tiết</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📧</Text>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{user.email || "Chưa cập nhật"}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📱</Text>
            <Text style={styles.detailLabel}>Số điện thoại</Text>
            <Text style={styles.detailValue}>{user.so_dien_thoai || "Chưa cập nhật"}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>🎂</Text>
            <Text style={styles.detailLabel}>Ngày sinh</Text>
            <Text style={styles.detailValue}>{user.ngay_sinh || "Chưa cập nhật"}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>👥</Text>
            <Text style={styles.detailLabel}>Giới tính</Text>
            <Text style={styles.detailValue}>{formatGender(user.gioi_tinh)}</Text>
          </View>
        </View>
      </View>
    </View>
  )

  const renderLogoutButton = () => (
    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
      <Text style={styles.logoutIcon}>🚪</Text>
      <Text style={styles.logoutText}>Đăng xuất</Text>
    </TouchableOpacity>
  )

  const renderEnhancedModal = () => (
    <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.enhancedModalContent}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderContent}>
              <Text style={styles.modalHeaderIcon}>✏️</Text>
              <View style={styles.modalHeaderText}>
                <Text style={styles.modalTitle}>Cập Nhật Thông Tin</Text>
                <Text style={styles.modalSubtitle}>Chỉnh sửa thông tin cá nhân</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Form Content - Fixed the ScrollView issue */}
          <View style={styles.modalBody}>
            <ScrollView
              style={styles.modalScrollView}
              contentContainerStyle={styles.scrollContentContainer}
              showsVerticalScrollIndicator={false}
            >
              {/* Form Fields */}
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <View style={styles.inputLabelContainer}>
                    <Text style={styles.inputIcon}>👤</Text>
                    <Text style={styles.inputLabel}>Họ và tên</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={hoTen}
                    onChangeText={setHoTen}
                    placeholder="Nhập họ và tên..."
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.inputLabelContainer}>
                    <Text style={styles.inputIcon}>📧</Text>
                    <Text style={styles.inputLabel}>Email</Text>
                  </View>
                  <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email của bạn..."
                    placeholderTextColor="#9ca3af"
                    editable={false}
                  />
                  <Text style={styles.disabledNote}>Email không thể thay đổi</Text>
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.inputLabelContainer}>
                    <Text style={styles.inputIcon}>📱</Text>
                    <Text style={styles.inputLabel}>Số điện thoại</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={soDienThoai}
                    onChangeText={setSoDienThoai}
                    placeholder="Nhập số điện thoại..."
                    placeholderTextColor="#9ca3af"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.inputLabelContainer}>
                    <Text style={styles.inputIcon}>🎂</Text>
                    <Text style={styles.inputLabel}>Ngày sinh</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={ngaySinh}
                    onChangeText={setNgaySinh}
                    placeholder="dd/mm/yyyy"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.inputLabelContainer}>
                    <Text style={styles.inputIcon}>👥</Text>
                    <Text style={styles.inputLabel}>Giới tính</Text>
                  </View>
                  <View style={styles.genderContainer}>
                    <TouchableOpacity
                      style={[styles.genderBtn, gioiTinh === "1" && styles.genderBtnActive]}
                      onPress={() => setGioiTinh("1")}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.genderBtnText, gioiTinh === "1" && styles.genderBtnTextActive]}>👨 Nam</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.genderBtn, gioiTinh === "2" && styles.genderBtnActive]}
                      onPress={() => setGioiTinh("2")}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.genderBtnText, gioiTinh === "2" && styles.genderBtnTextActive]}>👩 Nữ</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>

          {/* Modal Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
              <Text style={styles.saveBtnIcon}>💾</Text>
              <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)} activeOpacity={0.8}>
              <Text style={styles.cancelBtnText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
      {renderHeader()}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderProfileCard()}
        {renderLogoutButton()}
        <View style={{ height: 30 }} />
      </ScrollView>
      {renderEnhancedModal()}
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#6366f1",
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerBackground: {
    alignItems: "center",
  },
  headerIcon: {
    fontSize: 40,
    marginBottom: 10,
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
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 25,
    margin: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    position: "relative",
  },
  editBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#6366f1",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  editIcon: {
    fontSize: 18,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#6366f1",
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#f59e0b",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 25,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  userTitle: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  membershipCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 16,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: "#6366f1",
  },
  membershipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  membershipIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  membershipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
  },
  membershipImage: {
    width: "100%",
    height: 60,
    resizeMode: "contain",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 20,
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 15,
  },
  detailsCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  detailIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    width: 100,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  detailDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 4,
  },
  logoutBtn: {
    backgroundColor: "#ef4444",
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Enhanced Modal Styles - FIXED
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  enhancedModalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: "85%", // Fixed height instead of maxHeight
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  modalHeaderIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  modalHeaderText: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseBtnText: {
    fontSize: 18,
    color: "#6b7280",
    fontWeight: "bold",
  },
  // Fixed modal body structure
  modalBody: {
    flex: 1,
  },
  modalScrollView: {
    flex: 1,
    paddingHorizontal: 25,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  formContainer: {
    paddingVertical: 10,
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
  disabledInput: {
    backgroundColor: "#f9fafb",
    color: "#9ca3af",
  },
  disabledNote: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
    fontStyle: "italic",
  },
  genderContainer: {
    flexDirection: "row",
    gap: 12,
  },
  genderBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 15,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  genderBtnActive: {
    borderColor: "#6366f1",
    backgroundColor: "#eff6ff",
  },
  genderBtnText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  genderBtnTextActive: {
    color: "#6366f1",
    fontWeight: "bold",
  },
  modalFooter: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    gap: 12,
  },
  saveBtn: {
    backgroundColor: "#6366f1",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveBtnIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelBtn: {
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#6b7280",
    fontSize: 16,
    fontWeight: "600",
  },
})
