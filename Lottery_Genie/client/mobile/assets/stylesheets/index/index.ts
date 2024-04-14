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
  },
  options_container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: Colors.light_blue_green,
    paddingBottom: 20,
  },
  input_text_container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: Colors.light_blue_green,
  },
  input_options_button: {
    height: 40,
    padding: 10,
    marginLeft: 10,
    backgroundColor: Colors.grey,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  input_text_button: {
    width: "20%",
    height: 40,
    backgroundColor: Colors.grey,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  input_text: {
    width: "80%",
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: Colors.light_grey,
    height: 40,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    padding: 10,
  },
  result_container: {
    backgroundColor: Colors.light_blue_green,
    padding: 20,
  },
  winning_combinations_container: {
    backgroundColor: Colors.light_blue_green,
    padding: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  correct_number_container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.green,
  },
  incorrect_number_container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.red,
  },
  white_text: {
    color: Colors.white,
  },
  light_grey_text: {
    color: Colors.light_grey,
  },
  prize_won_text: {
    color: Colors.white,
    textAlign: "center",
    fontSize: 30,
    paddingTop: 20,
  },
});
