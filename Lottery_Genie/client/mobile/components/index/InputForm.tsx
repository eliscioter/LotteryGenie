import React, { useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, TextInput, TouchableOpacity } from "react-native";
import { index_styles } from "@/assets/stylesheets/index";
import { View, Text } from "../Themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { lotto_categories } from "@/constants/Categories";
import { Controller, SubmitErrorHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";
import { useCheckCombinationMutation } from "@/services/apis/current-results";
import { LottoDetails } from "@/types/results-type";
import { InputSchema } from "@/validators/current-results";
import { useCurrentResultStore } from "@/services/shared/result";
import { CombCtx } from "@/services/shared/user-comb-ctx";
import Colors from "@/constants/Colors";
import { useSQLiteContext } from "expo-sqlite";
import { addHistory } from "@/services/db/lotto-combinations";
import { UpdateHistoryDetailsCtx } from "@/services/shared/history-details-ctx";

export default function InputForm() {
  const [date, setDate] = useState<string | Date>("Select Date");
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm<LottoDetails>({
    resolver: zodResolver(InputSchema),
  });

  const {
    data: result,
    mutateAsync,
    isPending,
    isError,
  } = useCheckCombinationMutation();

  const inputs = ["", "", "", "", "", ""];

  const [user_input, setUserInput] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const { setResult, clearResult } = useCurrentResultStore();

  const { setInputCombination, clearInputCombination } = useContext(CombCtx);

  const comb_input_ref = useRef<TextInput[]>([]);

  const db = useSQLiteContext();

  const { setUpdateHistoryDetails } = useContext(UpdateHistoryDetailsCtx);

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

  const delete_user_comb_state = () => {
    clearResult();
    clearInputCombination();
  };

  const truncateDate = (date: string) => {
    const index_of_hours = 2;
    const last_index_to_truncate = 1;
    const index_to_truncate =
      date.indexOf(":") - index_of_hours - last_index_to_truncate;

    if (index_to_truncate === -1) {
      return date;
    }

    return date.substring(0, index_to_truncate);
  };

  const handleSubmitCombination = async (data: LottoDetails) => {
    try {
      delete_user_comb_state();
      await mutateAsync(data);
      setUserInput(data.combination);

      const truncated_date = truncateDate(date.toString()).trim();

      await addHistory(
        db,
        data.category,
        data.combination.join("-"),
        truncated_date
      );

      setUpdateHistoryDetails(true);
    } catch (error) {
      console.error("Error submitting data", error);
    }
  };

  const handleError: SubmitErrorHandler<LottoDetails> = (errors) => {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Please fill out all fields",
      visibilityTime: 4000,
      autoHide: true,
    });
  };

  const changeInputFocus = (index: number, text: string) => {
    if (text.length === 2 && index < inputs.length - 1) {
      comb_input_ref.current[index + 1]?.focus();
    }

    if (text.length === 0 && index === 0) {
      comb_input_ref.current[index]?.focus();
    }

    if (text.length === 2 && index === inputs.length - 1) {
      comb_input_ref.current[index]?.blur();
    }
  };

  useEffect(() => {
    if (result) {
      setResult(result);
      setInputCombination(user_input);
    }
  }, [result]);

  useEffect(() => {
    delete_user_comb_state();
  }, [reset]);

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
        {inputs.map((_, index) => (
          <Controller
            key={`combination.${index}`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) {
                    comb_input_ref.current[index] = ref;
                  }
                }}
                onChangeText={(text) => {
                  onChange(text);
                  changeInputFocus(index, text);
                }}
                value={`${value ?? ""}`}
                placeholder="0"
                placeholderTextColor="white"
                selectionColor={"white"}
                keyboardType="number-pad"
                maxLength={2}
                style={index_styles.input_text}
              />
            )}
            name={`combination.${index}`}
          />
        ))}
      </View>
      <View style={index_styles.submit_input_container}>
        <TouchableOpacity
          style={index_styles.clear_text_button}
          onPress={() => {
            reset();
            setDate("Select Date");
            delete_user_comb_state();
          }}
        >
          <Text style={index_styles.light_grey_text}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={index_styles.input_text_button}
          onPress={handleSubmit(handleSubmitCombination, handleError)}
        >
          <Text style={index_styles.light_grey_text}>Check</Text>
        </TouchableOpacity>
      </View>
      {isPending && (
        <View style={index_styles.data_status_input_container}>
          <ActivityIndicator size="large" color={Colors.white} />
        </View>
      )}
      {isError && (
        <View style={index_styles.data_status_input_container}>
          <Text style={{ color: Colors.white }}>Error submitting data</Text>
        </View>
      )}
    </>
  );
}
