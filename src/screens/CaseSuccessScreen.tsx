import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors, typography, spacing, borderRadius } from "./themes";
import { Button } from "../components/UI";

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

      <Button
        label="Voltar para o mapa"
        onPress={() => navigation.popToTop()}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    backgroundColor: colors.background,
  },

  iconBox: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  check: {
    color: colors.primary,
    fontSize: 50,
    fontWeight: typography.fontWeight.black,
  },

  title: {
    fontSize: typography.fontSize.large,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.md,
    textAlign: "center",
    color: colors.textPrimary,
  },

  subtitle: {
    fontSize: typography.fontSize.base,
    textAlign: "center",
    marginBottom: spacing.xl,
    color: colors.textSecondary,
  },

  infoBox: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
    width: "100%",
    borderWidth: 1,
    borderColor: colors.border,  
  },

  info: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    lineHeight: 22,
    textAlign: "center",
  },
});