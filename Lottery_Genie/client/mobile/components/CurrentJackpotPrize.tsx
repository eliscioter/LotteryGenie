import React from "react";
import { Text, View } from "./Themed";
import { index_styles } from "@/assets/stylesheets/index";

export default function CurrentJackpotPrize() {
  return (
    <View>
      <View style={index_styles.current_category}>
        <Text style={index_styles.lotto_category}>6/49</Text>
        <Text style={index_styles.lotto_prize}>Php. 15,000,000.00</Text>
        <Text style={index_styles.lotto_category}>6/55</Text>
        <Text style={index_styles.lotto_prize}>Php. 5,000,000.00</Text>
      </View>
    </View>
  );
}
