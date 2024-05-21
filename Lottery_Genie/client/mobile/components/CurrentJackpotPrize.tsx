import React from "react";
import { Text, View } from "./Themed";
import { index_styles } from "@/assets/stylesheets/index";
import { useCurrentResults } from "@/services/apis/current-results";

export default function CurrentJackpotPrize() {
  const { data: results, isLoading, isError } = useCurrentResults();

  
  return (
    <View>
      {!results ? (
        <View>
          <Text style={index_styles.lotto_category}>No Results</Text>
        </View>
      ) : (
        <View style={index_styles.current_category}>
          {results.data.map((result, index) => (
            <View style={{backgroundColor: "transparent", paddingBottom: 10}} key={index}>
              <Text style={index_styles.lotto_category}>{result.category}</Text>
              <Text style={index_styles.lotto_prize}>{result.prize}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
