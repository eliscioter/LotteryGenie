import { Text, View } from "@/components/Themed";
import { index_styles } from "@/assets/stylesheets/index";
import { useSQLiteContext } from "expo-sqlite";
import { useContext, useEffect, useState } from "react";
import { LottoCombination } from "@/types/results-type";
import { fetchHistory } from "@/services/db/lotto-combinations";
import { history_styles } from "@/assets/stylesheets/history/history";
import { FlatList, SafeAreaView } from "react-native";
import { UpdateHistoryDetailsCtx } from "@/services/shared/history-details-ctx";
import { Swipeable } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";

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
          <Swipeable
            renderRightActions={() => (
              <View style={{
                justifyContent: "center",
                alignItems: "center",
                width: 100,
                height: "100%",
                backgroundColor: "red"
              }}>
                <FontAwesome 
                  name="trash"
                  color={"white"}
                  size={35}
                />
              </View>
            )}
            
            onSwipeableOpen={
              () => {
                // ! this is just deleting the state, not the actual data
                console.info("Deleting item from history", item);
                const updatedHistory = history.filter((h) => h.id !== item.id);
                setHistory(updatedHistory);
              }
            }
          >
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
          </Swipeable>
        )}
      />
    </SafeAreaView>
  );
}
