import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MapScreen } from "../screens/MapScreen";

export type RootStackParamList = {
  Map: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Map" component={MapScreen} 
        options={{ title: "Mapa"}}/>
    </Stack.Navigator>
  );
};