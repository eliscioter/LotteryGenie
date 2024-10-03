import React, { useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, TextInput, TouchableOpacity } from "react-native";
import { index_styles } from "@/assets/stylesheets/index";
import { View, Text } from "../Themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { lotto_categories } from "@/constants/Categories";
import {
  Controller,
  SubmitErrorHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";
import { useCheckCombinationMutation } from "@/services/apis/current-results";
import { LottoDetails } from "@/types/results-type";
import { InputSchema } from "@/validators/current-results";
import { useCurrentResultStore } from "@/services/shared/result";
import Colors from "@/constants/Colors";
import { useSQLiteContext } from "expo-sqlite";
import { addHistory } from "@/services/db/lotto-combinations";
import { UpdateHistoryDetailsCtx } from "@/services/shared/history-details-ctx";
import { FontAwesome } from "@expo/vector-icons";
import { ModalCtx } from "@/services/shared/modal";

export default function InputForm() {
  const [date, setDate] = useState<string | Date>("Select Date");
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);

  const { control, handleSubmit, reset, setValue } = useForm<LottoDetails>({
    resolver: zodResolver(InputSchema),
    defaultValues: {
      category: "",
      date: new Date(),
      combination: [{ value: Array(6).fill("") }],
    },
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: "combination",
  });

  const {
    data: result,
    mutateAsync,
    isPending,
    isError,
  } = useCheckCombinationMutation();

  const { setResult, clearResult } = useCurrentResultStore();

  const comb_input_ref = useRef<TextInput[]>([]);

  const db = useSQLiteContext();

  const { update_history_details, setUpdateHistoryDetails } = useContext(
    UpdateHistoryDetailsCtx
  );

  const { setModalStatus } = useContext(ModalCtx);

  const displaySelectedDate = (selectedDate: Date | undefined) => {
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
      const truncated_date = truncateDate(date.toString()).trim();

      await mutateAsync(data);

      const combined_combination = data.combination
        .map((item) => item.value)
        .map((value) => value.join("-"));

      await addHistory(db, data.category, combined_combination, truncated_date);

      setUpdateHistoryDetails([] ?? []);
    } catch (error) {
      console.error("Error submitting data", error);
    }
  };

  const handleError: SubmitErrorHandler<LottoDetails> = (errors) => {
    console.error(errors);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Please fill out all fields",
      visibilityTime: 4000,
      autoHide: true,
    });
  };

  const changeInputFocus = (index: number, text: string) => {
    const input_length = 5;
    if (text.length === 2 && index < input_length) {
      comb_input_ref.current[index + 1]?.focus();
    }

    if (text.length === 0 && index === 0) {
      comb_input_ref.current[index]?.focus();
    }

    if (text.length === 2 && index === input_length) {
      comb_input_ref.current[index]?.blur();
    }
  };

  useEffect(() => {
    if (result) {
      setResult(result);
    }
  }, [result]);

  useEffect(() => {
    if (update_history_details.length > 0) {
      const combination_length = (
        update_history_details?.at(0)?.combination as unknown as any[]
      )?.length;

      if (combination_length === 1) {
        for (let i = 0; i < combination_length; i++) {
          let next_index = i + 1;
          remove(next_index);
        }
        displaySelectedDate(
          new Date(update_history_details?.at(0)?.input_date ?? "")
        );
      } else if (combination_length > 1) {
        append({ value: Array(6).fill("") });
        remove(combination_length);
        displaySelectedDate(
          new Date(update_history_details?.at(0)?.input_date ?? "")
        );
      }
    }
  }, [update_history_details]);

  useEffect(() => {
    if (update_history_details.length > 0) {
      const origin_date = new Date(update_history_details?.at(0)?.input_date!);
      const offset_ms = origin_date.getTimezoneOffset() * 60 * 1000;
      const adjusted_date = new Date(origin_date.getTime() - offset_ms);

      setValue("date", adjusted_date);
      
      update_history_details.at(0)?.combination.forEach((item, index) => {
        for (let i = 0; i < item.length; i++) {
          setValue(`combination.${index}.value.${i}`, item.at(i)! ?? "");
        }
      });
    }
  }, [update_history_details]);

  useEffect(() => {
    if (update_history_details.length > 0) {
      setModalStatus({
        visibility: false,
        type: null,
        template_updated: false,
      });
    }
  }, [update_history_details]);

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
                value={update_history_details?.at(0)?.category ?? value}
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
                  displaySelectedDate(new Date(chosen.nativeEvent.timestamp));
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
              ? update_history_details?.at(0)?.input_date ?? date
              : date.toLocaleString().split(",")[0]}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ display: "flex", backgroundColor: "transparent" }}>
        <TouchableOpacity
          onPress={() => {
            append({ value: Array(6).fill("") });
            clearResult();
          }}
        >
          <FontAwesome name="plus-circle" size={18} color="white" />
        </TouchableOpacity>
        {fields.map((field, index_arr) => (
          <View
            style={{ ...index_styles.combinations_container, paddingLeft: 8 }}
            key={field.id}
          >
            {Array.from({ length: 6 }).map((_, input_index) => (
              <Controller
                key={input_index}
                control={control}
                name={`combination.${index_arr}.value.${input_index}`}
                render={({ field: { onChange, onBlur, value } }) => {
                  return (
                    <TextInput
                      key={input_index}
                      ref={(ref) => {
                        if (ref) {
                          comb_input_ref.current[input_index] = ref;
                        }
                      }}
                      onChangeText={(text) => {
                        onChange(text);
                        changeInputFocus(input_index, text);
                      }}
                      onBlur={onBlur}
                      value={value}
                      placeholder="0"
                      placeholderTextColor="white"
                      selectionColor={"white"}
                      keyboardType="number-pad"
                      maxLength={2}
                      style={index_styles.input_text}
                    />
                  );
                }}
              />
            ))}
            {index_arr > 0 && (
              <TouchableOpacity
                onPress={() => {
                  remove(index_arr);
                }}
              >
                <FontAwesome name="minus-circle" size={18} color="white" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      <View style={index_styles.submit_input_container}>
        <TouchableOpacity
          style={index_styles.clear_text_button}
          onPress={() => {
            reset();
            setDate("Select Date");
            delete_user_comb_state();
            setUpdateHistoryDetails([]);
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
