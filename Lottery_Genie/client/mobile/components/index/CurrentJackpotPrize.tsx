import React from "react";
import { Text, View } from "../Themed";
import { index_styles } from "@/assets/stylesheets/index";
import { useCurrentResults } from "@/services/apis/current-results";
import { ActivityIndicator } from "react-native";
import Colors from "@/constants/Colors";

export default function CurrentJackpotPrize() {
  const { data: results, isLoading, error } = useCurrentResults();

  return (
    <View>
      {!results && !isLoading ? (
        <View>
          <Text style={index_styles.data_status}>No Results</Text>
        </View>
      ) : (
        <View style={index_styles.current_category}>
          {results?.data.map((result, index) => (
            <View
              style={{ backgroundColor: "transparent", paddingBottom: 10 }}
              key={index}
            >
              <Text style={index_styles.lotto_category}>{result.category}</Text>
              <Text style={index_styles.lotto_prize}>{result.prize}</Text>
            </View>
          ))}
        </View>
      )}
      {isLoading && (
        <View style={{backgroundColor: Colors.forest_green, padding: 10}}>
          <ActivityIndicator size="large" color={Colors.white} />
        </View>
      )}
      {error ? (
        <View style={{backgroundColor: Colors.forest_green}}>
          <Text style={index_styles.data_status}>Error Fetching Results</Text>
        </View>
      ) : null}
    </View>
  );
}
