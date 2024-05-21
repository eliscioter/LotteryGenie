import React, { useState } from "react";
import { TextInput, TouchableOpacity } from "react-native";
import { index_styles } from "@/assets/stylesheets/index";
import { View, Text } from "./Themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { lotto_categories } from "@/constants/Categories";
import { Controller, SubmitErrorHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";


const InputSchema = z.object({
  category: z.string(),
  date: z.date(),
  input: z.array(z.string().min(1).max(2)),
});

type InputType = z.infer<typeof InputSchema>;

export default function InputForm() {
  const [date, setDate] = useState<string | Date>("Select Date");
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  // const [value, setValue] = useState(null);
  const {
    control,
    handleSubmit,
    reset,
  } = useForm<InputType>({ resolver: zodResolver(InputSchema) });

  const displaySelectedDate = (_: any, selectedDate: Date | undefined) => {
    if (selectedDate === undefined) {
      setShow(false);
      return;
    }
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  const inputs = ["", "", "", "", "", ""];

  // console.log(inputs);

  // const refs = Array(inputs.length)
  //   .fill(null)
  //   .map(() => React.createRef<TextInput>());
  // useEffect(() => {
  //   console.log(inputs.length, "outer", inputs.some((input) => {
  //     console.log(input, "middle")
  //     return input.length === 2}));
  //   if (inputs.some((input) => input.length === 2)) {
  //     const nextInputIndex =
  //       inputs.findIndex((input) => {
  //         console.log(input, "outer outer");
  //         return input.length === 2}) + 1;

  //       console.log(nextInputIndex);
  //     if (nextInputIndex < inputs.length) {
  //       console.log(nextInputIndex, " inner");
  //       refs[nextInputIndex].current?.focus();
  //     }
  //   }

  // }, [inputs, refs]);

  const handleError: SubmitErrorHandler<InputType> = (errors) => {
    console.log(errors);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Please fill out all fields",
      visibilityTime: 4000,
      autoHide: true,
    });
  };
  return (
    <>
      <View style={index_styles.options_container}>
        <View style={index_styles.transparent_background}>
          <Controller
            key="category"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DropDownPicker
                open={open}
                value={value}
                items={lotto_categories.map((category) => ({
                  label: category,
                  value: category,
                }))}
                setOpen={setOpen}
                setValue={(chosen) => onChange(chosen)}
                onChangeValue={(chosen) => onChange(chosen)}
                placeholder={"Category"}
                style={index_styles.input_options_picker}
                textStyle={index_styles.light_grey_text}
                theme="DARK"
              />
            )}
            name="category"
          />
        </View>
        {show && (
          <Controller
            key="date"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DateTimePicker
                testID="dateTimePicker"
                onChange={(chosen) => {
                  onChange(new Date(chosen.nativeEvent.timestamp));
                  displaySelectedDate(
                    chosen,
                    new Date(chosen.nativeEvent.timestamp)
                  );
                }}
                value={value ?? new Date()}
                mode="date"
                is24Hour={true}
              />
            )}
            name="date"
          />
        )}
        <TouchableOpacity
          onPress={showDatePicker}
          style={index_styles.input_options_button}
        >
          <Text style={index_styles.light_grey_text}>
            {typeof date === "string"
              ? date
              : date.toLocaleString().split(",")[0]}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={index_styles.combinations_container}>
        {inputs.map((input, index) => (
          <Controller
            key={index}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                key={index}
                onChangeText={onChange}
                value={`${value ?? 0}`}
                placeholder="0"
                selectionColor={"white"}
                keyboardType="numeric"
                maxLength={2}
                style={index_styles.input_text}
              />
            )}
            name={`input.${index}`}
          />
        ))}
      </View>
      <View style={index_styles.submit_input_container}>
        <TouchableOpacity
          style={index_styles.clear_text_button}
          onPress={() => {
            reset();
            setDate("Select Date");
          }}
        >
          <Text style={index_styles.light_grey_text}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={index_styles.input_text_button}
          onPress={handleSubmit((data) => {
            console.log(data);
          }, handleError)}
        >
          <Text style={index_styles.light_grey_text}>Check</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
