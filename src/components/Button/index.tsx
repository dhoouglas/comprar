import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";
import { styles } from "./styles";

type Props = TouchableOpacityProps & {
  title: string;
};

export function Button({ title, ...rest }: Props) {
  return (
    <TouchableOpacity {...rest} style={styles.container} activeOpacity={0.8}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}
