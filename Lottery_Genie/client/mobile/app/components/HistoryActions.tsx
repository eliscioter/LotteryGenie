import { View, Text } from "@/components/Themed";
import { ModalCtx, ModalType } from "@/services/shared/modal";
import { LottoCombination } from "@/types/results-type";
import { FontAwesome } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import { Checkbox } from "react-native-paper";

export default function HistoryActions({
  setSelected,
  history,
  selected,
}: {
  setSelected: (selected: LottoCombination[]) => void;
  history: LottoCombination[];
  selected: LottoCombination[];
}) {
  const [is_selected_all, setIsSelectedAll] = useState(false);

  const { setModalStatus } = useContext(ModalCtx);

  useEffect(() => {
    if (is_selected_all) {
      setSelected(history);
    } else {
      setSelected([]);
    }
  }, [is_selected_all]);
  return (
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
                setIsSelectedAll(!is_selected_all);
              }}
              uncheckedColor="white"
              color="white"
            />
            <Text style={{ color: "white", marginLeft: 5 }}>Select All</Text>
          </View>
        )}

        {selected.length > 0 && (
          <FontAwesome
            name="trash"
            color={"white"}
            size={25}
            onPress={() => {
              setModalStatus({ visibility: true, type: ModalType.DELETE });
            }}
            style={{ paddingRight: 10 }}
          />
        )}
      </>
    </View>
  );
}
