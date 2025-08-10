"use client"

import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity, Dimensions, StatusBar } from "react-native"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchPhim } from "../redux/actions/PhimAction"
import { useNavigation } from "@react-navigation/native"

const { width } = Dimensions.get("window")
const cardWidth = (width - 48) / 2

const QuanLyPhim = () => {
  const navigation = useNavigation()
  const listphim = useSelector((state) => state.phim.listphim)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPhim())
  }, [])

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.cardContainer, { marginLeft: index % 2 === 0 ? 0 : 8 }]}
      activeOpacity={0.85}
      onPress={() => {
        navigation.navigate("ChiTietPhim", { phim: item })
      }}
    >
      <View style={styles.card}>
        {/* Poster Section */}
        <View style={styles.posterWrapper}>
          <Image style={styles.poster} source={{ uri: item.poster_url }} />
          <View style={styles.gradientOverlay} />

          {/* Genre Badge */}
          {item.the_loai && (
            <View style={styles.genreBadge}>
              <Text style={styles.genreText}>{item.the_loai}</Text>
            </View>
          )}

          {/* Rating Badge */}
          {item.do_tuoi && (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>{item.do_tuoi}+</Text>
            </View>
          )}
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.title} numberOfLines={2}>
            {item.ten_phim}
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>⏱️</Text>
              <Text style={styles.infoText}>{item.thoi_luong} phút</Text>
            </View>
          </View>

          {item.dao_dien && (
            <View style={styles.directorRow}>
              <Text style={styles.directorIcon}>🎭</Text>
              <Text style={styles.directorText} numberOfLines={1}>
                {item.dao_dien}
              </Text>
            </View>
          )}
        </View>

        {/* Hover Effect Overlay */}
        <View style={styles.hoverOverlay} />
      </View>
    </TouchableOpacity>
  )

  const handleAddPhim = () => {
    navigation.navigate("AddPhim")
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.headerIcon}>🎬</Text>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Quản Lý Phim</Text>
          <Text style={styles.headerSubtitle}>{listphim?.length || 0} bộ phim</Text>
        </View>
      </View>
    </View>
  )

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🎭</Text>
      <Text style={styles.emptyTitle}>Chưa có phim nào</Text>
      <Text style={styles.emptySubtitle}>Nhấn nút + để thêm phim mới</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />

      {renderHeader()}

      <View style={styles.listWrapper}>
        <FlatList
          data={listphim}
          keyExtractor={(item) => item.phim_id?.toString() || Math.random().toString()}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddPhim} activeOpacity={0.8}>
        <View style={styles.fabContent}>
          <Text style={styles.fabIcon}>+</Text>
        </View>
        <View style={styles.fabShadow} />
      </TouchableOpacity>
    </View>
  )
}

export default QuanLyPhim

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
  listWrapper: {
    flex: 1,
    paddingTop: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  cardContainer: {
    width: cardWidth,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    overflow: "hidden",
    position: "relative",
  },
  posterWrapper: {
    width: "100%",
    height: 240,
    position: "relative",
    overflow: "hidden",
  },
  poster: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  genreBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(99, 102, 241, 0.9)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  genreText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  ratingBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(239, 68, 68, 0.9)",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
    minWidth: 28,
    alignItems: "center",
  },
  ratingText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  contentSection: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
    lineHeight: 22,
    minHeight: 44,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  infoText: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  directorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  directorIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  directorText: {
    fontSize: 12,
    color: "#9ca3af",
    flex: 1,
  },
  hoverOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
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
    backgroundColor: "#6366f1",
  },
  fabIcon: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "300",
    lineHeight: 28,
  },
  fabShadow: {
    position: "absolute",
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderRadius: 28,
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    zIndex: -1,
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
})
