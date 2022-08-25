import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import colors from "../styles/colors";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigation.navigate("Feed");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage);
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.h1}>Welcome Back!</Text>
      <Text style={styles.p}>Login to your account to get started</Text>
      <TextInput
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor={colors.darkGray}
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor={colors.darkGray}
        secureTextEntry={true}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.toRegister}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.register}>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { marginHorizontal: 20, flex: 1 },
  h1: { marginTop: 40, fontSize: 35, fontWeight: "500" },
  p: { marginTop: 15, marginBottom: 110, color: colors.darkGray },
  input: {
    marginTop: 15,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderColor: colors.darkGray,
  },
  button: {
    marginTop: "auto",
    backgroundColor: "black",
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: { color: "white", textAlign: "center" },
  toRegister: { flexDirection: "row", justifyContent: "center", marginTop: 10 },
  register: { color: colors.primary },
});
