import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MapScreen } from "../screens/MapScreen";
import { NewCasePhotoScreen } from "../screens/NewCasePhotoScreen";
import { NewCaseLocationScreen } from "../screens/NewCaseLocationScreen";


export type RootStackParamList = {
  Map: undefined;
  NewCasePhoto: undefined;
  NewCaseLocation: { photoCount: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Map" component={MapScreen} 
        options={{ title: "Mapa"}}/>
      <Stack.Screen name="NewCasePhoto" component={NewCasePhotoScreen}
        options={{ title: "Passo 1/3 - Foto do animal"}}/>
      <Stack.Screen name="NewCaseLocation" component={NewCaseLocationScreen}
        options={{ title: "Passo 2/3 - Localização do animal"}}/>
    </Stack.Navigator>
  );
};