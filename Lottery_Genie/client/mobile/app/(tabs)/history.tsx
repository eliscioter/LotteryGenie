import { Text, View } from "@/components/Themed";
import { index_styles } from "@/assets/stylesheets/index";
import { useSQLiteContext } from "expo-sqlite";
import { useContext, useEffect, useState } from "react";
import { LottoCombination } from "@/types/results-type";
import { fetchHistory } from "@/services/db/lotto-combinations";
import { history_styles } from "@/assets/stylesheets/history/history";
import { FlatList, SafeAreaView } from "react-native";
import { UpdateHistoryDetailsCtx } from "@/services/shared/history-details-ctx";

export default function TabTwoScreen() {
  const db = useSQLiteContext();
  const [history, setHistory] = useState<LottoCombination[]>([]);

  const { update_history_details, setUpdateHistoryDetails } = useContext(
    UpdateHistoryDetailsCtx
  );

  useEffect(() => {
    try {
      fetchHistory(db).then((results) => {
        setHistory(results.reverse());
      });
    } catch (error) {
      console.error("Error fetching history", error);
    } finally {
      setUpdateHistoryDetails(false);
    }
  }, [update_history_details]);

  return (
    <SafeAreaView style={index_styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={history_styles.item_container}>
            <Text style={history_styles.item_text_color}>
              Game: {item.category}
            </Text>
            <Text style={history_styles.item_text_color}>
              Combination: {item.combination}
            </Text>
            <Text style={history_styles.item_text_color}>
              Picked Date: {item.input_date}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
