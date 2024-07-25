import Colors from "@/constants/Colors";
import { View, Text } from "./Themed";
import { index_styles } from "@/assets/stylesheets/index";
import { useCurrentResultStore } from "@/services/shared/result";

export default function Result({ input }: { input: string[] }) {
  const { result } = useCurrentResultStore();

  const numbersGotRight = result?.combination.filter((num) =>
    input.includes(num)
  ).length;

  const responseMessage = () => {
    switch (numbersGotRight) {
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
      {input[0] && (
        <>
          <Text style={{ color: Colors.light_grey, textAlign: "center" }}>
            You got {numbersGotRight} out of 6
          </Text>
          <Text style={{ color: Colors.light_grey, textAlign: "center" }}>{responseMessage()}</Text>
          <View style={index_styles.winning_combinations_container}>
            {result?.combination.map((num, index) => (
              <View
                key={index}
                style={
                  input.some((inputNum) => inputNum === num)
                    ? index_styles.correct_number_container
                    : index_styles.incorrect_number_container
                }
              >
                <Text style={index_styles.white_text}>{num}</Text>
              </View>
            ))}
          </View>
          <Text style={index_styles.prize_won_text}>You won ₱ 15,000,000</Text>
        </>
      )}
    </View>
  );
}
