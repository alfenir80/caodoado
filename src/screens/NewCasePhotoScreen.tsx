import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "NewCasePhoto">;

export function NewCasePhotoScreen({ navigation }: Props) {
  const [photoCount, setPhotoCount] = useState(0);

  const addMockPhoto = () => setPhotoCount((c) => Math.min(c + 1, 3));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tire uma foto do animal</Text>
      <View style={styles.previewBox}>
        {photoCount === 0 ? (
          <>
            <Text style={styles.previewTitle}>Nenhuma foto adicionada</Text>
            <Text style={styles.small}>Toque no botão abaixo para simular a adição de uma foto</Text>
          </>
        ) : (
          <Text style={styles.previewTitle}>{photoCount} foto(s) adicionada(s)</Text>
        )}
      </View>
      <View style={styles.row}>
        <Pressable style={styles.primaryBtn} onPress={addMockPhoto}>
          <Text style={styles.primaryTxt}>Adicionar Foto</Text>
        </Pressable>
        <Pressable style={styles.secondBtn} onPress={addMockPhoto}>
          <Text style={styles.secondTxt}>Galeria</Text>
        </Pressable>
      </View>

      <View style={{flex: 1, justifyContent: "flex-end"}}/>
      
        <Pressable style={[styles.primaryBtn, photoCount === 0 && styles.disable]}
          disabled={photoCount === 0}
          onPress={() => navigation.goBack()}>
          <Text style={styles.primaryTxt}>Continuar</Text>
        </Pressable>

        <Text style={styles.hint}>* Esta é uma simulação. Em um app real, aqui seria aberta a câmera ou galeria do dispositivo.</Text>
      
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16,gap: 12 },
  title: { fontSize: 16, fontWeight: "800", color: "#222" },

  previewBox: {
    flex: 1,
    minHeight: 320,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 14,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  previewTitle: { color: "#555", fontWeight: "900" },
  small: { color: "#555"},

  row: {
    flexDirection: "row",
    gap: 10,
  },

  primaryBtn: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: "#444",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryTxt: { color: "#fff", fontWeight: "800" },

  secondBtn: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#777",
    alignItems: "center",
    justifyContent: "center",
  },
  secondTxt: { color: "#222", fontWeight: "800" },

  disable: {opacity: 0.35},

  hint: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
    marginTop: 8,
  }, 
}); 
