import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MapScreen } from "../screens/MapScreen";
import { NewCasePhotoScreen } from "../screens/NewCasePhotoScreen";
import { NewCaseLocationScreen } from "../screens/NewCaseLocationScreen";
import { NewCaseSituationScreen } from "../screens/NewCaseSituationScreen";
import { CaseSuccessScreen } from "../screens/CaseSuccessScreen";


export type RootStackParamList = {
  Map: undefined;
  NewCasePhoto: undefined;
  NewCaseLocation: { photoCount: number };
  NewCaseSituation: { photoCount: number; 
    location: { latitude: number; longitude: number } }; 
  CaseSuccess: { caseId: string }; 
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
      <Stack.Screen name="NewCaseSituation" component={NewCaseSituationScreen}
        options={{ title: "Passo 3/3 - Situação do animal"}}/>
      <Stack.Screen name="CaseSuccess" component={CaseSuccessScreen}
        options={{ title: "Caso registrado com sucesso!"}}/>
    </Stack.Navigator>
  );
};