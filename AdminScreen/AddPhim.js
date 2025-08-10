"use client"

import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { addPhim } from "../redux/actions/PhimAction"
import { launchImageLibrary } from "react-native-image-picker"
import { useNavigation } from "@react-navigation/native"
import { Picker } from "@react-native-picker/picker"

const { width } = Dimensions.get("window")

const THE_LOAI_OPTIONS = [
  "Hành động",
  "Phiêu lưu",
  "Hài",
  "Tình cảm / Lãng mạn",
  "Tâm lý",
  "Kinh dị",
  "Giật gân",
  "Bí ẩn",
  "Khoa học viễn tưởng",
  "Viễn tưởng - Giả tưởng",
  "Hình sự",
  "Chiến tranh",
  "Chính kịch",
  "Tài liệu",
  "Phim tiểu sử",
  "Âm nhạc",
  "Gia đình",
  "Thể thao",
  "Phim thiếu nhi",
]

const AddPhim = () => {
  const [ten_phim, setten_phim] = useState("")
  const [dao_dien, setdao_dien] = useState("")
  const [ngon_ngu, setngon_ngu] = useState("")
  const [do_tuoi, setdo_tuoi] = useState("")
  const [mo_ta, setmo_ta] = useState("")
  const [thoi_luong, setthoi_luong] = useState("")
  const [poster_url, setposter_url] = useState("")
  const [trailer_url, settrailer_url] = useState("")
  const [the_loai, setthe_loai] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigation = useNavigation()
  const dispatch = useDispatch()

  const imgbbApiKey = "d698d3c569cf045e45516a8fc568c999"

  const uploadToImgbb = async (base64) => {
    const formData = new FormData()
    formData.append("key", imgbbApiKey)
    formData.append("image", base64)

    const res = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    })
    const data = await res.json()
    return data.data?.url
  }

  const handlePickImage = async () => {
    launchImageLibrary({ mediaType: "photo", includeBase64: true, quality: 0.8 }, async (response) => {
      if (response.didCancel || response.errorCode) return

      setIsUploading(true)
      try {
        const base64 = response.assets[0].base64
        const url = await uploadToImgbb(base64)
        if (url) {
          setposter_url(url)
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không thể tải ảnh lên. Vui lòng thử lại.")
      } finally {
        setIsUploading(false)
      }
    })
  }

  const handleAddPhim = async () => {
    if (!ten_phim.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên phim")
      return
    }

    setIsSubmitting(true)
    try {
      const phim = {
        ten_phim: ten_phim.trim(),
        dao_dien: dao_dien.trim(),
        ngon_ngu: ngon_ngu.trim(),
        do_tuoi: do_tuoi.trim(),
        mo_ta: mo_ta.trim(),
        thoi_luong: thoi_luong.trim(),
        poster_url,
        trailer_url: trailer_url.trim(),
        the_loai,
      }

      dispatch(addPhim(phim))
      Alert.alert("Thành công", "Đã thêm phim mới!", [{ text: "OK", onPress: () => navigation.goBack() }])
    } catch (error) {
      Alert.alert("Lỗi", "Không thể thêm phim. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const InputField = ({ label, value, onChangeText, placeholder, icon, ...props }) => (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <Text style={styles.labelIcon}>{icon}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          placeholderTextColor="#999"
          {...props}
        />
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerBackground}>
            <Text style={styles.headerIcon}>🎬</Text>
            <Text style={styles.title}>Thêm Phim Mới</Text>
            <Text style={styles.subtitle}>Điền thông tin chi tiết về bộ phim</Text>
          </View>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <InputField
            label="Tên phim"
            icon="📽️"
            value={ten_phim}
            onChangeText={setten_phim}
            placeholder="Nhập tên phim..."
          />

          {/* Poster Section */}
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelIcon}>🖼️</Text>
              <Text style={styles.label}>Poster phim</Text>
            </View>
            <View style={styles.posterContainer}>
              <View style={[styles.inputWrapper, styles.posterInputWrapper]}>
                <TextInput
                  placeholder="Dán link poster hoặc chọn ảnh..."
                  value={poster_url}
                  onChangeText={setposter_url}
                  style={[styles.input, styles.posterInput]}
                  placeholderTextColor="#999"
                />
              </View>
              <TouchableOpacity style={styles.pickImageBtn} onPress={handlePickImage} disabled={isUploading}>
                {isUploading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={styles.pickImageIcon}>📷</Text>
                    <Text style={styles.pickImageBtnText}>Chọn</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {poster_url ? (
              <View style={styles.posterPreviewContainer}>
                <View style={styles.posterImageContainer}>
                  <Image source={{ uri: poster_url }} style={styles.posterPreview} />
                  <TouchableOpacity style={styles.removeImageBtn} onPress={() => setposter_url("")}>
                    <Text style={styles.removeImageBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>

          <InputField
            label="Trailer (YouTube)"
            icon="🎥"
            value={trailer_url}
            onChangeText={settrailer_url}
            placeholder="Link trailer YouTube..."
          />

          <InputField
            label="Đạo diễn"
            icon="🎭"
            value={dao_dien}
            onChangeText={setdao_dien}
            placeholder="Nhập tên đạo diễn..."
          />

          {/* Genre Picker */}
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelIcon}>🎪</Text>
              <Text style={styles.label}>Thể loại</Text>
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={the_loai}
                onValueChange={setthe_loai}
                style={styles.picker}
                dropdownIconColor="#6366f1"
              >
                <Picker.Item label="Chọn thể loại..." value="" />
                {THE_LOAI_OPTIONS.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
          </View>

          <InputField
            label="Thời lượng (phút)"
            icon="⏱️"
            value={thoi_luong}
            onChangeText={setthoi_luong}
            placeholder="VD: 120"
            keyboardType="numeric"
          />

          {/* Description */}
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelIcon}>📝</Text>
              <Text style={styles.label}>Mô tả</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Mô tả nội dung phim..."
                value={mo_ta}
                onChangeText={setmo_ta}
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <InputField
            label="Ngôn ngữ"
            icon="🌍"
            value={ngon_ngu}
            onChangeText={setngon_ngu}
            placeholder="VD: Tiếng Việt, English..."
          />

          <InputField
            label="Độ tuổi"
            icon="🔞"
            value={do_tuoi}
            onChangeText={setdo_tuoi}
            placeholder="VD: 16+"
            keyboardType="numeric"
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.addBtn, isSubmitting && styles.addBtnDisabled]}
            onPress={handleAddPhim}
            disabled={isSubmitting}
          >
            <View style={styles.addBtnContent}>
              {isSubmitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text style={styles.addBtnIcon}>✨</Text>
                  <Text style={styles.addBtnText}>Thêm Phim</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

export default AddPhim

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerBackground: {
    backgroundColor: "#6366f1",
    borderRadius: 25,
    padding: 30,
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  headerIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    marginTop: -15,
  },
  inputContainer: {
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  labelIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  inputWrapper: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 15,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#374151",
  },
  posterContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  posterInputWrapper: {
    flex: 1,
  },
  posterInput: {
    marginBottom: 0,
  },
  pickImageBtn: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 80,
  },
  pickImageIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  pickImageBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  posterPreviewContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  posterImageContainer: {
    position: "relative",
  },
  posterPreview: {
    width: 140,
    height: 200,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    resizeMode: "cover",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  removeImageBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#ef4444",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  removeImageBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  picker: {
    height: 50,
    color: "#374151",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  addBtn: {
    marginTop: 20,
    backgroundColor: "#6366f1",
    borderRadius: 20,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  addBtnDisabled: {
    opacity: 0.7,
  },
  addBtnContent: {
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
})
