import { ActionButton, BorderButton, LinkButton } from "@/components/buttons";
import { InputText } from "@/components/input";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const theme = useTheme();
  const [isFetching, setIsFetching] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginForm> = (data) => {
    console.log(data);
    setIsFetching(true);
    setTimeout(() => {
      console.log("Submit!");
      setIsFetching(false);
    }, 2000);
  };

  console.log(theme);

  return (
    <ThemedView style={styles.screen}>
      <LinearGradient
        colors={["#4c6ef5", "#5a1ea3ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <AntDesign name="shopping" size={36} color="#FFFFFF80" />
        <ThemedText style={styles.headerText}>iWish</ThemedText>
      </LinearGradient>

      <ThemedView style={styles.loginView}>
        <ThemedText style={styles.title}>Welcome Back!</ThemedText>
        <ThemedText style={styles.subText}>Enter your details below</ThemedText>
        <View style={styles.loginForm}>
          <InputText
            control={control}
            name="email"
            label="Email"
            rules={{ isEmail: true, required: true }}
          />
          <InputText
            control={control}
            name="password"
            label="Password"
            rules={{ isPassword: true, required: true }}
          />
          <ActionButton
            onPress={handleSubmit(onSubmit)}
            text="Sign in"
            loading={isFetching}
          />
          <LinkButton
            text="Forgot your password ?"
            onPress={() => {}}
            textAlign="center"
            style={{ marginTop: 20 }}
          />
        </View>

        <View style={styles.footerSection}>
          <View style={styles.orSection}>
            <View style={styles.divider} />
            <View style={styles.orText}>
              <Text style={styles.orText}>Or sign in with</Text>
            </View>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialButtons}>
            <BorderButton
              onPress={() => {}}
              text="Google"
              icon={<AntDesign name="google" color={"#FFF"} size={20} />}
            />
            <BorderButton
              onPress={() => {}}
              text="Facebook"
              icon={<AntDesign name="instagram" color={"#FFF"} size={20} />}
            />
          </View>
        </View>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#1a73e8",
  },
  header: {
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  loginView: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 42,
    paddingVertical: 24,
    paddingHorizontal: 32,
    justifyContent: "flex-start",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: "#ffffff70",
    marginBottom: 12,
  },
  loginForm: {
    flex: 1,
    width: "100%",
  },
  orSection: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#ffffff20",
    flex: 1,
  },
  orText: {
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#FFFFFF",
  },
  footerSection: {
    marginBottom: 60,
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  socialButtons: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    gap: 16,
  },
  bottomSection: {
    flex: 1,
    width: "100%",
  },
});
