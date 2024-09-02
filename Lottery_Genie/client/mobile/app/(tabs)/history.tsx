import { Text, View } from "@/components/Themed";
import { index_styles } from "@/assets/stylesheets/index";
import { useSQLiteContext } from "expo-sqlite";
import { useContext, useEffect, useState } from "react";
import { LottoCombination } from "@/types/results-type";
import { db_table, fetchHistory } from "@/services/db/lotto-combinations";
import { history_styles } from "@/assets/stylesheets/history/history";
import { FlatList, SafeAreaView, TouchableOpacity } from "react-native";
import { UpdateHistoryDetailsCtx } from "@/services/shared/history-details-ctx";
import { Swipeable } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { SelectCtx } from "./_layout";
import { Checkbox, Modal, Portal } from "react-native-paper";

export default function HistoryScreen() {
  const db = useSQLiteContext();
  const [history, setHistory] = useState<LottoCombination[]>([]);

  const { update_history_details, setUpdateHistoryDetails } = useContext(
    UpdateHistoryDetailsCtx
  );

  const { is_pressed } = useContext(SelectCtx);

  const [is_selected_all, setIsSelectedAll] = useState(false);

  const [selected, setSelected] = useState<LottoCombination[]>([]);

  const [modal_visible, setModalVisibility] = useState(false);
  const [delete_items, setDeleteItems] = useState(false);

  useEffect(() => {
    try {
      fetchHistory(db).then((results) => {
        setHistory(results.reverse());
      });
    } catch (error) {
      console.error("Error fetching history", error);
    } finally {
      setUpdateHistoryDetails(history);
    }
  }, [update_history_details]);

  function deleteItems() {
    try {
      selected.map(async (item) => {
        deleteFromState(item);
        await db.runAsync(`DELETE FROM ${db_table} WHERE id = ?`, item.id);
      });
    } catch (error) {
      console.error("Error deleting items", error);
    } finally {
      setUpdateHistoryDetails(history);
      setDeleteItems(false);
    }
  }
  useEffect(() => {
    deleteItems();
  }, [delete_items]);

  useEffect(() => {
    if (is_selected_all) {
      setSelected(history);
    } else {
      setSelected([]);
    }
  }, [is_selected_all]);

  function deleteFromState(item: LottoCombination) {
    try {
      setHistory((prev) => {
        return prev.filter((x) => x !== item);
      });
    } catch (error) {
      console.error("Error deleting from state", error);
    }
  }
  return (
    <SafeAreaView style={index_styles.container}>
      {is_pressed && (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "transparent",
            justifyContent: "space-between",
            paddingBottom: 10,
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
            <Checkbox
              status={is_selected_all ? "checked" : "unchecked"}
              onPress={() => {
                console.log("pressing");
                setIsSelectedAll(!is_selected_all);
              }}
              uncheckedColor="white"
              color="white"
            />
            <Text style={{ color: "white", marginLeft: 5 }}>Select All</Text>
          </View>
          {selected.length > 0 && (
            <FontAwesome
              name="trash"
              color={"white"}
              size={25}
              onPress={() => {
                setModalVisibility(true);
              }}
              style={{ paddingRight: 10 }}
            />
          )}
        </View>
      )}
      <Portal>
        <Modal
          visible={modal_visible}
          onDismiss={() => {
            setModalVisibility(false);
          }}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 20,
            margin: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 20 }}>Delete</Text>
          <Text style={{ textAlign: "center" }}>
            Are you sure you want to delete these items?
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setDeleteItems(true);
                setModalVisibility(false);
              }}
              style={{
                marginRight: 10,
                borderWidth: 1,
                borderColor: "green",
                borderRadius: 50,
                paddingVertical: 5,
                paddingHorizontal: 15,
              }}
            >
              <Text>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisibility(false);
              }}
              style={{
                borderWidth: 1,
                borderColor: "red",
                borderRadius: 50,
                paddingVertical: 5,
                paddingHorizontal: 15,
              }}
            >
              <Text>No</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
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
              setSelected((prev) => {
                if (prev.includes(item)) {
                  return prev.filter((x) => x !== item);
                } else {
                  return [...prev, item];
                }
              });
              setModalVisibility(true);
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
