"use client"

import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, ActivityIndicator } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Picker } from "@react-native-picker/picker"
import { fetchRapChieu } from "../redux/actions/RapChieuAction"
import { fetchPhim } from "../redux/actions/PhimAction"
import { fetchAllPhongChieu } from "../redux/actions/PhongChieuAction"
import { fetchAllSuatChieu } from "../redux/actions/SuatChieuAction"
import { useNavigation } from "@react-navigation/native"

const LocationScreen = () => {
  const dispatch = useDispatch()
  const listRapChieu = useSelector((state) => state.rapchieu.listrapchieu)
  const listPhim = useSelector((state) => state.phim.listphim)
  const listSuatChieu = useSelector((state) => state.suatchieu.listsuatchieu)
  const listPhongChieu = useSelector((state) => state.phongchieu.listphongchieu)
  const [selectedCinema, setSelectedCinema] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()

  useEffect(() => {
    dispatch(fetchRapChieu())
    dispatch(fetchPhim())
    dispatch(fetchAllPhongChieu())
    dispatch(fetchAllSuatChieu())
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      setSelectedCinema(null)
      setLoading(false)
    }, []),
  )

  const handlePickCinema = (value) => {
    setSelectedCinema(value)
    setLoading(true)
    dispatch(fetchAllPhongChieu())
    dispatch(fetchAllSuatChieu())
    setTimeout(() => setLoading(false), 400)
  }

  const filteredPhim = selectedCinema
    ? listPhim.filter((phim) => {
        return listSuatChieu.some((suatchieu) => {
          if (suatchieu.phim_id !== phim.phim_id) return false
          const phong = listPhongChieu.find(
            (phongchieu) => phongchieu.room_id === suatchieu.room_id && phongchieu.cinema_id === selectedCinema,
          )
          return !!phong
        })
      })
    : []

  const selectedCinemaName = listRapChieu.find((r) => r.cinema_id === selectedCinema)?.ten_rap || ""

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎬 Chọn Rạp Chiếu</Text>
        <Text style={styles.headerSubtitle}>Tìm phim yêu thích tại rạp gần bạn</Text>
      </View>

      {/* Cinema Picker */}
      <View style={styles.pickerContainer}>
        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>📍 Địa điểm</Text>
          <View style={styles.pickerBorder}>
            <Picker selectedValue={selectedCinema} onValueChange={handlePickCinema} style={styles.picker}>
              <Picker.Item label="Chọn rạp chiếu..." value={null} />
              {listRapChieu.map((item) => (
                <Picker.Item key={item.cinema_id} label={`${item.ten_rap} - ${item.dia_chi}`} value={item.cinema_id} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* Movies List */}
      {selectedCinema && (
        <View style={styles.moviesSection}>
          <View style={styles.moviesSectionHeader}>
            <Text style={styles.moviesTitle}>🍿 Phim đang chiếu</Text>
            <Text style={styles.cinemaName}>{selectedCinemaName}</Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#EA5A5A" />
              <Text style={styles.loadingText}>Đang tải danh sách phim...</Text>
            </View>
          ) : filteredPhim.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🎭</Text>
              <Text style={styles.emptyText}>Không có phim nào đang chiếu</Text>
              <Text style={styles.emptySubtext}>Vui lòng chọn rạp khác</Text>
            </View>
          ) : (
            <FlatList
              data={filteredPhim}
              keyExtractor={(item) => item.phim_id}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.moviesList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("ChiTietPhimUser", {
                      phim: item,
                      cinema_id: selectedCinema,
                    })
                  }}
                  style={styles.movieCard}
                  activeOpacity={0.8}
                >
                  <View style={styles.posterContainer}>
                    <Image style={styles.poster} source={{ uri: item.poster_url }} resizeMode="cover" />
                    <View style={styles.overlay} />
                  </View>
                  <View style={styles.movieInfo}>
                    <Text style={styles.movieTitle} numberOfLines={2}>
                      {item.ten_phim}
                    </Text>
                    <View style={styles.durationContainer}>
                      <Text style={styles.durationIcon}>⏱️</Text>
                      <Text style={styles.duration}>{item.thoi_luong} phút</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}
    </View>
  )
}

export default LocationScreen

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
    color: "#EA5A5A",
    textAlign: "center",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  pickerContainer: {
    padding: 20,
  },
  pickerWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  pickerBorder: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E5E5E5",
    backgroundColor: "#FAFAFA",
  },
  picker: {
    height: 50,
  },
  moviesSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  moviesSectionHeader: {
    marginBottom: 16,
  },
  moviesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  cinemaName: {
    fontSize: 14,
    color: "#EA5A5A",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
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
  moviesList: {
    paddingBottom: 20,
  },
  movieCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    margin: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  posterContainer: {
    position: "relative",
    height: 200,
    backgroundColor: "#F0F0F0",
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  movieInfo: {
    padding: 12,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    lineHeight: 18,
    minHeight: 36,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  durationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  duration: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },
})
