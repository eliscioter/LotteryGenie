import { Text, View } from "@/components/Themed";
import { index_styles } from "@/assets/stylesheets/index";
import { useSQLiteContext } from "expo-sqlite";
import { useContext, useEffect, useState } from "react";
import { LottoCombination } from "@/types/results-type";
import { db_table, fetchHistory } from "@/services/db/lotto-combinations";
import { history_styles } from "@/assets/stylesheets/history/history";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
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
  const [template_modal_visible, setTemplateModalVisibility] = useState(false);
  const [delete_items, setDeleteItems] = useState(false);
  const [use_items, setUseItems] = useState(false);
  const [items_to_use, setItemsToUse] = useState<LottoCombination[] | null>(
    null
  );

  useEffect(() => {
    try {
      fetchHistory(db).then((results) => {
        setHistory(results.reverse());
      });
    } catch (error) {
      console.error("Error fetching history", error);
    } finally {
      if (!use_items) {
        setUpdateHistoryDetails(history);
      }
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

  function useItems(items: LottoCombination[] | null) {
    try {
      if (items) {
        setUpdateHistoryDetails(items);
      }
    } catch (error) {
      console.error("Error using items", error);
    }
  }

  useEffect(() => {
    useItems(items_to_use);
  }, [use_items]);

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

      setSelected((prev) => {
        return prev.filter((x) => x !== item);
      });
    } catch (error) {
      console.error("Error deleting from state", error);
    }
  }

  function swipeRightAction(item: LottoCombination) {
    setSelected((prev) => {
      if (prev.includes(item)) {
        return prev.filter((x) => x !== item);
      } else {
        return [...prev, item];
      }
    });
    setModalVisibility(true);
  }

  function swipeLeftAction(item: LottoCombination) {
    setTemplateModalVisibility(true);

    const revert_to_arr = JSON.parse(item.combination.toString()).map((item: string) =>
      item.split("-")
    );

    setItemsToUse([
      {
        id: item.id,
        category: item.category,
        combination: revert_to_arr,
        input_date: item.input_date,
        created_at: item.created_at,
      },
    ]);
  }

  return (
    <SafeAreaView style={index_styles.container}>
      {history.length === 0 && (
        <View style={{ backgroundColor: "transparent" }}>
          <Text style={{ textAlign: "center", color: "white" }}>
            No history
          </Text>
        </View>
      )}
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
          <>
            {history.length > 0 && (
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
                <Text style={{ color: "white", marginLeft: 5 }}>
                  Select All
                </Text>
              </View>
            )}

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
          </>
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
                setSelected([]);
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
      {/* Use template modal */}
      <Portal>
        <Modal
          visible={template_modal_visible}
          onDismiss={() => {
            setTemplateModalVisibility(false);
          }}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 20,
            margin: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 20 }}>Template</Text>
          <Text style={{ textAlign: "center" }}>
            Do you want to use this template?
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
                setTemplateModalVisibility(false);
                setUseItems(true);
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
                setTemplateModalVisibility(false);
                setUpdateHistoryDetails([]);
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
            dragOffsetFromLeftEdge={10}
            dragOffsetFromRightEdge={10}
            renderRightActions={() => (
              <>
                <View style={history_styles.delete_container}>
                  <FontAwesome name="trash" color={"white"} size={35} />
                </View>
              </>
            )}
            renderLeftActions={() => (
              <View style={history_styles.save_container}>
                <FontAwesome name="save" color={"white"} size={35} />
              </View>
            )}
            onSwipeableOpen={(direction) => {
              console.log("swiped", direction);
              direction === "right"
                ? swipeRightAction(item)
                : swipeLeftAction(item);
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
              <Pressable
                onLongPress={() => {
                  console.log(item.combination);
                }}
                style={{
                  ...history_styles.item_container,
                  width: is_pressed ? "85%" : "95%",
                }}
              >
                <Text style={history_styles.item_text_color}>
                  Game: {item.category}
                </Text>
                <Text style={history_styles.item_text_color}>
                  Combination:{" "}
                  {item.combination.toString()
                    .replace(/[\[\]"]/g, "")
                    .replace(/,\s*/g, ", ")}
                </Text>
                <Text style={history_styles.item_text_color}>
                  Picked Date: {item.input_date}
                </Text>
              </Pressable>
            </View>
          </Swipeable>
        )}
      />
    </SafeAreaView>
  );
}
