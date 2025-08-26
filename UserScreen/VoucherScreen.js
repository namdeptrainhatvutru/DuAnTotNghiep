"use client"

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  Alert,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchVoucher, updateVoucher, updateVoucherByMa } from "../redux/actions/VoucherAction"
import { updateUser } from "../redux/actions/UserAction"

const { width } = Dimensions.get("window")

const VoucherScreen = () => {
  const dispatch = useDispatch()
  const listvoucher = useSelector((state) => state.voucher.listvoucher)
  const user = useSelector((state) => state.user.user)
  const [loading, setLoading] = useState(false)
  const [ma_voucher, Setma_voucher] = useState("")

  const chuaSoHuu = listvoucher.filter((item) => !item.khach_hang_id || item.khach_hang_id === "")

  useEffect(() => {
    setLoading(true)
    dispatch(fetchVoucher()).then(() => {
      setLoading(false)
    })
  }, [dispatch])

  const handleExchange = async (item) => {
    if (item.khach_hang_id === user.khach_hang_id) {
      Alert.alert("Thông báo", "Bạn đã sở hữu voucher này!")
      return
    }
    if (user.diem < 10) {
      Alert.alert("Không đủ điểm", "Bạn cần ít nhất 10 điểm để đổi voucher này!")
      return
    }

    Alert.alert("Xác nhận đổi voucher", `Bạn có muốn đổi 10 điểm lấy voucher giảm ${item.giam_gia}%?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đồng ý",
        onPress: async () => {
          await dispatch(updateVoucher({ ...item, khach_hang_id: user.khach_hang_id }))
          await dispatch(updateUser({ ...user, diem: user.diem - 10 }))
          Alert.alert("Thành công", `Chúc mừng bạn nhận được mã giảm giá ${item.giam_gia}%!`)
        },
      },
    ])
  }

  const nhapmavoucher = () => {
    if (!ma_voucher.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập mã voucher!")
      return
    }

    const voucher = listvoucher.find((v) => v.ma_voucher === ma_voucher && !v.khach_hang_id)

    if (voucher) {
      dispatch(
        updateVoucherByMa({
          ma_voucher: ma_voucher,
          khach_hang_id: user.khach_hang_id,
        }),
      )
      Alert.alert("Thành công", "Đổi voucher thành công!")
      Setma_voucher("")
    } else {
      Alert.alert("Lỗi", "Mã voucher không hợp lệ hoặc đã được sử dụng!")
      Setma_voucher("")
    }
  }

  const isVoucherValid = (voucher) => {
    if (!voucher.thoi_gian_het_han) return true
    const [day, month, year] = voucher.thoi_gian_het_han.split("/").map(Number)
    const expireDate = new Date(year, month - 1, day, 23, 59, 59)
    return expireDate >= new Date()
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.headerIcon}>🎁</Text>
        <Text style={styles.headerTitle}>Voucher Miễn Phí</Text>
        <Text style={styles.headerSubtitle}>Đổi điểm lấy ưu đãi</Text>
      </View>
    </View>
  )

  const renderPointsCard = () => (
    <View style={styles.pointsCard}>
      <View style={styles.pointsHeader}>
        <Text style={styles.pointsIcon}>💎</Text>
        <View style={styles.pointsInfo}>
          <Text style={styles.pointsLabel}>Điểm tích lũy của bạn</Text>
          <Text style={styles.pointsValue}>{user.diem} điểm</Text>
        </View>
      </View>
      <View style={styles.pointsNote}>
        <Text style={styles.pointsNoteText}>💡 Mỗi voucher cần 10 điểm để đổi</Text>
      </View>
    </View>
  )

  const renderVoucherInput = () => (
    <View style={styles.inputCard}>
      <Text style={styles.inputTitle}>🔤 Nhập Mã Voucher</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nhập mã voucher của bạn..."
          onChangeText={Setma_voucher}
          value={ma_voucher}
          style={styles.textInput}
          placeholderTextColor="#9ca3af"
          autoCapitalize="characters"
        />
        <TouchableOpacity
          style={[styles.confirmBtn, !ma_voucher.trim() && styles.confirmBtnDisabled]}
          onPress={nhapmavoucher}
          disabled={!ma_voucher.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmBtnText}>✓</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderVoucherItem = ({ item, index }) => {
    const isExpired = !isVoucherValid(item)
    const canExchange = user.diem >= 10

    return (
      <View style={[styles.voucherCard, isExpired && styles.expiredVoucherCard]}>
        <View style={styles.voucherHeader}>
          <Image style={styles.voucherImage} source={require("../img/vouchermovi.png")} />
          {isExpired && (
            <View style={styles.expiredBadge}>
              <Text style={styles.expiredBadgeText}>Hết hạn</Text>
            </View>
          )}
        </View>

        <View style={styles.voucherContent}>
          <Text style={styles.voucherTitle} numberOfLines={2}>
            {item.ten_voucher || "Voucher giảm giá"}
          </Text>

          

          <View style={styles.expiryContainer}>
            <Text style={styles.expiryIcon}>📅</Text>
            <Text style={styles.expiryText}>HSD: {item.thoi_gian_het_han || "Không giới hạn"}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.exchangeBtn,
            (!canExchange || isExpired) && styles.exchangeBtnDisabled,
            isExpired && styles.expiredExchangeBtn,
          ]}
          onPress={() => handleExchange(item)}
          disabled={!canExchange || isExpired}
          activeOpacity={0.8}
        >
          <Text style={[styles.exchangeBtnText, (!canExchange || isExpired) && styles.exchangeBtnTextDisabled]}>
            {isExpired ? "Hết hạn" : "Đổi voucher"}
          </Text>
          {!isExpired && (
            <View style={styles.pointBadge}>
              <Text style={styles.pointBadgeText}>10</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    )
  }

  const renderVoucherList = () => {
    const availableVouchers = listvoucher
      .filter((item) => item.khach_hang_id !== user.khach_hang_id)
      .filter(isVoucherValid)

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Đang tải voucher...</Text>
        </View>
      )
    }

    if (availableVouchers.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎫</Text>
          <Text style={styles.emptyTitle}>Không có voucher nào</Text>
          <Text style={styles.emptySubtitle}>Hiện tại chưa có voucher nào còn hạn sử dụng</Text>
        </View>
      )
    }

    return (
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>🎟️ Voucher Có Sẵn ({availableVouchers.length})</Text>
        <FlatList
          data={availableVouchers}
          keyExtractor={(item) => item.voucher_id?.toString() || item.id?.toString() || Math.random().toString()}
          renderItem={renderVoucherItem}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
      {renderHeader()}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderPointsCard()}
        {renderVoucherInput()}
        {renderVoucherList()}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  )
}

export default VoucherScreen

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
  headerContent: {
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
  pointsCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    margin: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  pointsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  pointsIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  pointsInfo: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6366f1",
  },
  pointsNote: {
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#6366f1",
  },
  pointsNoteText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  inputCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "#f9fafb",
    color: "#374151",
  },
  confirmBtn: {
    backgroundColor: "#6366f1",
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmBtnDisabled: {
    backgroundColor: "#d1d5db",
    shadowOpacity: 0.1,
  },
  confirmBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6b7280",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
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
  listContainer: {
    paddingHorizontal: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 15,
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  voucherCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    width: (width - 52) / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    position: "relative",
  },
  expiredVoucherCard: {
    backgroundColor: "#f9fafb",
    opacity: 0.7,
  },
  voucherHeader: {
    alignItems: "center",
    marginBottom: 12,
    position: "relative",
  },
  voucherImage: {
    width: 80,
    height: 60,
    borderRadius: 12,
    resizeMode: "cover",
  },
  expiredBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#ef4444",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  expiredBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  voucherContent: {
    marginBottom: 16,
  },
  voucherTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 20,
  },
  discountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  discountIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  discountText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6366f1",
  },
  expiryContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  expiryIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  expiryText: {
    fontSize: 12,
    color: "#6b7280",
  },
  exchangeBtn: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  exchangeBtnDisabled: {
    backgroundColor: "#d1d5db",
    shadowOpacity: 0.1,
  },
  expiredExchangeBtn: {
    backgroundColor: "#ef4444",
  },
  exchangeBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    marginRight: 6,
  },
  exchangeBtnTextDisabled: {
    color: "#9ca3af",
  },
  pointBadge: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  pointBadgeText: {
    color: "#6366f1",
    fontWeight: "bold",
    fontSize: 10,
  },
})
