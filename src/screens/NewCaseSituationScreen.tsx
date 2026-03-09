import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAppStore } from "../store/AppStore";

type Props = NativeStackScreenProps<RootStackParamList, "NewCaseSituation">;

type Situation = "Ferido" | "Perdido" | "Abandonado" | "Maus tratos";

const OPTIONS: Array<{ label: string; value: Situation }> = [
  { label: "Ferido", value: "Ferido" },
  { label: "Perdido", value: "Perdido" },
  { label: "Abandonado", value: "Abandonado" },
  { label: "Maus tratos", value: "Maus tratos" },
];

export const NewCaseSituationScreen = ({ navigation }: Props) => {
 
  const { state, dispatch } = useAppStore();

  const selected = state.draft.situation;
  const notes = state.draft.notes;

  const canSubmit = selected !== null;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const newID = Math.random().toString(36).substring(2, 9);
    dispatch({ type: "cases/addFormDraft", preGenerateID: newID });
    navigation.navigate("CaseSuccess", { caseId: newID });
  }
 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Qual a situação do animal?</Text>
      <Text style={styles.small}>Selecione a opção que melhor descreve a situação do animal.</Text>

      <View style={styles.list}>
        {OPTIONS.map((option) => {
          const isSelected = selected === option.value;
          return (
            <Pressable 
              key={option.value} 
              style={styles.row} 
              onPress={() => dispatch({ type: "draft/setSituation", situation: option.value })}>
              <View style={[styles.checkbox, isSelected && styles.checkboxOn]} />
              <Text style={styles.rowText}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <TextInput 
        placeholder="Observações adicionais (opcional)"
        style={styles.input}
        value={notes}
        onChangeText={(text) => dispatch({ type: "draft/setNotes", notes: text })}
        multiline
      />

      <Pressable 
        style={[styles.primaryButton, !canSubmit && styles.disable]}
        disabled={!canSubmit}
        onPress={handleSubmit}
      >
        <Text style={styles.primaryText}>Enviar caso</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },

  small: {
    fontSize: 14,
    color: "#666",
  },

  list: {
    gap: 8,
    marginTop: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,        
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },

  checkboxOn: {
    backgroundColor: "#444",
  },

  rowText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#222",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    marginTop: 16,
    height: 100,
    textAlignVertical: "top",
  },
  
  primaryButton: {
    backgroundColor: "#444",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: "auto",
  },

  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  disable: {
    backgroundColor: "#ccc",
  },

  hint: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
});
