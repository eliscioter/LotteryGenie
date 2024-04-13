import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const index_styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingTop: 20,
    backgroundColor: Colors.forest_green,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.white,
    paddingBottom: 20,
  },
  current_category: {
    backgroundColor: Colors.forest_green,
  },
  lotto_category: {
    color: Colors.light_grey,
    fontSize: 20,
    paddingLeft: 20,
  },
  lotto_prize: {
    color: Colors.white,
    textAlign: "center",
    fontSize: 30,
    paddingBottom: 20,
  },
  input_form_container: {
    height: "100%",
    padding: 20,
    backgroundColor: Colors.light_blue_green,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  }
});
