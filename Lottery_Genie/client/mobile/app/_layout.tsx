import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Suspense, useEffect, useState } from "react";

import { useColorScheme } from "@/components/useColorScheme";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/config/query-client";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import Toast from "react-native-toast-message";
import { View, Text } from "react-native";
import { SQLiteProvider } from "expo-sqlite";
import { db_name, loadDatabase } from "@/services/db/lotto-combinations";
import { UpdateHistoryDetailsCtx } from "@/services/shared/history-details-ctx";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { LottoCombination } from "@/types/results-type";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  useReactQueryDevTools(queryClient);

  const [init_db, setInitDb] = useState(false);

  const [update_history_details, setUpdateHistoryDetails] = useState<LottoCombination[]>([]);

  useEffect(() => {
    if (!init_db) {
      loadDatabase()
        .then((res) => {
          if (res) {
            setInitDb(true);
          }
        })
        .catch((error) => {
          console.error("Error loading database", error);
          setInitDb(false);
        });
    }
  }, [init_db]);

  return (
    <>
      <Suspense
        fallback={
          <View>
            <Text>Loading...</Text>
          </View>
        }
      >
        <SQLiteProvider databaseName={db_name}>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <QueryClientProvider client={queryClient}>
              <UpdateHistoryDetailsCtx.Provider
                value={{ update_history_details, setUpdateHistoryDetails }}
              >
                <GestureHandlerRootView>
                  <PaperProvider>
                    <Stack>
                      <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="modal"
                        options={{ presentation: "modal" }}
                      />
                    </Stack>
                  </PaperProvider>
                </GestureHandlerRootView>
              </UpdateHistoryDetailsCtx.Provider>
            </QueryClientProvider>
          </ThemeProvider>
          <Toast />
        </SQLiteProvider>
      </Suspense>
    </>
  );
}
