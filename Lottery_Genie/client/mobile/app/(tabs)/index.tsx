import { index_styles } from "@/assets/stylesheets/index";
import CurrentJackpotPrize from "@/components/CurrentJackpotPrize";
import InputForm from "@/components/InputForm";
import Result from "@/components/Result";
import { Text, View } from "@/components/Themed";
import { ScrollView } from "react-native";

export default function TabOneScreen() {
  return (
    <ScrollView style={index_styles.container}>
      <Text style={index_styles.title}>{new Date().toLocaleDateString()}</Text>
      <CurrentJackpotPrize />
      <View style={index_styles.input_form_container}>
        <InputForm />
        <Result />
      </View>
    </ScrollView>
  );
}
