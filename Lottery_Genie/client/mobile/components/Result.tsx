import Colors from "@/constants/Colors";
import { View, Text } from "./Themed";
import { index_styles } from "@/assets/stylesheets/index";

export default function Result() {
  return (
    <View style={index_styles.result_container}>
      <Text style={{ color: Colors.light_grey, textAlign: "center"}}>
        You got 5 out of 6. Congratulations,You won!
      </Text>
      <View style={index_styles.winning_combinations_container}>
        <View style={index_styles.correct_number_container}>
          <Text style={index_styles.white_text}>10</Text>
        </View>
        <View style={index_styles.correct_number_container}>
          <Text style={index_styles.white_text}>10</Text>
        </View>
        <View style={index_styles.correct_number_container}>
          <Text style={index_styles.white_text}>10</Text>
        </View>
        <View style={index_styles.correct_number_container}>
          <Text style={index_styles.white_text}>10</Text>
        </View>
        <View style={index_styles.incorrect_number_container}>
          <Text style={index_styles.white_text}>10</Text>
        </View>
        <View style={index_styles.correct_number_container}>
          <Text style={index_styles.white_text}>10</Text>
        </View>
      </View>
      <Text style={index_styles.prize_won_text}>You won {'\u20B1'} 15,000,000</Text>
    </View>
  );
}
