import { StatusBar } from "expo-status-bar";
import { Image, View } from "react-native";
import { styles } from "./styles";

export function Home() {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("@/assets/logo.png")} />
      <StatusBar style="auto" />
    </View>
  );
}
