import Colors from "@/constants/Colors";
import { View, Text } from "../Themed";
import { index_styles } from "@/assets/stylesheets/index";
import { useCurrentResultStore } from "@/services/shared/result";
import { Fragment, ReactNode } from "react";

export default function Result() {
  const { result } = useCurrentResultStore();

  const data = result?.data;

  const displayResult = (index: number): ReactNode => {
    return data?.at(index)?.result.user_combination?.map((val, index_inner) => (
      <View
        key={index_inner}
        style={
          data.at(index)?.combination.includes(val)
            ? index_styles.correct_number_container
            : index_styles.incorrect_number_container
        }
      >
        <Text style={index_styles.white_text}>{val}</Text>
      </View>
    ));
  };

  return (
    <View style={index_styles.result_container}>
      {data &&
        data.length > 0 &&
        data?.map((value, index) => (
          <Fragment key={index}>
            <Text style={{ color: Colors.light_grey, textAlign: "center" }}>
              You got {value.result.count} out of 6
            </Text>

            <Text style={{ color: Colors.light_grey, textAlign: "center" }}>
              {value.prize_amount.message}
            </Text>
            <View style={index_styles.winning_combinations_container}>
              {displayResult(index)}
            </View>
          </Fragment>
        ))}
    </View>
  );
}
