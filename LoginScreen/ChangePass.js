"use client"

import { useState } from "react"
import { Alert, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { updateUser } from "../redux/actions/UserAction"
import { useNavigation } from "@react-navigation/native"

const ChangePass = () => {
  const user = useSelector((state) => state.user.user)
  const dispatch = useDispatch()
  const [OldPassword, setOldPassword] = useState("")
  const [NewPassword, setNewPassword] = useState("")
  const [NewPassword2, setNewPassword2] = useState("")
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()

  const changepass = async () => {
    if (OldPassword === "" || NewPassword === "" || NewPassword2 === "") {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin")
      return
    }

    if (NewPassword !== NewPassword2) {
      Alert.alert("Lỗi", "Mật khẩu mới không khớp")
      return
    }

    if (NewPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 6 ký tự")
      return
    }

    if (OldPassword === user.mat_khau) {
      setLoading(true)
      try {
        await dispatch(updateUser({ ...user, mat_khau: NewPassword }))
        Alert.alert("Thành công", "Đổi mật khẩu thành công", [
          {
            text: "OK",
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: "MyTabs" }],
              })
            },
          },
        ])
      } catch (error) {
        Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại")
      } finally {
        setLoading(false)
      }
    } else {
      Alert.alert("Lỗi", "Mật khẩu cũ không chính xác")
    }
  }

  const PasswordInput = ({ placeholder, value, onChangeText, showPassword, toggleShowPassword }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.lockIcon}>🔒</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#999"
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={!showPassword}
        style={styles.textInput}
      />
      <TouchableOpacity style={styles.eyeIcon} onPress={toggleShowPassword}>
        <Text style={styles.eyeText}>{showPassword ? "👁️" : "🙈"}</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <Text style={styles.shieldIcon}>🛡️</Text>
          </View>
          <Text style={styles.title}>Đổi mật khẩu</Text>
          <Text style={styles.subtitle}>Cập nhật mật khẩu để bảo mật tài khoản của bạn</Text>
        </View>

        <View style={styles.form}>
          <PasswordInput
            placeholder="Mật khẩu cũ"
            value={OldPassword}
            onChangeText={setOldPassword}
            showPassword={showOldPassword}
            toggleShowPassword={() => setShowOldPassword(!showOldPassword)}
          />

          <PasswordInput
            placeholder="Mật khẩu mới"
            value={NewPassword}
            onChangeText={setNewPassword}
            showPassword={showNewPassword}
            toggleShowPassword={() => setShowNewPassword(!showNewPassword)}
          />

          <PasswordInput
            placeholder="Xác nhận mật khẩu mới"
            value={NewPassword2}
            onChangeText={setNewPassword2}
            showPassword={showConfirmPassword}
            toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <View style={styles.passwordHint}>
            <Text style={styles.hintText}>💡 Mật khẩu phải có ít nhất 6 ký tự</Text>
            <Text style={styles.hintText}>💡 Nên sử dụng kết hợp chữ và số</Text>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={changepass}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? "Đang xử lý..." : "Xác nhận"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

export default ChangePass

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    width: "100%",
    maxWidth: 380,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  shieldIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#EA5A5A",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 52,
  },
  lockIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 4,
  },
  eyeText: {
    fontSize: 18,
  },
  passwordHint: {
    backgroundColor: "#FFF9F9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: "#EA5A5A",
  },
  hintText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  button: {
    backgroundColor: "#EA5A5A",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#EA5A5A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#CCC",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})
