import { index_styles } from "@/assets/stylesheets/index";
import CurrentJackpotPrize from "@/components/CurrentJackpotPrize";
import InputForm from "@/components/InputForm";
import Result from "@/components/Result";
import { Text, View } from "@/components/Themed";
import { createContext, useMemo, useState } from "react";
import { ScrollView } from "react-native";

export const CombCtx = createContext({
  input_combination: ["", "", "", "", "", ""],
  setInputCombination: (input_combination: string[]) => {},
});

export default function TabOneScreen() {
  const [input_combination, setInputCombination] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const update_input_comb = useMemo(
    () => ({ input_combination, setInputCombination }),
    [input_combination]
  );

  return (
    <ScrollView style={index_styles.container}>
      <Text style={index_styles.title}>{new Date().toLocaleDateString()}</Text>
      <CurrentJackpotPrize />
      <View style={index_styles.input_form_container}>
        <CombCtx.Provider value={update_input_comb}>
          <InputForm />
          <Result />
        </CombCtx.Provider>
      </View>
    </ScrollView>
  );
}
