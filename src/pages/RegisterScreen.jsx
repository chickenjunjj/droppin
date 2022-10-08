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
import { auth } from "../utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);

  const handleRegister = () => {
    if (password === confirmPass) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          navigation.navigate("Feed");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    } else {
      setErrorMessage(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.h1}>Sign Up</Text>
      <Text style={styles.p}>Create an account to get started</Text>
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
      <TextInput
        value={confirmPass}
        onChangeText={setConfirmPass}
        placeholder="Confirm Password"
        placeholderTextColor={colors.darkGray}
        secureTextEntry={true}
        style={styles.input}
      />
      {errorMessage && (
        <Text style={styles.errorMes}>Password not consistent</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <View style={styles.toRegister}>
        <Text>Have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.register}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;

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
  errorMes: { marginTop: 10, alignContent: "center", color: colors.primary },
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
