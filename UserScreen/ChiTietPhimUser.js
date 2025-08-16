"use client"

import { useEffect, useState, useMemo } from "react"
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native"
import WebView from "react-native-webview"
import { useDispatch, useSelector } from "react-redux"
import { useNavigation } from "@react-navigation/native"
import { fetchSuatChieuByPhimId } from "../redux/actions/SuatChieuAction"

const { width, height } = Dimensions.get("window")

const ChiTietPhimUser = ({ route }) => {
  const { phim, cinema_id } = route.params
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const listSuatChieu = useSelector((state) => state.suatchieu.listsuatchieu)
  const listPhongChieu = useSelector((state) => state.phongchieu.listphongchieu)
  const listGhe = useSelector((state) => state.ghe.listghe)
  const [selected, setSelected] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    dispatch(fetchSuatChieuByPhimId(phim.phim_id)).finally(() => setIsLoading(false))
  }, [])

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return ""
    const videoId = url.split("v=")[1]
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`
  }

  const isSuatChieuOver = (item) => {
    if (!item.ngay_chieu) return false
    const [day, month, year] = item.ngay_chieu.split("/")
    const now = new Date()
    const ngayChieu = new Date(`${year}-${month}-${day}`)

    if (now.toDateString() !== ngayChieu.toDateString()) {
      return now > ngayChieu
    }

    const nowHour = now.getHours()
    const gioKetThuc = Number.parseInt(item.thoi_gian_ket_thuc, 10)
    return nowHour >= gioKetThuc
  }

  const isFullGhe = (suatChieuId, listghe) => {
    const gheOfSuat = listghe.filter((ghe) => ghe.suat_chieu_id === suatChieuId)
    if (gheOfSuat.length === 0) return false
    return gheOfSuat.every((ghe) => ghe.trang_thai !== "trống")
  }

  const suatChieuRender = useMemo(() => {
    if (!Array.isArray(listSuatChieu)) return []
    if (cinema_id) {
      return listSuatChieu.filter(
        (suat) =>
          suat.phim_id === phim.phim_id &&
          listPhongChieu.find((phong) => phong.room_id === suat.room_id && phong.cinema_id === cinema_id),
      )
    }
    return listSuatChieu.filter((suat) => suat.phim_id === phim.phim_id)
  }, [listSuatChieu, listPhongChieu, cinema_id, phim.phim_id, listGhe])

  const handleDatVe = () => {
    if (!selected) {
      alert("Vui lòng chọn suất chiếu!")
      return
    }
    navigation.navigate("ThongTinVe", {
      suatChieu: selected,
      phim,
    })
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Chi Tiết Phim</Text>
      <View style={styles.headerSpacer} />
    </View>
  )

  const renderTrailer = () => (
    <View style={styles.trailerContainer}>
      <WebView
        source={{ uri: getYouTubeEmbedUrl(phim.trailer_url) }}
        style={styles.webview}
        allowsFullscreenVideo
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        mediaPlaybackRequiresUserAction={false}
      />
      <View style={styles.trailerOverlay} />
    </View>
  )

  const renderMovieInfo = () => (
    <View style={styles.movieInfoContainer}>
      <View style={styles.posterSection}>
        <Image source={{ uri: phim.poster_url }} style={styles.poster} />
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{phim.do_tuoi}+</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {phim.ten_phim}
        </Text>

        <View style={styles.movieMeta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>⏱️</Text>
            <Text style={styles.metaText}>{phim.thoi_luong} phút</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>🎭</Text>
            <Text style={styles.metaText}>{phim.the_loai}</Text>
          </View>
        </View>

        <View style={styles.directorInfo}>
          <Text style={styles.directorIcon}>🎬</Text>
          <Text style={styles.directorText}>Đạo diễn: {phim.dao_dien}</Text>
        </View>
      </View>
    </View>
  )

  const renderShowtimes = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🎫 Chọn Suất Chiếu</Text>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#6366f1" />
          <Text style={styles.loadingText}>Đang tải suất chiếu...</Text>
        </View>
      ) : suatChieuRender.length === 0 ? (
        <View style={styles.emptyShowtimes}>
          <Text style={styles.emptyIcon}>🎭</Text>
          <Text style={styles.emptyText}>Không có suất chiếu</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.showtimeScroll}>
          {suatChieuRender.map((item, index) => {
            if (isSuatChieuOver(item)) return null
            const full = isFullGhe(item.suat_chieu_id, listGhe)
            const isSelected = selected === item

            return (
              <TouchableOpacity
                key={index}
                onPress={() => !full && setSelected(item)}
                disabled={full}
                style={[styles.showtimeCard, isSelected && styles.selectedShowtime, full && styles.fullShowtime]}
                activeOpacity={0.8}
              >
                <View style={styles.showtimeTime}>
                  <Text style={[styles.timeText, isSelected && styles.selectedTimeText]}>
                    {item.thoi_gian_bat_dau}h - {item.thoi_gian_ket_thuc}h
                  </Text>
                </View>
                <Text style={[styles.showtimeDate, isSelected && styles.selectedDateText]}>{item.ngay_chieu}</Text>
                {full && (
                  <View style={styles.fullBadge}>
                    <Text style={styles.fullBadgeText}>Hết ghế</Text>
                  </View>
                )}
                {isSelected && (
                  <View style={styles.selectedIndicator}>
                    <Text style={styles.selectedIcon}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      )}
    </View>
  )

  const renderMovieDetails = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📋 Thông Tin Chi Tiết</Text>
      <View style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>🎬</Text>
          <Text style={styles.detailLabel}>Đạo diễn</Text>
          <Text style={styles.detailValue}>{phim.dao_dien}</Text>
        </View>
        <View style={styles.detailDivider} />
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>🌍</Text>
          <Text style={styles.detailLabel}>Ngôn ngữ</Text>
          <Text style={styles.detailValue}>{phim.ngon_ngu}</Text>
        </View>
        <View style={styles.detailDivider} />
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>🎭</Text>
          <Text style={styles.detailLabel}>Thể loại</Text>
          <Text style={styles.detailValue}>{phim.the_loai}</Text>
        </View>
        <View style={styles.detailDivider} />
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>🔞</Text>
          <Text style={styles.detailLabel}>Độ tuổi</Text>
          <Text style={styles.detailValue}>{phim.do_tuoi}+</Text>
        </View>
      </View>
    </View>
  )

  const renderDescription = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📝 Mô Tả</Text>
      <View style={styles.descriptionCard}>
        <Text style={styles.descriptionText}>{phim.mo_ta}</Text>
      </View>
    </View>
  )

  const renderBookingButton = () => (
    <View style={styles.bookingContainer}>
      <View style={styles.bookingInfo}>
        {selected && (
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedInfoText}>
              Suất chiếu: {selected.thoi_gian_bat_dau}h - {selected.thoi_gian_ket_thuc}h
            </Text>
            <Text style={styles.selectedInfoDate}>{selected.ngay_chieu}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={[styles.bookingBtn, !selected && styles.bookingBtnDisabled]}
        onPress={handleDatVe}
        disabled={!selected}
        activeOpacity={0.8}
      >
        <Text style={styles.bookingBtnIcon}>🎫</Text>
        <Text style={styles.bookingBtnText}>Đặt Vé</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
      {renderHeader()}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderTrailer()}
        {renderMovieInfo()}
        {renderShowtimes()}
        {renderMovieDetails()}
        {renderDescription()}
        <View style={{ height: 120 }} />
      </ScrollView>

      {renderBookingButton()}
    </View>
  )
}

export default ChiTietPhimUser

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#6366f1",
    paddingTop: 50,
    paddingBottom: 15,
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
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  trailerContainer: {
    height: 220,
    backgroundColor: "#000",
    position: "relative",
  },
  webview: {
    flex: 1,
  },
  trailerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.1)",
    zIndex: 1,
  },
  movieInfoContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: "#fff",
    marginTop: -20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  posterSection: {
    position: "relative",
    marginTop: -60,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  ratingBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#ef4444",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  ratingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  infoSection: {
    flex: 1,
    marginLeft: 20,
    marginTop: 20,
  },
  movieTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
    lineHeight: 28,
  },
  movieMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  metaText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  metaDivider: {
    width: 1,
    height: 16,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 12,
  },
  directorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  directorIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  directorText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 15,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#6b7280",
  },
  emptyShowtimes: {
    alignItems: "center",
    paddingVertical: 30,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    fontStyle: "italic",
  },
  showtimeScroll: {
    paddingVertical: 5,
  },
  showtimeCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    minWidth: 120,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: "relative",
  },
  selectedShowtime: {
    backgroundColor: "#eff6ff",
    borderColor: "#6366f1",
    shadowColor: "#6366f1",
    shadowOpacity: 0.3,
  },
  fullShowtime: {
    backgroundColor: "#f3f4f6",
    borderColor: "#d1d5db",
    opacity: 0.6,
  },
  showtimeTime: {
    marginBottom: 8,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
  },
  selectedTimeText: {
    color: "#6366f1",
  },
  showtimeDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  selectedDateText: {
    color: "#6366f1",
    fontWeight: "600",
  },
  fullBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  fullBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  selectedIndicator: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#10b981",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedIcon: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
    width: 80,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  detailDivider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginVertical: 4,
  },
  descriptionCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  descriptionText: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 24,
  },
  bookingContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bookingInfo: {
    marginBottom: 10,
  },
  selectedInfo: {
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#6366f1",
  },
  selectedInfoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  selectedInfoDate: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  bookingBtn: {
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
  bookingBtnDisabled: {
    backgroundColor: "#d1d5db",
    shadowOpacity: 0.1,
  },
  bookingBtnIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  bookingBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
})
