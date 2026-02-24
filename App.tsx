import React from "react";
import { NavigationContainer } from "@react-navigation/native"; 
import { AppNavigator } from "./src/navigation/AppNavigator";
import { AppStoreProvider } from "./src/store/AppStore";


export default function App() {
  return (
    <AppStoreProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AppStoreProvider>
  );
}

