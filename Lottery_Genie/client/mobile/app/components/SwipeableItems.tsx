import { history_styles } from "@/assets/stylesheets/history/history";
import { FontAwesome } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import { Swipeable } from "react-native-gesture-handler";
import { Checkbox } from "react-native-paper";
import { LottoCombination } from "@/types/results-type";
import { useContext, useEffect, useMemo, useState } from "react";
import { db_table } from "@/services/db/lotto-combinations";
import { useSQLiteContext } from "expo-sqlite";
import { ModalCtx, ModalType } from "@/services/shared/modal";

export default function SwipeableItems({
  item,
  is_pressed,
  selectState,
  setUpdateHistoryDetails,
  useItemsState,
  historyState,
}: {
  item: LottoCombination;
  is_pressed: boolean;
  selectState: {
    selected: LottoCombination[];
    setSelected: React.Dispatch<React.SetStateAction<LottoCombination[]>>;
  };
  setUpdateHistoryDetails: (history: LottoCombination[]) => void;
  useItemsState: {
    use_items: boolean;
    setUseItems: (use_items: boolean) => void;
  };
  historyState: {
    history: LottoCombination[];
    setHistory: React.Dispatch<React.SetStateAction<LottoCombination[]>>;
  };
}) {
  const db = useSQLiteContext();

  const { modal_status, setModalStatus } = useContext(ModalCtx);

  function deleteItems() {
    try {
      selectState.selected.map(async (item: LottoCombination) => {
        deleteFromState(item);
        await db.runAsync(`DELETE FROM ${db_table} WHERE id = ?`, item.id);
      });
    } catch (error) {
      console.error("Error deleting items", error);
    } finally {
      setUpdateHistoryDetails(historyState.history);
      setModalStatus({ visibility: false, type: null, delete_updated: false });
    }
  }
  if (modal_status.delete_updated) {
    useEffect(() => {
      deleteItems();
    }, [modal_status.delete_updated]);
  }
  function useItems(items: LottoCombination[] | null) {
    try {
      if (items) {
        setUpdateHistoryDetails(items);
      }
    } catch (error) {
      console.error("Error using items", error);
    }
  }

  function deleteFromState(item: LottoCombination) {
    try {
      historyState.setHistory((prev: LottoCombination[]) => {
        return prev.filter((x) => x !== item);
      });

      selectState.setSelected((prev) => {
        return prev.filter((x) => x !== item);
      });
    } catch (error) {
      console.error("Error deleting from state", error);
    }
  }

  function swipeRightAction(item: LottoCombination) {
    selectState.setSelected((prev) => {
      if (prev.includes(item)) {
        return prev.filter((x) => x !== item);
      } else {
        return [...prev, item];
      }
    });
    setModalStatus({ visibility: true, type: ModalType.DELETE });
  }

  function swipeLeftAction(item: LottoCombination) {
    setModalStatus({ visibility: true, type: ModalType.TEMPLATE });

    const revert_to_arr = JSON.parse(item.combination.toString()).map(
      (item: string) => item.split("-")
    );

    useItems([
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
    <Swipeable
      ref={(ref) => {
        if (modal_status.visibility === true) {
          ref?.close();
          useItemsState.setUseItems(false);
        }
      }}
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
        direction === "right" ? swipeRightAction(item) : swipeLeftAction(item);
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
            status={
              selectState.selected.includes(item) ? "checked" : "unchecked"
            }
            uncheckedColor="white"
            onPress={() => {
              selectState.setSelected((prev) => {
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
            {item.combination
              .toString()
              .replace(/[\[\]"]/g, "")
              .replace(/,\s*/g, ", ")}
          </Text>
          <Text style={history_styles.item_text_color}>
            Picked Date: {item.input_date}
          </Text>
        </Pressable>
      </View>
    </Swipeable>
  );
}
