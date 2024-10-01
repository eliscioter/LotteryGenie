import { Text, View } from "@/components/Themed";
import { index_styles } from "@/assets/stylesheets/index";
import { useSQLiteContext } from "expo-sqlite";
import { useContext, useEffect, useState } from "react";
import { LottoCombination } from "@/types/results-type";
import { db_table, fetchHistory } from "@/services/db/lotto-combinations";
import { history_styles } from "@/assets/stylesheets/history/history";
import { FlatList, Pressable, SafeAreaView } from "react-native";
import { UpdateHistoryDetailsCtx } from "@/services/shared/history-details-ctx";
import { Swipeable } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { SelectCtx } from "./_layout";
import { Checkbox, Modal } from "react-native-paper";
import DialogBox from "../components/DialogBox";
import SwipeableItems from "../components/SwipeableItems";
import HistoryActions from "../components/HistoryActions";
import { ModalCtx, ModalState } from "@/services/shared/modal";

export default function HistoryScreen() {
  const db = useSQLiteContext();
  const [history, setHistory] = useState<LottoCombination[]>([]);
  const [selected, setSelected] = useState<LottoCombination[]>([]);
  const [use_items, setUseItems] = useState(false);
  const [modal_status, setModalStatus] = useState<ModalState>({
    visibility: false,
    type: null,
    updated: false,
  });

  const { update_history_details, setUpdateHistoryDetails } = useContext(
    UpdateHistoryDetailsCtx
  );
  const { is_pressed } = useContext(SelectCtx);

  useEffect(() => {
    try {
      fetchHistory(db).then((results) => {
        setHistory(results.reverse());
      });
    } catch (error) {
      console.error("Error fetching history", error);
    } finally {
      console.log(modal_status.updated, " modal_status.updated for history");
      if (!use_items) {
        setUpdateHistoryDetails(history);
      }
    }
  }, [update_history_details, modal_status.updated]);

  console.log(use_items, "use_items *********");

  return (
    <SafeAreaView style={index_styles.container}>
      {history.length === 0 && (
        <View style={{ backgroundColor: "transparent" }}>
          <Text style={{ textAlign: "center", color: "white" }}>
            No history
          </Text>
        </View>
      )}
      <ModalCtx.Provider value={{ modal_status, setModalStatus }}>
        {is_pressed && (
          <HistoryActions
            setSelected={setSelected}
            history={history}
            selected={selected}
          />
        )}
        <DialogBox
          modal_status={modal_status}
          template_functions={{
            setUpdateHistoryDetails,
            setUseItems,
          }}
        />
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SwipeableItems
              item={item}
              is_pressed={is_pressed}
              setUpdateHistoryDetails={setUpdateHistoryDetails}
              historyState={{ history, setHistory }}
              selectState={{ selected, setSelected }}
              useItemsState={{ use_items, setUseItems }}
            />
          )}
        />
      </ModalCtx.Provider>
    </SafeAreaView>
  );
}
