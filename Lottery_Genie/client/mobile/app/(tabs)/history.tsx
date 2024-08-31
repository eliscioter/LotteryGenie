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
import { SelectCtx } from "./_layout";
import { Checkbox } from "react-native-paper";

export default function HistoryScreen() {
  const db = useSQLiteContext();
  const [history, setHistory] = useState<LottoCombination[]>([]);

  const { update_history_details, setUpdateHistoryDetails } = useContext(
    UpdateHistoryDetailsCtx
  );

  const { is_pressed } = useContext(SelectCtx);

  const [is_selected_all, setIsSelectedAll] = useState(false);

  const [selected, setSelected] = useState<LottoCombination[]>([]);

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

  useEffect(() => {
    if (is_selected_all) {
      setSelected(history);
    } else {
      setSelected([]);
    }
  }, [is_selected_all]);
  return (
    <SafeAreaView style={index_styles.container}>
      {is_pressed && (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "transparent",
            paddingBottom: 10,
          }}
        >
          <Checkbox
            status={is_selected_all ? "checked" : "unchecked"}
            onPress={() => {
              setIsSelectedAll(!is_selected_all);

            }}
            uncheckedColor="white"
            color="white"
          />
          <Text style={{ color: "white", marginLeft: 5 }}>Delete All</Text>
        </View>
      )}
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 100,
                  height: "100%",
                  backgroundColor: "red",
                }}
              >
                <FontAwesome name="trash" color={"white"} size={35} />
              </View>
            )}
            onSwipeableOpen={() => {
              // ! this is just deleting the state, not the actual data
              console.info("Deleting item from history", item);
              const updatedHistory = history.filter((x) => x.id !== item.id);
              setHistory(updatedHistory);
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "transparent",
              }}
            >
              {is_pressed && (
                <Checkbox
                  key={item.id}
                  status={selected.includes(item) ? "checked" : "unchecked"}
                  uncheckedColor="white"
                  onPress={() => {
                    setSelected((prev) => {
                      if (prev.includes(item)) {
                        return prev.filter((x) => x !== item);
                      } else {
                        return [...prev, item];
                      }
                    });
                  }}
                  color="white"
                />
              )}
              <View
                style={{
                  ...history_styles.item_container,
                  width: is_pressed ? "85%" : "95%",
                }}
              >
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
            </View>
          </Swipeable>
        )}
      />
    </SafeAreaView>
  );
}
