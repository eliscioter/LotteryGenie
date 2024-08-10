import { Text, View } from "@/components/Themed";
import { index_styles } from "@/assets/stylesheets/index";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { LottoCombination } from "@/types/results-type";
import { fetchHistory } from "@/services/db/lotto-combinations";
import { history_styles } from "@/assets/stylesheets/history/history";
import { FlatList, SafeAreaView } from "react-native";

export default function TabTwoScreen() {
  const db = useSQLiteContext();
  const [history, setHistory] = useState<LottoCombination[]>([]);

  useEffect(() => {
    try {
      fetchHistory(db).then((results) => {
        setHistory(results.reverse());
      });
    } catch (error) {
      console.error("Error fetching history", error);
    }
  }, []);


  return (
    <SafeAreaView style={index_styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={history_styles.item_container}>
            <Text style={history_styles.item_text_color}>{item.category}</Text>
            <Text style={history_styles.item_text_color}>{item.combination}</Text>
            <Text style={history_styles.item_text_color}>{item.input_date}</Text>
          </View>
        )}
      />

    </SafeAreaView>
  );
}
