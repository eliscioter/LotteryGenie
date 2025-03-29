import React, { useContext } from "react";
import { Modal, Portal } from "react-native-paper";
import { Text, View } from "@/components/Themed";
import { TouchableOpacity } from "react-native";
import { ModalCtx, ModalState, ModalType } from "@/services/shared/modal";
import { LottoCombination } from "@/types/results-type";
import { useCurrentResultStore } from "@/services/shared/result";
import { UpdateHistoryDetailsCtx } from "@/services/shared/history-details-ctx";
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
  useNavigation,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

type RootStackParamList = {
  "(tabs)": NavigatorScreenParams<TabParamList>;
  modal: undefined;
};

type TabParamList = {
  index: undefined;
  history: undefined;
};

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList>,
  BottomTabNavigationProp<TabParamList>
>;
interface DialogBoxProps {
  modal_status: ModalState;
  template_functions?: {
    setUseItems: (use_items: boolean) => void;
  };
  delete_functions?: {
    setSelected: React.Dispatch<React.SetStateAction<LottoCombination[]>>;
  };
}
export default function DialogBox({
  modal_status,
  template_functions,
  delete_functions,
}: DialogBoxProps) {
  const { setModalStatus } = useContext(ModalCtx);

  const { setUpdateHistoryDetails } = useContext(UpdateHistoryDetailsCtx);

  const { clearResult } = useCurrentResultStore();

  const navigation = useNavigation<NavigationProp>();

  const { type } = modal_status;

  function handleYes() {
    if (!template_functions) {
      setModalStatus({
        visibility: false,
        type: null,
        template_updated: false,
        delete_updated: false,
      });
      console.error("Template functions not provided");
      return;
    }

    if (type === ModalType.DELETE) {
      setModalStatus({
        visibility: false,
        type: ModalType.DELETE,
        delete_updated: true,
      });
    } else if (type === ModalType.TEMPLATE) {
      setModalStatus({
        visibility: false,
        type: ModalType.TEMPLATE,
        template_updated: true,
      });
      template_functions.setUseItems(true);
      clearResult();
      navigation.navigate("(tabs)", { screen: "index" });
    }
  }

  function handleNo() {
    if (!template_functions) {
      setModalStatus({ visibility: false, type: null });
      console.error("Template functions not provided");
      return;
    }
    if (!delete_functions) {
      setModalStatus({ visibility: false, type: null });
      console.error("Delete functions not provided");
      return;
    }
    if (type === ModalType.DELETE) {
      setModalStatus({ visibility: false, type: ModalType.DELETE });
      delete_functions.setSelected([]);
    } else if (type === ModalType.TEMPLATE) {
      setModalStatus({ visibility: false, type: ModalType.TEMPLATE });
      setUpdateHistoryDetails([]);
    }
  }

  const message = () => {
    if (type === ModalType.DELETE) {
      return "Are you sure you want to delete?";
    } else if (type === ModalType.TEMPLATE) {
      return "Are you sure you want to use this template?";
    }
    return "Error";
  };
  return (
    <>
      <Portal>
        <Modal
          visible={modal_status.visibility}
          onDismiss={() => {
            setModalStatus({ visibility: false, type: null });
            setUpdateHistoryDetails([]);
          }}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 20,
            margin: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 20 }}>
            {modal_status.type}
          </Text>
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
