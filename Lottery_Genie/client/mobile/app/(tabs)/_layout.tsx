import { createContext, useContext, useEffect, useMemo, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, Text } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { UpdateHistoryDetailsCtx } from "@/services/shared/history-details-ctx";
import { useSendFCMTokenMutation } from "@/services/apis/firebase-fcm";
import { getFcmToken } from "@/services/firebase/FCMService";
import { addFCMToken, fetchFCMToken } from "@/services/db/fcm-token";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export const SelectCtx = createContext({
  is_pressed: false,
  setIsPressed: (is_pressed: boolean) => {},
});

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const [is_pressed, setIsPressed] = useState(false);

  const { update_history_details } = useContext(UpdateHistoryDetailsCtx);

  const [history_tab_pressed, setHistoryTabPressed] = useState(false);

  const { mutateAsync, isPending, isSuccess } = useSendFCMTokenMutation();
  useMemo(() => {
    getFcmToken().then(async (fcm_token) => {

      const stored_fcm_token = await fetchFCMToken();

      if(!fcm_token) {
        console.log("FCM token is null or undefined")
        return;
      }

      if (stored_fcm_token !== fcm_token) {
        await addFCMToken(fcm_token);
        await mutateAsync(fcm_token);
      }

    }).catch((error) => {
      console.error("Error sending FCM token: ", error);
    });
  }, []);

  useEffect(() => {
    if (isPending) {
      console.log("Pending...");
    }

    if (isSuccess) {
      console.log("FCM token sent successfully!");
    }
  },[isPending, isSuccess]);


  return (
    <SelectCtx.Provider value={{ is_pressed, setIsPressed }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, true),
          headerStyle: {
            backgroundColor: Colors.forest_green,
          },
          headerTintColor: Colors.white,
          tabBarStyle: {
            backgroundColor: Colors.forest_green,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Lotto",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="gamepad" color={color} />
            ),
            headerRight: () => (
              <Link href="/modal" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="user"
                      size={25}
                      color={Colors.white}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          listeners={{
            tabPress: () => {
              setHistoryTabPressed(!history_tab_pressed);
            },
          }}
          options={{
            title: "History",
            tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
            headerRight: () => {
              return (
                update_history_details.length > 0 &&
                (is_pressed ? (
                  <Pressable
                    onPress={() => {
                      setIsPressed(false);
                    }}
                  >
                    <Text style={{ color: "white", marginRight: 15 }}>
                      Cancel
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => {
                      setIsPressed(true);
                    }}
                  >
                    <Text style={{ color: "white", marginRight: 15 }}>
                      Select
                    </Text>
                  </Pressable>
                ))
              );
            },
          }}
        />
      </Tabs>
    </SelectCtx.Provider>
  );
}
