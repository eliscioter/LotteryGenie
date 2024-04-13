import { Button, TextInput } from "react-native";
import { View } from "./Themed";
import { index_styles } from "@/assets/stylesheets/index";

export default function InputForm() {
    return (
       <View style={index_styles.input_form_container}>
         <View>
        <Button title="Category" onPress={() => {}} />
        <Button title="DAte" onPress={() => {}} />
        </View>
        <View>
            <TextInput />
            <Button title="Check" onPress={() => {}} />
        </View>
       </View>
    );
}