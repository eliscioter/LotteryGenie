import { index_styles } from "@/assets/stylesheets/index";
import CurrentJackpotPrize from "@/components/CurrentJackpotPrize";
import InputForm from "@/components/InputForm";
import Result from "@/components/Result";
import { Text, View } from "@/components/Themed";
import { useCurrentResultStore } from "@/services/shared/result";
import { LottoDetails } from "@/types/results-type";
import { useState } from "react";
import { ScrollView } from "react-native";

export default function TabOneScreen() {
  const { setResult } = useCurrentResultStore();
  const [input_combination, setInputCombination] = useState<string[]>(["", "", "", "", "", ""]);

  const handleFetchResponse = (data: LottoDetails) => {
    setResult(data);
  }

  const handleInputCombination = (data: string[]) => {
    setInputCombination(data);
  }
  return (
    <ScrollView style={index_styles.container}>
      <Text style={index_styles.title}>{new Date().toLocaleDateString()}</Text>
      <CurrentJackpotPrize />
      <View style={index_styles.input_form_container}>
        <InputForm input={handleInputCombination} result_data={handleFetchResponse} />
        <Result input={input_combination} />
      </View>
    </ScrollView>
  );
}
