import Colors from "@/constants/Colors";
import { View, Text } from "../Themed";
import { index_styles } from "@/assets/stylesheets/index";
import { useCurrentResultStore } from "@/services/shared/result";
import { useContext } from "react";
import { CombCtx } from "@/services/shared/user-comb-ctx";

export default function Result() {
  const { result } = useCurrentResultStore();
  const { input_combination } = useContext(CombCtx);

  // TODO: Transfer this function to the server side
  const responseMessage = () => {
    switch (result?.data?.result.count) {
      case 6:
        return "Congratulations, You won the 1st prize!";
      case 5:
        return "Congratulations, You won the 2nd prize!";
      case 4:
        return "Congratulations, You won the 3rd prize!";
      case 3:
        return "Congratulations, You won the 4th prize!";
      default:
        return "Sorry, You lost!";
    }
  };

  return (
    <View style={index_styles.result_container}>
      {input_combination[0].value && (
        <>
          <Text style={{ color: Colors.light_grey, textAlign: "center" }}>
            You got {result?.result.count} out of 6
          </Text>
          <Text style={{ color: Colors.light_grey, textAlign: "center" }}>
            {responseMessage()}
          </Text>
          <View style={index_styles.winning_combinations_container}>
            {result?.combination.map((num, index) => (
              <View
                key={index}
                style={
                  input_combination.some((inputNum) => inputNum.value === num)
                    ? index_styles.correct_number_container
                    : index_styles.incorrect_number_container
                }
              >
                <Text style={index_styles.white_text}>{num}</Text>
              </View>
            ))}
          </View>
          // TODO: Transfer this to the server side
          {result?.result && result?.result.count >= 3 && (
            <Text style={index_styles.prize_won_text}>
              You won {result?.prize_amount}
            </Text>
          )}
        </>
      )}
    </View>
  );
}
