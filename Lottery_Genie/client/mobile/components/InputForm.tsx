import { Pressable as Button, TextInput } from "react-native";
import { index_styles } from "@/assets/stylesheets/index";
import { View, Text } from "./Themed";

export default function InputForm() {
  return (
    <>
      <View style={index_styles.options_container}>
        <Button onPress={() => console.log("I'm Pressed")}
        style={index_styles.input_options_button}
        >
          <Text style={index_styles.light_grey_text}>Category</Text>
        </Button>
        <Button onPress={() => console.log("Pressed")}
        style={index_styles.input_options_button}
        >
          <Text style={index_styles.light_grey_text}>Select Date</Text>
        </Button>
      </View>
      <View style={index_styles.input_text_container}>
        <TextInput
          placeholder="Enter your combinations"
          keyboardType="numeric"
          style={index_styles.input_text}
        />
        <Button
          onPress={() => console.log("Checking")}
          style={index_styles.input_text_button}
        >
          <Text style={index_styles.light_grey_text}>Check</Text>
        </Button>
      </View>
    </>
  );
}
