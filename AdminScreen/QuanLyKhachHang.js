"use client"

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { addUser } from "../redux/actions/UserAction"

const QuanLyKhachHang = () => {
  const dispatch = useDispatch()
  const [ho_ten, setHoTen] = useState("")
  const [email, setEmail] = useState("")
  const [mat_khau, setMatKhau] = useState("")
  const [so_dien_thoai, setSoDienThoai] = useState("")
  const [gioi_tinh, setGioi_tinh] = useState("")
  const [ngay_sinh, setNgay_sinh] = useState("")
  const [staff, setStaff] = useState([])
  const [searchText, setSearchText] = useState("")
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editData, setEditData] = useState({
    ho_ten: "",
    email: "",
    mat_khau: "",
    so_dien_thoai: "",
    gioi_tinh: "",
    ngay_sinh: "",
  })
  const [errors, setErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  const getListStaff = async () => {
    const res = await fetch(`https://67ac56315853dfff53da3fd1.mockapi.io/Khach_Hang?vai_tro=1`)
    const data = await res.json()
    setStaff(data)
  }

  useEffect(() => {
    getListStaff()
  }, [])

  const resetForm = () => {
    setHoTen("")
    setEmail("")
    setMatKhau("")
    setSoDienThoai("")
    setNgay_sinh("")
    setGioi_tinh("")
  }

  const validate = () => {
    let newErrors = {};
    if (!ho_ten.trim()) newErrors.ho_ten = "Vui lòng nhập họ tên";
    if (!email.trim()) newErrors.email = "Vui lòng nhập email";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) newErrors.email = "Email không hợp lệ";
    if (!mat_khau) newErrors.mat_khau = "Vui lòng nhập mật khẩu";
    else if (mat_khau.length < 6) newErrors.mat_khau = "Mật khẩu tối thiểu 6 ký tự";
    if (!so_dien_thoai.trim()) newErrors.so_dien_thoai = "Vui lòng nhập số điện thoại";
    else if (!/^\d{9,11}$/.test(so_dien_thoai)) newErrors.so_dien_thoai = "Số điện thoại không hợp lệ";
    if (ngay_sinh && !/^\d{2}\/\d{2}\/\d{4}$/.test(ngay_sinh)) newErrors.ngay_sinh = "Ngày sinh chưa đúng định dạng dd/mm/yyyy";
    return newErrors;
  };

  const validateEdit = () => {
    let newErrors = {};
    if (!editData.ho_ten.trim()) newErrors.ho_ten = "Vui lòng nhập họ tên";
    if (!editData.email.trim()) newErrors.email = "Vui lòng nhập email";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(editData.email)) newErrors.email = "Email không hợp lệ";
    if (!editData.mat_khau) newErrors.mat_khau = "Vui lòng nhập mật khẩu";
    else if (editData.mat_khau.length < 6) newErrors.mat_khau = "Mật khẩu tối thiểu 6 ký tự";
    if (!editData.so_dien_thoai.trim()) newErrors.so_dien_thoai = "Vui lòng nhập số điện thoại";
    else if (!/^\d{9,11}$/.test(editData.so_dien_thoai)) newErrors.so_dien_thoai = "Số điện thoại không hợp lệ";
    if (editData.ngay_sinh && !/^\d{2}\/\d{2}\/\d{4}$/.test(editData.ngay_sinh)) newErrors.ngay_sinh = "Ngày sinh chưa đúng định dạng dd/mm/yyyy";
    return newErrors;
  };

  const handleAddStaff = async () => {
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const user = {
      ho_ten,
      email,
      mat_khau,
      so_dien_thoai,
      ngay_sinh,
      gioi_tinh,
      vai_tro: 1,
      diem: 0,
    }

    try {
      const resultAction = await dispatch(addUser(user))
      if (addUser.fulfilled.match(resultAction)) {
        Alert.alert("Thành công", "Thêm khách hàng thành công!")
        resetForm()
        setAddModalVisible(false)
        getListStaff()
      } else {
        Alert.alert("Lỗi", "Thêm khách hàng thất bại!")
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra!")
    }
  }

  const handleEdit = (item) => {
    setEditId(item.khach_hang_id)
    setEditData({
      ho_ten: item.ho_ten,
      email: item.email,
      mat_khau: item.mat_khau,
      so_dien_thoai: item.so_dien_thoai,
      ngay_sinh: item.ngay_sinh,
      gioi_tinh: item.gioi_tinh,
    })
    setEditModalVisible(true)
  }

  const handleUpdateStaff = async () => {
    const newErrors = validateEdit();
    setEditErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const { ho_ten, email, mat_khau, so_dien_thoai, ngay_sinh, gioi_tinh } = editData
    if (!ho_ten || !email || !mat_khau || !so_dien_thoai) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!")
      return
    }

    try {
      await fetch(`https://67ac56315853dfff53da3fd1.mockapi.io/Khach_Hang/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ho_ten,
          email,
          mat_khau,
          so_dien_thoai,
          ngay_sinh,
          gioi_tinh,
          vai_tro: 1,
          diem: 0,
        }),
      })
      Alert.alert("Cập nhật thành công!")
      setEditModalVisible(false)
      getListStaff()
    } catch (error) {
      Alert.alert("Lỗi", "Không cập nhật được!")
    }
  }

  const handleDelete = async (id) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa khách hàng này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(`https://67ac56315853dfff53da3fd1.mockapi.io/Khach_Hang/${id}`, {
              method: "DELETE",
            })
            if (res.ok) {
              getListStaff()
              Alert.alert("Đã xóa khách hàng!")
            }
          } catch (error) {
            Alert.alert("Lỗi", "Không xóa được!")
          }
        },
      },
    ])
  }

  const search = staff.filter((item) => item.ho_ten?.toLowerCase().includes(searchText.toLowerCase()))

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.avatarContainer}>
        <Image style={styles.avatar} source={require("../img/users.png")} />
        
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.ho_ten}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📧</Text>
          <Text style={styles.cardText}>{item.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📱</Text>
          <Text style={styles.cardText}>{item.so_dien_thoai}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>🎂</Text>
          <Text style={styles.cardText}>{item.ngay_sinh}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>👤</Text>
          <Text style={styles.cardText}>{item.gioi_tinh}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
            <Text style={styles.editBtnText}>✏️ Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.khach_hang_id)}>
            <Text style={styles.deleteBtnText}>🗑️ Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  if (staff.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BB0000" />
        <Text style={styles.loadingText}>Đang tải danh sách khách hàng...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛍️ Quản lý khách hàng</Text>
        <Text style={styles.headerSubtitle}>Danh sách {staff.length} khách hàng</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Tìm kiếm khách hàng..."
            placeholderTextColor="#aaa"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")} style={styles.clearButton}>
              <Text style={styles.clearIcon}>❌</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Customer List */}
      {search.length === 0 && searchText.length > 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>Không tìm thấy khách hàng</Text>
          <Text style={styles.emptySubtext}>Thử tìm kiếm với từ khóa khác</Text>
        </View>
      ) : staff.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>👥</Text>
          <Text style={styles.emptyText}>Chưa có khách hàng nào</Text>
          <Text style={styles.emptySubtext}>Nhấn nút + để thêm khách hàng mới</Text>
        </View>
      ) : (
        <FlatList
          data={search}
          keyExtractor={(item) => item.khach_hang_id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity onPress={() => setAddModalVisible(true)} style={styles.fab} activeOpacity={0.8}>
        <Text style={styles.fabIcon}>➕</Text>
      </TouchableOpacity>

      {/* Add Modal */}
      <Modal visible={addModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>➕ Thêm khách hàng mới</Text>
              <TouchableOpacity onPress={() => setAddModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeIcon}>❌</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>👤 Họ và tên</Text>
                <TextInput style={styles.input} placeholder="Nhập họ tên" value={ho_ten} onChangeText={setHoTen} />
                {errors.ho_ten && <Text style={{color:'red', marginLeft:4}}>{errors.ho_ten}</Text>}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>📧 Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
                {errors.email && <Text style={{color:'red', marginLeft:4}}>{errors.email}</Text>}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>🔒 Mật khẩu</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mật khẩu"
                  value={mat_khau}
                  onChangeText={setMatKhau}
                  secureTextEntry
                />
                {errors.mat_khau && <Text style={{color:'red', marginLeft:4}}>{errors.mat_khau}</Text>}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>📱 Số điện thoại</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập số điện thoại"
                  value={so_dien_thoai}
                  onChangeText={setSoDienThoai}
                  keyboardType="phone-pad"
                />
                {errors.so_dien_thoai && <Text style={{color:'red', marginLeft:4}}>{errors.so_dien_thoai}</Text>}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>🎂 Ngày sinh</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/YYYY"
                  value={ngay_sinh}
                  onChangeText={setNgay_sinh}
                />
                {errors.ngay_sinh && <Text style={{color:'red', marginLeft:4}}>{errors.ngay_sinh}</Text>}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>👤 Giới tính</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nam/Nữ/Khác"
                  value={gioi_tinh}
                  onChangeText={setGioi_tinh}
                />
              </View>
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.primaryButton} onPress={handleAddStaff}>
                  <Text style={styles.primaryButtonText}>✅ Thêm khách hàng</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => setAddModalVisible(false)}>
                  <Text style={styles.secondaryButtonText}>↩️ Quay lại</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>✏️ Cập nhật khách hàng</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeIcon}>❌</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>👤 Họ và tên</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập họ tên"
                  value={editData.ho_ten}
                  onChangeText={(text) => setEditData({ ...editData, ho_ten: text })}
                />
                {editErrors.ho_ten && <Text style={{color:'red', marginLeft:4}}>{editErrors.ho_ten}</Text>}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>📧 Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập email"
                  value={editData.email}
                  onChangeText={(text) => setEditData({ ...editData, email: text })}
                  keyboardType="email-address"
                />
                {editErrors.email && <Text style={{color:'red', marginLeft:4}}>{editErrors.email}</Text>}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>🔒 Mật khẩu</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mật khẩu"
                  value={editData.mat_khau}
                  onChangeText={(text) => setEditData({ ...editData, mat_khau: text })}
                  secureTextEntry
                />
                {editErrors.mat_khau && <Text style={{color:'red', marginLeft:4}}>{editErrors.mat_khau}</Text>}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>📱 Số điện thoại</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập số điện thoại"
                  value={editData.so_dien_thoai}
                  onChangeText={(text) => setEditData({ ...editData, so_dien_thoai: text })}
                  keyboardType="phone-pad"
                />
                {editErrors.so_dien_thoai && <Text style={{color:'red', marginLeft:4}}>{editErrors.so_dien_thoai}</Text>}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>🎂 Ngày sinh</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/YYYY"
                  value={editData.ngay_sinh}
                  onChangeText={(text) => setEditData({ ...editData, ngay_sinh: text })}
                />
                {editErrors.ngay_sinh && <Text style={{color:'red', marginLeft:4}}>{editErrors.ngay_sinh}</Text>}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>👤 Giới tính</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nam/Nữ/Khác"
                  value={editData.gioi_tinh}
                  onChangeText={(text) => setEditData({ ...editData, gioi_tinh: text })}
                />
              </View>
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.primaryButton} onPress={handleUpdateStaff}>
                  <Text style={styles.primaryButtonText}>💾 Cập nhật</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => setEditModalVisible(false)}>
                  <Text style={styles.secondaryButtonText}>↩️ Quay lại</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default QuanLyKhachHang

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
    color: "#BB0000",
    textAlign: "center",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    height: 50,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
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
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 180,
    height: 150,
  
    
  },
  customerBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#BB0000",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 10,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 8,
    width: 20,
  },
  cardText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },
  editBtn: {
    backgroundColor: "#2A9D8F",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  editBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  deleteBtn: {
    backgroundColor: "#E76F51",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  deleteBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#BB0000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 24,
    color: "#FFFFFF",
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
    color: "#BB0000",
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
  modalActions: {
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: "#BB0000",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#BB0000",
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
