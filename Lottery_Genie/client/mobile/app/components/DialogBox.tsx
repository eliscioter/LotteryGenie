import React, { useContext } from "react";
import { Modal, Portal } from "react-native-paper";
import { Text, View } from "@/components/Themed";
import { TouchableOpacity } from "react-native";
import { ModalCtx, ModalState, ModalType } from "@/services/shared/modal";
import { LottoCombination } from "@/types/results-type";
import { set } from "zod";

interface DialogBoxProps {
  modal_status: ModalState;
  template_functions?: {
    setUpdateHistoryDetails: (history: LottoCombination[]) => void;
    setUseItems: (use_items: boolean) => void;
  }
}

export default function DialogBox({
  modal_status,
  template_functions,
}: DialogBoxProps) {
  const { setModalStatus } = useContext(ModalCtx);

  const {type, visibility} = modal_status

  function handleYes() {
    if (!template_functions) {
      setModalStatus({ visibility: false, type: null, updated: false });
      console.error("Template functions not provided");
      return;
    }
    
   if (type === ModalType.DELETE) {
      setModalStatus({ visibility: false, type: ModalType.DELETE, updated: true });
   } else if (type === ModalType.TEMPLATE) {
      setModalStatus({ visibility: false, type: ModalType.TEMPLATE, updated: true });
      template_functions.setUseItems(true);

   }
  }

  function handleNo() {
    if (!template_functions) {
      setModalStatus({ visibility: false, type: null, updated: false });
      console.error("Template functions not provided");
      return;
    }
    if (type === ModalType.DELETE) {
      setModalStatus({ visibility: false, type: ModalType.DELETE, updated: true });
   } else if (type === ModalType.TEMPLATE) {
      setModalStatus({ visibility: false, type: ModalType.TEMPLATE, updated: true });
      template_functions.setUpdateHistoryDetails([]);
   }
  }

  const message = () => {
    if (type === ModalType.DELETE) {
      return "Are you sure you want to delete?";
   } else if (type === ModalType.TEMPLATE) {
      return "Are you sure you want to use this template?";
   }
  }
  return (
    <>
      <Portal>
        <Modal
          visible={modal_status.visibility}
          onDismiss={() => setModalStatus({ visibility: false, type: null, updated: false })}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 20,
            margin: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 20 }}>{modal_status.type}</Text>
          <Text style={{ textAlign: "center" }}>{message()}</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={handleYes}
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
              onPress={handleNo}
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
    </>
  );
}
