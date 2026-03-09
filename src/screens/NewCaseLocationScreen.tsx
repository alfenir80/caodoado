import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAppStore } from "../store/AppStore";

type Props = NativeStackScreenProps<RootStackParamList, "NewCaseLocation">;

export function NewCaseLocationScreen({ navigation }: Props) {
  const { state, dispatch } = useAppStore();
  const photoCount = state.draft.photoCount;

  const lat = state.draft.location.latitude;
  const lng = state.draft.location.longitude;

  const hasValidLocation = lat !== 0 && lng !== 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione a localização do animal</Text>
      <Text style={styles.small}>Fotos enviadas: {photoCount}</Text>

      <View style={styles.mapBox}>
        <Text style={styles.mapTitle}>[MAPA SIMULADO]</Text>
        <Text style={styles.small}>Pin ajustável (mock)</Text>
        <Text style={styles.small}>
          {hasValidLocation
            ? `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
            : "Nenhuma localização selecionada"}
        </Text>
      </View>

      <View style={{flex: 1, justifyContent: "flex-end"}}/>
      
      <Pressable style={styles.secondaryBtn} 
        onPress={
          () => dispatch({ type: "draft/setLocation", 
            latitude: -23.55052, longitude: -46.633308 }) 
        }>
        <Text style={styles.secondaryTxt}>Usar localização atual</Text>
      </Pressable>

      <View style={{ flex: 1}}/>
      
      <Pressable style={styles.primaryBtn} 
        disabled={!hasValidLocation}
        onPress={() => navigation.navigate("NewCaseSituation", 
        { photoCount, location: { latitude: lat, longitude: lng } })  }>
        <Text style={styles.primaryTxt}>Continuar</Text>
      </Pressable>

      {!hasValidLocation && <Text style={styles.hint}>
        * Se continuar sem selecionar uma localização válida, a localização do caso será definida como (0,0),
         o que não é desejável. Por favor, selecione uma localização antes de continuar.
         </Text>}

      <Text style={styles.hint}>* Esta é uma simulação. Em um app real, aqui seria exibido um mapa interativo para selecionar a localização do animal.</Text>
    </View>
  );



}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16,gap: 12 },
  title: { fontSize: 16, fontWeight: "800", color: "#222" },  
  small: { color: "#666",},
  
  mapBox: {
    flex: 1,
    minHeight: 320,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 14,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  mapTitle: { color: "#555", fontWeight: "900" },

  primaryBtn: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: "#444",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryTxt: { color: "#fff", fontWeight: "800" },

  secondaryBtn: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#777",  
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryTxt: { color: "#222", fontWeight: "800" },

  hint: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
    marginTop: 6,
  },
 }
);