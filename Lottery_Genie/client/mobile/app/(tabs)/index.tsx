import { index_styles } from "@/assets/stylesheets/index";
import CurrentJackpotPrize from "@/components/index/CurrentJackpotPrize";
import InputForm from "@/components/index/InputForm";
import Result from "@/components/index/Result";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function TabOneScreen() {

  const today = new Date();

  const date_today = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <SafeAreaView>
      <ScrollView
        style={{
          backgroundColor: `${Colors.light_blue_green}`,
          height: "100%",
        }}
      >
        <View style={index_styles.container}>
          <Text style={index_styles.title}>{date_today}</Text>
          <CurrentJackpotPrize />
          <View style={index_styles.input_form_container}>
              <InputForm />
              <Result />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
