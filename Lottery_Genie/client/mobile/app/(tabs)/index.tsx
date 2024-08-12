import { index_styles } from "@/assets/stylesheets/index";
import CurrentJackpotPrize from "@/components/index/CurrentJackpotPrize";
import InputForm from "@/components/index/InputForm";
import Result from "@/components/index/Result";
import { Text, View } from "@/components/Themed";
import { CombCtx } from "@/services/shared/user-comb-ctx";
import { useMemo, useState } from "react";
import { SafeAreaView } from "react-native";

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
    () => ({
      input_combination,
      setInputCombination,
      clearInputCombination: () =>
        setInputCombination(["", "", "", "", "", ""]),
    }),
    [input_combination]
  );

  const today = new Date();

  const date_today = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <SafeAreaView>
      <View style={index_styles.container}>
        <Text style={index_styles.title}>{date_today}</Text>
        <CurrentJackpotPrize />
        <View style={index_styles.input_form_container}>
          <CombCtx.Provider value={update_input_comb}>
            <InputForm />
            <Result />
          </CombCtx.Provider>
        </View>
      </View>
    </SafeAreaView>
  );
}
