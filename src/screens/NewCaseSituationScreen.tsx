import React, { useMemo, useState}  from "react";
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "NewCaseSituation">;

type Situation = "Ferido" | "Perdido" | "Abandonado" | "Maus tratos";

const OPTIONS: Array<{ label: string; value: Situation }> = [
  { label: "Ferido", value: "Ferido" },
  { label: "Perdido", value: "Perdido" },
  { label: "Abandonado", value: "Abandonado" },
  { label: "Maus tratos", value: "Maus tratos" },
];

export const NewCaseSituationScreen = ({ navigation, route }: Props) => {
  const { photoCount, location } = route.params;
  const [selected, setSelected] = useState<Situation | null>(null);
  const [notes, setNotes] = useState("");

  const canSubmit = useMemo(() => {
    return selected !== null;
  }, [selected]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Qual a situação do animal?</Text>
      <Text style={styles.small}>Selecione a opção que melhor descreve a situação do animal.</Text>

      <View style={styles.list}>
        {OPTIONS.map((option) => (
          <Pressable key={option.value} style={styles.row} onPress={() => setSelected(option.value)}>
            <View style={[styles.checkbox, selected === option.value && styles.checkboxOn]} />
            <Text style={styles.rowText}>{option.label}</Text>
          </Pressable>
        ))}
      </View>

      <TextInput 
        placeholder="Observações adicionais (opcional)"
        style={styles.input}
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <Pressable 
        style={[styles.primaryButton, !canSubmit && styles.disable]} 
        onPress={() => {
          if (!canSubmit) return;

          const caseId = Math.random().toString(36).substring(2, 8).toUpperCase();
          Alert.alert(
            "Resumo do caso",
            `Fotos: ${photoCount}\n` +
            `Localização: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}\n` +
            `Situação: ${selected}\n` +
            `Observações: ${notes || "Nenhuma"}`,
            [
              {
                text: "OK",
                onPress: () => navigation.navigate("CaseSuccess", { caseId }),
              },
            ],
          );
        }}
        disabled={!canSubmit}
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
