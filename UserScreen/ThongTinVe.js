"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllPhongChieu } from "../redux/actions/PhongChieuAction"
import { fetchRapChieu } from "../redux/actions/RapChieuAction"
import { fetchGheByRoomId, updateNhieuGhe } from "../redux/actions/GheAction"
import { useNavigation } from "@react-navigation/native"
import { addVe } from "../redux/actions/VeAction"
import { tangDiemUser } from "../redux/actions/UserAction"
import Svg, { Path } from "react-native-svg"
import { deleteVoucher, fetchVoucher } from "../redux/actions/VoucherAction"
import { addThanhToan } from "../redux/actions/ThanhToanAction"
import Modal from "react-native-modal"
import QRCode from "react-native-qrcode-svg"
import { generateMomoPayment, checkMomoTransactionStatus } from "../utils/momoHelper"

const { width } = Dimensions.get("window")

const ThongTinVe = ({ route }) => {
  const { suatChieu, phim } = route.params
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const user_id = useSelector((state) => state.user.user.khach_hang_id)
  const listvoucher = useSelector((state) => state.voucher.listvoucher)
  const listRapChieu = useSelector((state) => state.rapchieu.listrapchieu)
  const listPhongChieu = useSelector((state) => state.phongchieu.listphongchieu)
  const listghe = useSelector((state) => state.ghe.listghe)
  const user = useSelector((state) => state.user.user)

  const [loading, setLoading] = useState(true)
  const [gheSelected, setGheSelected] = useState([])
  const [payment, setPayment] = useState("")
  const [voucherSelected, setVoucherSelected] = useState(null)
  const [showVietQR, setShowVietQR] = useState(false)
  const [foodList, setFoodList] = useState([])
  const [foodSelected, setFoodSelected] = useState([])
  const [momoOrderId, setMomoOrderId] = useState(null)
  const [momoRequestId, setMomoRequestId] = useState(null)
  const [momoQRData, setMomoQRData] = useState(null)
  const [momoLoading, setMomoLoading] = useState(false)
  const [momoPaymentStatus, setMomoPaymentStatus] = useState(null)
  const [momoPaymentProcessed, setMomoPaymentProcessed] = useState(false)

  // ...existing code...
  const listvoucherbyid = listvoucher.filter((item) => item.khach_hang_id === user_id?.toString())
  const giamGia = voucherSelected?.giam_gia || 0
  const foodTotal = foodSelected.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0)

  // Bảng giá theo loại ghế
  const seatPriceMap = {
    thuong: 80000,
    vip: 120000,
    couple: 150000,
  }

  // DEBUG: in mẫu listghe để kiểm tra cấu trúc (xóa khi đã ổn)
  console.log('DEBUG listghe sample (first 10):', listghe.slice(0, 10))

  // normalize helper
  const norm = v => (v === undefined || v === null ? '' : String(v).trim().toUpperCase())

  const seatTotal = gheSelected.reduce((sum, vi_tri) => {
  const viTriNorm = norm(vi_tri);
  
  let gheObj = listghe.find(
    g => norm(g.vi_tri) === viTriNorm && norm(g.suat_chieu_id) === norm(suatChieu?.suat_chieu_id)
  );
  if (!gheObj) {
    gheObj = listghe.find(g => norm(g.vi_tri) === viTriNorm);
  }

  const loai = gheObj?.loai_ghe ?? 'thuong';
  const price = seatPriceMap[loai.toLowerCase()] ?? seatPriceMap.thuong;

  console.log('DEBUG matchSeat', { vi_tri, viTriNorm, found: !!gheObj, loai, price });
  
  return sum + price;
}, 0);

  const so_tien = seatTotal - (seatTotal / 100) * giamGia + foodTotal
  console.log('DEBUG seatTotal, giamGia, foodTotal, so_tien', seatTotal, giamGia, foodTotal, so_tien)
// ...existing code...

  const now = new Date()
  const ngay_mua =
    String(now.getDate()).padStart(2, "0") + "/" + String(now.getMonth() + 1).padStart(2, "0") + "/" + now.getFullYear()

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchAllPhongChieu())
      await dispatch(fetchRapChieu())
      await dispatch(fetchGheByRoomId(suatChieu.suat_chieu_id))
      setLoading(false)
    }
    fetchData()

    if (user_id) {
      dispatch(fetchVoucher())
    }

    fetch("https://688253a466a7eb81224e3f86.mockapi.io/doan/food")
      .then((res) => res.json())
      .then((data) => setFoodList(data))
  }, [])

  useEffect(() => {
    if (showVietQR && payment === "Momo" && momoOrderId && momoRequestId) {
      const intervalId = startMomoPaymentPolling()
      
      // Cleanup function to stop polling when component unmounts or dependencies change
      return () => {
        if (intervalId) {
          clearInterval(intervalId)
          console.log('Momo polling cleaned up')
        }
      }
    }
  }, [showVietQR, payment, momoOrderId, momoRequestId])

  const handleSelectGhe = (vi_tri) => {
  // Nếu ghế đã chọn, bỏ chọn
  if (gheSelected.includes(vi_tri)) {
    setGheSelected((prev) => prev.filter((g) => g !== vi_tri));
    return;
  }

  // Kiểm tra số ghế tối đa
  if (gheSelected.length >= 8) {
    ToastAndroid.show("Bạn chỉ có thể chọn tối đa 8 ghế!", ToastAndroid.SHORT);
    return;
  }

  // Kiểm tra ghế xen kẽ
  const allSeatsInRow = sortedGhe
    .filter(g => g.room_id === sortedGhe.find(s => s.vi_tri === vi_tri)?.room_id)
    .map(g => g.vi_tri);

  const selectedPlusNew = [...gheSelected, vi_tri].sort((a, b) => {
    // Sắp xếp số ghế theo số sau chữ G
    return parseInt(a.replace("G", ""), 10) - parseInt(b.replace("G", ""), 10);
  });

  for (let i = 0; i < selectedPlusNew.length - 1; i++) {
    const curr = parseInt(selectedPlusNew[i].replace("G", ""), 10);
    const next = parseInt(selectedPlusNew[i + 1].replace("G", ""), 10);
    if (next - curr > 1) {
      ToastAndroid.show("Không được để ghế trống xen kẽ!", ToastAndroid.SHORT);
      return;
    }
  }

  // Nếu hợp lệ, thêm ghế
  setGheSelected((prev) => [...prev, vi_tri]);
};


  const handleSelectFood = (food) => {
    setFoodSelected((prev) => {
      const found = prev.find((f) => f.id === food.id);
      if (found) {
        // Nếu đã chọn, tăng số lượng
        return prev.map((f) =>
          f.id === food.id ? { ...f, quantity: (f.quantity || 1) + 1 } : f
        );
      }
      // Nếu chưa chọn, thêm với quantity = 1
      return [...prev, { ...food, quantity: 1 }];
    });
  };

  const handleDecreaseFood = (food) => {
    setFoodSelected((prev) => {
      const found = prev.find((f) => f.id === food.id);
      if (!found) return prev;
      if ((found.quantity || 1) <= 1) {
        // Nếu quantity = 1, xóa khỏi danh sách
        return prev.filter((f) => f.id !== food.id);
      }
      // Giảm quantity
      return prev.map((f) =>
        f.id === food.id ? { ...f, quantity: (f.quantity || 1) - 1 } : f
      );
    });
  };

  const checkMomoPaymentStatus = async () => {
    if (!momoOrderId || !momoRequestId || momoPaymentProcessed) return

    try {
      console.log('Checking Momo payment status...')
      const status = await checkMomoTransactionStatus(momoOrderId, momoRequestId)
      console.log('Momo status:', status)
      
      if (status.success) {
        // Mark as processed to prevent duplicate calls
        setMomoPaymentProcessed(true)
        
        ToastAndroid.show("Thanh toán Momo thành công!", ToastAndroid.SHORT)
        setShowVietQR(false)
        // Stop polling immediately
        setMomoOrderId(null)
        setMomoRequestId(null)
        setMomoQRData(null)
        // Process payment
        await handleDatVeAndThanhToan()
      } else {
        // resultCode 1000 means "waiting for user confirmation"
        if (status.resultCode === 1000) {
          console.log('Waiting for user to confirm payment...')
        } else {
          console.log('Payment status:', status.message)
        }
      }
    } catch (error) {
      console.error('Status check error:', error)
    }
  }

  const startMomoPaymentPolling = () => {
    // Poll every 3 seconds to check payment status
    const interval = setInterval(async () => {
      if (momoOrderId && momoRequestId) {
        await checkMomoPaymentStatus()
      } else {
        // Stop polling if orderId or requestId is null
        clearInterval(interval)
        console.log('Momo polling stopped')
      }
    }, 3000)

    // Stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(interval)
      console.log('Momo polling timeout after 5 minutes')
    }, 300000)

    // Return interval ID for manual cleanup if needed
    return interval
  }

  const phongchieu = listPhongChieu.find((phong) => phong.room_id == suatChieu.room_id)
  const rapchieu = phongchieu ? listRapChieu.find((rap) => rap.cinema_id == phongchieu.cinema_id) : null

  if (loading || !phongchieu || !rapchieu) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Đang tải thông tin vé...</Text>
      </View>
    )
  }

  const sortedGhe = []
  const seen = new Set()
  ;[...listghe]
    .filter((ghe) => String(ghe.suat_chieu_id) === String(suatChieu.suat_chieu_id))
    .sort((a, b) => {
      const numA = Number.parseInt(a.vi_tri.replace("G", ""), 10)
      const numB = Number.parseInt(b.vi_tri.replace("G", ""), 10)
      return numA - numB
    })
    .forEach((ghe) => {
      const key = ghe.room_id + "-" + ghe.vi_tri
      if (!seen.has(key)) {
        sortedGhe.push(ghe)
        seen.add(key)
      }
    })

  const thongTinVe = {
    khach_hang_id: user.khach_hang_id,
    ten_phim: phim.ten_phim,
    ngay_chieu: suatChieu.ngay_chieu,
    gio_chieu: `${suatChieu.thoi_gian_bat_dau}h - ${suatChieu.thoi_gian_ket_thuc}h`,
    ten_phong: phongchieu?.ten_phong,
    dia_chi_rap: rapchieu?.dia_chi,
    vi_tri_ghe: gheSelected.join(","),
    trang_thai: "chưa sử dụng",
  }

  thongTinVe.ma_qr = JSON.stringify(thongTinVe)

  const vietQRInfo = {
    accountName: "VU HOANG NAM",
    accountNumber: "9961062156",
    bankCode: "VCB",
    so_tien: so_tien,
    noiDung: `MOVIX_${user.khach_hang_id}_${Date.now()}`,
  }

  const vietQRUrl = `https://img.vietqr.io/image/${vietQRInfo.bankCode}-${vietQRInfo.accountNumber}-compact2.png?amount=${vietQRInfo.so_tien}&addInfo=${encodeURIComponent(vietQRInfo.noiDung)}&accountName=${encodeURIComponent(vietQRInfo.accountName)}`

  const momoInfo = {
    accountName: "VU HOANG NAM",
    accountNumber: "0961234567", // Số điện thoại Momo
    so_tien: so_tien,
    noiDung: `MOVIX_${user.khach_hang_id}_${Date.now()}`,
  }

  // Tạo nội dung QR cho Momo (thường là số điện thoại + số tiền + nội dung)
  const momoQRContent = `MOMO|${momoInfo.accountNumber}|${momoInfo.so_tien}|${momoInfo.noiDung}`

  // Tạo link ảnh QR cho Momo
  const momoQRUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(momoQRContent)}`

  const handleDatVeAndThanhToan = async () => {
    const veRes = await dispatch(addVe(thongTinVe))
    const ve_id = veRes.payload?.ve_id || veRes.payload?.id

    const thanhToanData = {
      khach_hang_id: user.khach_hang_id,
      phuong_thuc: payment,
      so_tien: so_tien,
      ngay_mua: ngay_mua,
      ve_id: ve_id,
    }

    await dispatch(addThanhToan(thanhToanData))

    dispatch(
      updateNhieuGhe({
        listghe,
        gheSelected,
        suat_chieu_id: suatChieu.suat_chieu_id,
      }),
    )

    await dispatch(tangDiemUser({ user: user, soluong: gheSelected.length }))
    ToastAndroid.show(`Tích điểm: ${gheSelected.length * 10} điểm`, ToastAndroid.SHORT)
    dispatch(deleteVoucher(voucherSelected?.voucher_id))

    const thongTinVeWithId = { ...thongTinVe, ve_id,foodSelected,so_tien: so_tien }
    
    const qrData = JSON.stringify(thongTinVeWithId)

    navigation.navigate("VeCuaBan", {
      thongTinVe: thongTinVeWithId,
      qrData: qrData,
    })

    for (const food of foodSelected) {
      await fetch(`https://688253a466a7eb81224e3f86.mockapi.io/doan/food/${food.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          khach_hang_id: [
            ...(Array.isArray(food.khach_hang_id) ? food.khach_hang_id : []),
            {
              id: user.khach_hang_id,
              ngay_dat: ngay_mua,
              gio_chieu: suatChieu.thoi_gian_bat_dau,
              so_luong: food.quantity || 1,
              ve_id: ve_id, // Thêm trường ve_id để staff lọc đúng vé
            },
          ],
        }),
      });
    }
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Thông Tin Vé</Text>
      <View style={styles.headerSpacer} />
    </View>
  )

  const renderTicketInfo = () => (
    <View style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketIcon}>🎫</Text>
        <Text style={styles.ticketTitle}>Thông Tin Vé</Text>
      </View>

      <View style={styles.ticketContent}>
        <View style={styles.ticketRow}>
          <Text style={styles.ticketLabel}>🎬 Tên phim:</Text>
          <Text style={styles.ticketValue} numberOfLines={2}>
            {thongTinVe.ten_phim}
          </Text>
        </View>
        <View style={styles.ticketRow}>
          <Text style={styles.ticketLabel}>📅 Ngày chiếu:</Text>
          <Text style={styles.ticketValue}>{thongTinVe.ngay_chieu}</Text>
        </View>
        <View style={styles.ticketRow}>
          <Text style={styles.ticketLabel}>⏰ Suất chiếu:</Text>
          <Text style={styles.ticketValue}>{thongTinVe.gio_chieu}</Text>
        </View>
        <View style={styles.ticketRow}>
          <Text style={styles.ticketLabel}>🏠 Phòng chiếu:</Text>
          <Text style={styles.ticketValue}>{thongTinVe.ten_phong}</Text>
        </View>
        <View style={styles.ticketRow}>
          <Text style={styles.ticketLabel}>📍 Rạp:</Text>
          <Text style={styles.ticketValue} numberOfLines={2}>
            {thongTinVe.dia_chi_rap}
          </Text>
        </View>
        {gheSelected.length > 0 && (
          <View style={styles.ticketRow}>
            <Text style={styles.ticketLabel}>💺 Ghế đã chọn:</Text>
            <Text style={styles.ticketValue}>{thongTinVe.vi_tri_ghe}</Text>
          </View>
        )}
      </View>
    </View>
  )

  const renderSeatSelection = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>💺 Chọn Ghế</Text>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.selectedLegend]} />
          <Text style={styles.legendText}>Đang chọn</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.availableLegend]} />
          <Text style={styles.legendText}>Trống</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.bookedLegend]} />
          <Text style={styles.legendText}>Đã đặt</Text>
        </View>
      </View>

      {/* Cinema Screen */}
      <View style={styles.cinemaContainer}>
        <Text style={styles.screenText}>Màn hình chiếu</Text>
        <Svg height="60" width="100%" viewBox="0 0 300 60">
          <Path
            d="M10 50 Q 150 0 290 50"
            stroke="#A6A7E0"
            strokeWidth="20"
            strokeOpacity="0.2"
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M10 50 Q 150 0 290 50"
            stroke="#8889D6"
            strokeWidth="14"
            strokeOpacity="0.4"
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M10 50 Q 150 0 290 50"
            stroke="#6E70CC"
            strokeWidth="10"
            strokeOpacity="0.6"
            fill="none"
            strokeLinecap="round"
          />
          <Path d="M10 50 Q 150 0 290 50" stroke="#696ACD" strokeWidth="6" fill="none" strokeLinecap="round" />
        </Svg>

        {/* Seats Grid */}
        <View style={styles.seatsContainer}>
          {[...Array(Math.ceil(sortedGhe.length / 5))].map((_, rowIndex) => (
            <View key={rowIndex} style={styles.seatRow}>
              {sortedGhe.slice(rowIndex * 5, (rowIndex + 1) * 5).map((gheItem) => {
                const isSelected = gheSelected.includes(gheItem.vi_tri)
                const isBooked = gheItem.trang_thai !== "trống"

                return (
                  <TouchableOpacity
                    key={gheItem.room_id + "-" + gheItem.vi_tri}
                    onPress={() => !isBooked && handleSelectGhe(gheItem.vi_tri)}
                    disabled={isBooked}
                    activeOpacity={isBooked ? 1 : 0.7}
                    style={styles.seatButton}
                  >
                    <View
                      style={[
                        styles.seat,
                        isBooked ? styles.bookedSeat : isSelected ? styles.selectedSeat : styles.availableSeat,
                      ]}
                    >
                      <Text style={[styles.seatText, isSelected && styles.selectedSeatText]}>{gheItem.vi_tri}</Text>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          ))}
        </View>
      </View>
    </View>
  )

  const renderFoodSelection = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>🍿 Chọn Đồ Ăn</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.foodScroll}>
        {foodList
          .filter((food) => food.status === true)
          .map((food) => {
            const selected = foodSelected.find((f) => f.id === food.id);
            return (
              <View key={food.id} style={[styles.foodItem, selected && styles.selectedFoodItem]}>
                <Image source={{ uri: food.image }} style={styles.foodImage} />
                <Text style={styles.foodName} numberOfLines={2}>{food.name}</Text>
                <Text style={styles.foodPrice}>{food.price}đ</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                  <TouchableOpacity
                    onPress={() => handleDecreaseFood(food)}
                    style={{ padding: 4, backgroundColor: '#eee', borderRadius: 8, marginRight: 4 }}
                    disabled={!selected}
                  >
                    <Text style={{ fontSize: 16, color: selected ? '#ef4444' : '#ccc' }}>−</Text>
                  </TouchableOpacity>
                  <Text style={{ minWidth: 20, textAlign: 'center', fontWeight: 'bold', color: '#374151' }}>
                    {selected ? selected.quantity : 0}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleSelectFood(food)}
                    style={{ padding: 4, backgroundColor: '#eee', borderRadius: 8, marginLeft: 4 }}
                  >
                    <Text style={{ fontSize: 16, color: '#10b981' }}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
      </ScrollView>
    </View>
  )

  const renderVoucherSelection = () => {
    if (!Array.isArray(listvoucherbyid) || listvoucherbyid.length === 0) return null

    return (
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🎟️ Voucher Giảm Giá</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.voucherScroll}>
          {listvoucherbyid.map((voucher, index) => {
            const isSelected = voucherSelected?.voucher_id?.toString() === voucher?.voucher_id?.toString()
            return (
              <TouchableOpacity
                onPress={() => setVoucherSelected(voucher)}
                key={index}
                style={[styles.voucherItem, isSelected && styles.selectedVoucherItem]}
                activeOpacity={0.8}
              >
                <Text style={styles.voucherIcon}>🎟️</Text>
                <Text style={styles.voucherDiscount}>{voucher.giam_gia}%</Text>
                <Text style={styles.voucherText}>Giảm giá</Text>
                {isSelected && (
                  <View style={styles.selectedVoucherBadge}>
                    <Text style={styles.selectedVoucherIcon}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    )
  }

  const renderPriceBreakdown = () => (
    <View style={styles.priceCard}>
      <Text style={styles.priceTitle}>💰 Chi Tiết Thanh Toán</Text>
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Giá vé ({gheSelected.length} ghế):</Text>
        <Text style={styles.priceValue}>{seatTotal.toLocaleString()}đ</Text>
      </View>
      {giamGia > 0 && (
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Giảm giá ({giamGia}%):</Text>
          <Text style={[styles.priceValue, styles.discountValue]}>
            -{((seatTotal / 100) * giamGia).toLocaleString()}đ
          </Text>
        </View>
      )}
      {foodTotal > 0 && (
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Đồ ăn:</Text>
          <Text style={styles.priceValue}>+{foodTotal.toLocaleString()}đ</Text>
        </View>
      )}
      <View style={styles.priceDivider} />
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Tổng cộng:</Text>
        <Text style={styles.totalValue}>{so_tien.toLocaleString()}đ</Text>
      </View>
    </View>
  )

  const renderPaymentMethods = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>💳 Phương Thức Thanh Toán</Text>
      <View style={styles.paymentContainer}>
        <TouchableOpacity
          onPress={() => setPayment("Momo")}
          style={[styles.paymentMethod, payment === "Momo" && styles.selectedPayment]}
          activeOpacity={0.8}
        >
          <Image style={styles.paymentIcon} source={require("../img/momo.png")} />
          <Text style={styles.paymentText}>Momo</Text>
          {payment === "Momo" && (
            <View style={styles.selectedPaymentBadge}>
              <Text style={styles.selectedPaymentIcon}>✓</Text>
            </View>
          )}
        </TouchableOpacity>

        

        <TouchableOpacity
          onPress={() => setPayment("VietQR")}
          style={[styles.paymentMethod, payment === "VietQR" && styles.selectedPayment]}
          activeOpacity={0.8}
        >
          <Image style={styles.paymentIcon} source={require("../img/vietqr.png")} />
          <Text style={styles.paymentText}>VietQR</Text>
          {payment === "VietQR" && (
            <View style={styles.selectedPaymentBadge}>
              <Text style={styles.selectedPaymentIcon}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderBookingButton = () => (
    <View style={styles.bookingContainer}>
      <TouchableOpacity
        style={[styles.bookingBtn, (gheSelected.length === 0 || !payment) && styles.bookingBtnDisabled]}
        disabled={gheSelected.length === 0 || !payment}
        onPress={async () => {
          if (payment === "VietQR") {
            setShowVietQR(true)
            return
          }
          if (payment === "Momo") {
            // Create Momo payment when booking button is clicked
            setMomoLoading(true)
            // Reset processed state for new payment
            setMomoPaymentProcessed(false)
            try {
              const orderInfo = `MOVIX_${user.khach_hang_id}_${Date.now()}`
              console.log('Creating Momo payment for amount:', so_tien)
              
              const result = await generateMomoPayment(so_tien, orderInfo)
              console.log('Momo payment result:', result)
              
              if (result.success && (result.qrCodeUrl || result.payUrl || result.shortLink)) {
                setMomoOrderId(result.orderId)
                setMomoRequestId(result.requestId)
                // Use payUrl if qrCodeUrl is not available
                setMomoQRData(result.qrCodeUrl || result.payUrl || result.shortLink)
                setShowVietQR(true)
                ToastAndroid.show("QR code Momo đã được tạo thành công", ToastAndroid.SHORT)
              } else {
                console.error('Momo payment failed:', result.message || 'Không có URL thanh toán')
                ToastAndroid.show("Không thể tạo mã QR Momo - Vui lòng thử lại", ToastAndroid.SHORT)
              }
            } catch (error) {
              console.error('Momo payment error:', error)
              ToastAndroid.show("Lỗi khi tạo mã QR Momo", ToastAndroid.SHORT)
            } finally {
              setMomoLoading(false)
            }
            return
          }
          await handleDatVeAndThanhToan()
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.bookingBtnIcon}>🎫</Text>
        <Text style={styles.bookingBtnText}>Thanh toán: {so_tien.toLocaleString()}đ</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
      {renderHeader()}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderTicketInfo()}
        {renderSeatSelection()}
        {renderFoodSelection()}
        {renderVoucherSelection()}
        {renderPriceBreakdown()}
        {renderPaymentMethods()}
        <View style={{ height: 120 }} />
      </ScrollView>

      {renderBookingButton()}

      {/* VietQR Modal */}
      <Modal isVisible={showVietQR} style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>🏦 Quét mã VietQR để thanh toán</Text>
          <Image source={{ uri: vietQRUrl }} style={styles.qrImage} resizeMode="contain" />
          <View style={styles.qrInfo}>
            <Text style={styles.qrInfoText}>
              Số tiền: <Text style={styles.qrInfoValue}>{so_tien.toLocaleString()}đ</Text>
            </Text>
            <Text style={styles.qrInfoText}>
              Nội dung: <Text style={styles.qrInfoValue}>{vietQRInfo.noiDung}</Text>
            </Text>
          </View>
          <TouchableOpacity
            style={styles.confirmPaymentBtn}
            onPress={async () => {
              setShowVietQR(false)
              await handleDatVeAndThanhToan()
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmPaymentText}>✅ Tôi đã chuyển khoản</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelPaymentBtn} onPress={() => setShowVietQR(false)}>
            <Text style={styles.cancelPaymentText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Momo Modal */}
      <Modal isVisible={payment === "Momo" && showVietQR} style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>🏦 Quét mã Momo để thanh toán</Text>
          
          {momoLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={styles.loadingText}>Đang tạo mã QR...</Text>
            </View>
          ) : momoQRData ? (
            <>
              <QRCode
                value={momoQRData}
                size={220}
                color="black"
                backgroundColor="white"
                style={styles.qrImage}
              />
              
              <View style={styles.qrInfo}>
                <Text style={styles.qrInfoText}>
                  Số tiền: <Text style={styles.qrInfoValue}>{so_tien.toLocaleString()}đ</Text>
                </Text>
                <Text style={styles.qrInfoText}>
                  Mã giao dịch: <Text style={styles.qrInfoValue}>{momoOrderId}</Text>
                </Text>
                <Text style={styles.qrInfoText}>
                  Nội dung: <Text style={styles.qrInfoValue}>MOVIX_{user.khach_hang_id}_{Date.now()}</Text>
                </Text>
                {momoQRData && momoQRData.includes('test-payment.momo.vn') && (
                  <Text style={styles.qrInfoText}>
                    📱 <Text style={styles.qrInfoValue}>Quét mã để mở Momo app</Text>
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.checkStatusBtn}
                onPress={checkMomoPaymentStatus}
                activeOpacity={0.8}
              >
                <Text style={styles.checkStatusText}>🔄 Kiểm tra trạng thái</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={styles.confirmPaymentBtn}
                onPress={async () => {
                  setShowVietQR(false)
                  await handleDatVeAndThanhToan()
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmPaymentText}>✅ Tôi đã chuyển khoản</Text>
              </TouchableOpacity> */}
            </>
          ) : (
            <>
              <Text style={styles.errorText}>Không thể tạo mã QR Momo</Text>
              <Text style={styles.errorSubText}>Vui lòng thử lại hoặc chọn phương thức khác</Text>
              
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={async () => {
                  setShowVietQR(false)
                  setPayment("")
                  // Retry Momo payment
                  const orderInfo = `MOVIX_${user.khach_hang_id}_${Date.now()}`
                  const result = await generateMomoPayment(so_tien, orderInfo)
                  if (result.success && (result.qrCodeUrl || result.payUrl || result.shortLink)) {
                    setMomoOrderId(result.orderId)
                    setMomoRequestId(result.requestId)
                    setMomoQRData(result.qrCodeUrl || result.payUrl || result.shortLink)
                    setShowVietQR(true)
                  }
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.retryText}>🔄 Thử lại</Text>
              </TouchableOpacity>
            </>
          )}
          
          <TouchableOpacity style={styles.cancelPaymentBtn} onPress={() => setShowVietQR(false)}>
            <Text style={styles.cancelPaymentText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}

export default ThongTinVe

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
  ticketCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  ticketHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  ticketIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  ticketTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  ticketContent: {
    padding: 20,
  },
  ticketRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  ticketLabel: {
    fontWeight: "600",
    color: "#6b7280",
    width: 120,
    fontSize: 14,
  },
  ticketValue: {
    color: "#374151",
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  sectionCard: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 15,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 2,
  },
  selectedLegend: {
    backgroundColor: "#ef4444",
    borderColor: "#ef4444",
  },
  availableLegend: {
    backgroundColor: "transparent",
    borderColor: "#ef4444",
  },
  bookedLegend: {
    backgroundColor: "#6b7280",
    borderColor: "#6b7280",
  },
  legendText: {
    fontSize: 12,
    color: "#6b7280",
  },
  cinemaContainer: {
    backgroundColor: "#2A2A38",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  screenText: {
    color: "#fff",
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 10,
  },
  seatsContainer: {
    marginTop: 30,
  },
  seatRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  seatButton: {
    margin: 4,
  },
  seat: {
    width: 50,
    height: 35,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  availableSeat: {
    backgroundColor: "transparent",
    borderColor: "#ef4444",
  },
  selectedSeat: {
    backgroundColor: "#ef4444",
    borderColor: "#ef4444",
  },
  bookedSeat: {
    backgroundColor: "#6b7280",
    borderColor: "#6b7280",
  },
  seatText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  selectedSeatText: {
    fontWeight: "bold",
  },
  foodScroll: {
    paddingVertical: 5,
  },
  foodItem: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    width: 100,
    position: "relative",
  },
  selectedFoodItem: {
    backgroundColor: "#fef2f2",
    borderColor: "#ef4444",
  },
  foodImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginBottom: 8,
  },
  foodName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
    marginBottom: 4,
  },
  foodPrice: {
    fontSize: 12,
    color: "#ef4444",
    fontWeight: "bold",
  },
  selectedFoodBadge: {
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
  selectedFoodIcon: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  voucherScroll: {
    paddingVertical: 5,
  },
  voucherItem: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    minWidth: 80,
    position: "relative",
  },
  selectedVoucherItem: {
    backgroundColor: "#fef2f2",
    borderColor: "#ef4444",
  },
  voucherIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  voucherDiscount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ef4444",
  },
  voucherText: {
    fontSize: 10,
    color: "#6b7280",
  },
  selectedVoucherBadge: {
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
  selectedVoucherIcon: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  priceCard: {
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
  priceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 15,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  discountValue: {
    color: "#10b981",
  },
  priceDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ef4444",
  },
  paymentContainer: {
    gap: 12,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    position: "relative",
  },
  selectedPayment: {
    backgroundColor: "#fef2f2",
    borderColor: "#ef4444",
  },
  paymentIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    flex: 1,
  },
  selectedPaymentBadge: {
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
  selectedPaymentIcon: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
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
    fontSize: 16,
    fontWeight: "bold",
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    width: width * 0.9,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 20,
    textAlign: "center",
  },
  qrImage: {
    width: 220,
    height: 220,
    marginBottom: 15,
  },
  qrInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  qrInfoText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  qrInfoValue: {
    fontWeight: "bold",
    color: "#374151",
  },
  confirmPaymentBtn: {
    backgroundColor: "#10b981",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 10,
  },
  confirmPaymentText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelPaymentBtn: {
    paddingVertical: 8,
  },
  cancelPaymentText: {
    color: "#6b7280",
    fontSize: 14,
  },
  checkStatusBtn: {
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 10,
  },
  checkStatusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 10,
  },
  errorSubText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 20,
  },
  retryBtn: {
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
})
