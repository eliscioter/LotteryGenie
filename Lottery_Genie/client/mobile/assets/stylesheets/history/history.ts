import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";
export const history_styles = StyleSheet.create({
  item_container: {
    backgroundColor: Colors.light_blue_green,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
  },
  item_text_color: {
    color: Colors.white,
  },
  delete_container: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: Colors.red,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
  },
  save_container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: Colors.grey,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
  }
});
