import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "CaseSuccess">;

export const CaseSuccessScreen: React.FC<Props> = ({ route, navigation }) => {
  const { caseId } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Text style={styles.check}>✓</Text>
      </View>
      <Text style={styles.title}>Caso registrado com sucesso!</Text>
      <Text style={styles.subtitle}>O caso foi registrado com o ID: {caseId}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.info}>Anote esse ID para acompanhar o caso ou para fornecer informações adicionais no futuro.</Text>
      </View>

      <Pressable style={styles.primaryBtn} onPress={() => navigation.popToTop()}>
        <Text style={styles.primaryBtnText}>Voltar para o mapa</Text>
      </Pressable>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  iconBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#999",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  check: {
    color: "#444",
    fontSize: 50,
    fontWeight: "bold",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },

  infoBox: {
    backgroundColor: "#999",
    padding: 15,
    borderRadius: 8,
    marginBottom: 30,
    width: "100%",
    borderWidth: 1,
    borderColor: "#888",  
  },

  info: {
    fontSize: 16,
    color: "#333",
  },

  primaryBtn: {
    backgroundColor: "#444",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },

  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});