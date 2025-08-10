"use client"

import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, Dimensions } from "react-native"
import QRCode from "react-native-qrcode-svg"
import { useNavigation } from "@react-navigation/native"

const { width } = Dimensions.get("window")

const VeCuaBan = ({ route }) => {
  const { thongTinVe, qrData } = route.params
  const navigation = useNavigation()

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "MyTabs" }],
    })
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.headerIcon}>🎫</Text>
        <Text style={styles.headerTitle}>Vé Của Bạn</Text>
        <Text style={styles.headerSubtitle}>Đặt vé thành công!</Text>
      </View>
    </View>
  )

  const renderSuccessIndicator = () => (
    <View style={styles.successContainer}>
      <View style={styles.successIcon}>
        <Text style={styles.successIconText}>✓</Text>
      </View>
      <Text style={styles.successTitle}>Đặt vé thành công!</Text>
      <Text style={styles.successSubtitle}>Vé của bạn đã được xác nhận</Text>
    </View>
  )

  const renderTicketCard = () => (
    <View style={styles.ticketContainer}>
      {/* Ticket Header */}
      <View style={styles.ticketHeader}>
        <View style={styles.ticketHeaderLeft}>
          <Text style={styles.ticketIcon}>🎬</Text>
          <View>
            <Text style={styles.ticketTitle}>MOVIX CINEMA</Text>
            <Text style={styles.ticketSubtitle}>Vé điện tử</Text>
          </View>
        </View>
        <View style={styles.ticketId}>
          <Text style={styles.ticketIdLabel}>Mã vé</Text>
          <Text style={styles.ticketIdValue}>#{thongTinVe.ve_id}</Text>
        </View>
      </View>

      {/* Movie Info */}
      <View style={styles.movieSection}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {thongTinVe.ten_phim}
        </Text>
        <View style={styles.movieDetails}>
          <View style={styles.movieDetailItem}>
            <Text style={styles.movieDetailIcon}>📅</Text>
            <Text style={styles.movieDetailText}>{thongTinVe.ngay_chieu}</Text>
          </View>
          <View style={styles.movieDetailItem}>
            <Text style={styles.movieDetailIcon}>⏰</Text>
            <Text style={styles.movieDetailText}>{thongTinVe.gio_chieu}</Text>
          </View>
        </View>
      </View>

      {/* Venue Info */}
      <View style={styles.venueSection}>
        <View style={styles.venueRow}>
          <Text style={styles.venueIcon}>🏢</Text>
          <View style={styles.venueInfo}>
            <Text style={styles.venueLabel}>Rạp chiếu</Text>
            <Text style={styles.venueValue} numberOfLines={2}>
              {thongTinVe.dia_chi_rap}
            </Text>
          </View>
        </View>
        <View style={styles.venueRow}>
          <Text style={styles.venueIcon}>🚪</Text>
          <View style={styles.venueInfo}>
            <Text style={styles.venueLabel}>Phòng chiếu</Text>
            <Text style={styles.venueValue}>{thongTinVe.ten_phong}</Text>
          </View>
        </View>
        <View style={styles.venueRow}>
          <Text style={styles.venueIcon}>💺</Text>
          <View style={styles.venueInfo}>
            <Text style={styles.venueLabel}>Ghế ngồi</Text>
            <Text style={styles.venueValue}>{thongTinVe.vi_tri_ghe}</Text>
          </View>
        </View>
      </View>

      {/* Perforated Line */}
      <View style={styles.perforatedLine}>
        <View style={styles.leftCircle} />
        <View style={styles.dashedLine} />
        <View style={styles.rightCircle} />
      </View>

      {/* QR Code Section */}
      <View style={styles.qrSection}>
        <Text style={styles.qrTitle}>Mã QR vé của bạn</Text>
        <View style={styles.qrContainer}>
          <View style={styles.qrBackground}>
            <QRCode value={qrData} size={160} backgroundColor="#fff" color="#1f2937" />
          </View>
        </View>
        <Text style={styles.qrNote}>Vui lòng xuất trình mã QR này tại rạp</Text>
      </View>
    </View>
  )

  const renderInstructions = () => (
    <View style={styles.instructionsCard}>
      <Text style={styles.instructionsTitle}>📋 Hướng dẫn sử dụng vé</Text>
      <View style={styles.instructionsList}>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionNumber}>1</Text>
          <Text style={styles.instructionText}>Đến rạp trước giờ chiếu 15-30 phút</Text>
        </View>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionNumber}>2</Text>
          <Text style={styles.instructionText}>Xuất trình mã QR tại quầy vé hoặc cổng vào</Text>
        </View>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionNumber}>3</Text>
          <Text style={styles.instructionText}>Tìm phòng chiếu và ghế ngồi theo thông tin trên vé</Text>
        </View>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionNumber}>4</Text>
          <Text style={styles.instructionText}>Thưởng thức bộ phim và có trải nghiệm tuyệt vời!</Text>
        </View>
      </View>
    </View>
  )

  const renderActionButtons = () => (
    <View style={styles.actionContainer}>
      <TouchableOpacity style={styles.homeButton} onPress={handleBackToHome} activeOpacity={0.8}>
        <Text style={styles.homeButtonIcon}>🏠</Text>
        <Text style={styles.homeButtonText}>Quay về trang chủ</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
      {renderHeader()}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderSuccessIndicator()}
        {renderTicketCard()}
        {renderInstructions()}
        <View style={{ height: 120 }} />
      </ScrollView>

      {renderActionButtons()}
    </View>
  )
}

export default VeCuaBan

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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  successContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  successIconText: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "bold",
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 6,
  },
  successSubtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  ticketContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
    overflow: "hidden",
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#6366f1",
  },
  ticketHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  ticketIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  ticketSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
  ticketId: {
    alignItems: "flex-end",
  },
  ticketIdLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 2,
  },
  ticketIdValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  movieSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
    lineHeight: 26,
  },
  movieDetails: {
    flexDirection: "row",
    gap: 20,
  },
  movieDetailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  movieDetailIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  movieDetailText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  venueSection: {
    padding: 20,
  },
  venueRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  venueIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  venueInfo: {
    flex: 1,
  },
  venueLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  venueValue: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
    lineHeight: 22,
  },
  perforatedLine: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  leftCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#f8fafc",
    marginLeft: -10,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 5,
  },
  rightCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#f8fafc",
    marginRight: -10,
  },
  qrSection: {
    padding: 25,
    alignItems: "center",
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 20,
  },
  qrContainer: {
    marginBottom: 15,
  },
  qrBackground: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  qrNote: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    fontStyle: "italic",
  },
  instructionsCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 15,
  },
  instructionsList: {
    gap: 12,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#6366f1",
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 24,
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  actionContainer: {
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
  homeButton: {
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
  homeButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})
