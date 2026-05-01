import React, {  useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput,
    Alert, ScrollView, 
    } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { File, Directory, Paths} from "expo-file-system/next";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAppStore } from "../store/AppStore";
import { colors, typography, spacing, borderRadius, shadows, zIndex } from "./themes";
import { CaseItem, CaseStatus } from '../types/case';
import { Badge, Button, StyledInput  } from  "../components/UI";

type Props = NativeStackScreenProps<RootStackParamList, "NewCaseSituation">;

type Situation = "Ferido" | "Perdido" | "Abandonado" | "Maus tratos";

const OPTIONS: Array<{ label: string; value: Situation, icon: string, description: string }> = [
  { label: "Ferido",      value: "Ferido",      icon: "🩹", description: "Animal com ferimentos visíveis" },
  { label: "Perdido",     value: "Perdido",     icon: "🔍", description: "Animal sem identificação ou desorientado" },
  { label: "Abandonado",  value: "Abandonado",  icon: "💔", description: "Animal claramente deixado para trás" },
  { label: "Maus tratos", value: "Maus tratos", icon: "⚠️", description: "Indícios de abuso ou negligência" },

];

function generateID() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// Copia uma foto da URI temporária (câmera/galeria) para o diretório
// permanente do app — sem isso a URI pode expirar e a foto sumir
// Usa a nova API do expo-file-system/next (File + Directory + Paths).
async function copyPhotoToPermanentStorage(
  tempUri: string,
  caseId: string,
  index: number
): Promise<string> {
  // Cria (ou reutiliza) o diretório: <documentDirectory>/cases/<caseId>/
  const dir = new Directory(Paths.document, `cases/${caseId}`);
  if (!(dir.exists)){
    dir.create();
  }

  // Copia o arquivo temporário para o destino permanente
  const source = new File(tempUri);
  const dest = new File(dir.uri, `photo_${index}.jpg`);
  source.copy(dest);
  return dest.uri;
}

export default function NewCaseSituationScreen({ navigation, route }: Props) {
  const { state, dispatch } = useAppStore();
  const [submitting, setSubmitting] = useState(false);
  const selected = state.draft.situation;
  const notes = state.draft.notes;
  const canSubmit = !!selected;

  const handleSubmit = async () => {
    if (!canSubmit) {
      Alert.alert("Seleção obrigatória", "Por favor, selecione uma situação para continuar.");
      return;
    }

    setSubmitting(true);

    try {
      // Gera um ID único para o caso
      const caseId = generateID();

      // Copia as fotos para armazenamento permanente e obtém as novas URIs
      const permanentPhotoUris = await Promise.all(
        state.draft.photoUris.map((uri, index) => copyPhotoToPermanentStorage(uri, caseId, index))
      );

      // Cria o objeto do caso
      const newCase: CaseItem = {
        id: caseId, 
        situation: selected!,
        notes: notes,
        photoUris: permanentPhotoUris,
        status: "ABERTO",
        createdAtISO: new Date().toISOString(),
        location: state.draft.location!,
        photosCount: permanentPhotoUris.length,
      };

      dispatch({ type: "cases/add", newCase });
      // Limpa o rascunho
      dispatch({ type: "draft/reset" });

      // Navega para a tela de detalhes do caso recém-criado
      navigation.replace("CaseDetails", { caseId });
    } catch (error) {
      console.error("Erro ao criar caso:", error);
      Alert.alert("Erro", "Ocorreu um erro ao criar o caso. Por favor, tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} 
        style={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Qual a situação do animal?</Text>
        </View>

        <Text style={styles.subtitle}>
          Selecione a opção que melhor descreve a situação do animal encontrado.
        </Text>

        <View style={styles.optionsList}>
          {OPTIONS.map((option) => {
            const isSelected = selected === option.value;
            return (
              <Pressable
                key={option.value}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                onPress={() => dispatch({ type: "draft/setSituation", situation: option.value })}
                disabled={submitting}
              >
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <View>
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>{option.label}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <StyledInput
          label="Notas adicionais (opcional)"
          placeholder="Ex: O animal parece estar com fome"
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={(text) => dispatch({ type: "draft/setNotes", notes: text })}
          style={styles.textArea}
          editable={!submitting}
        />

        <Button
          label="Criar caso"
          onPress={handleSubmit}
          disabled={!canSubmit || submitting}
          loading={submitting}
          style={styles.button}
        />
      </ScrollView>
    </SafeAreaView>
  );
} 

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scroll: {
    flex: 1,
  },

  container: {
    flex: 1,
    padding: spacing.base,
    gap: spacing.base,
    paddingBottom: spacing.xxxl,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  title: {
    fontSize: typography.fontSize.large,
    fontWeight: typography.fontWeight.extrabold,
    color: colors.textPrimary,
  },

  subtitle: {
    fontSize: typography.fontSize.medium,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  optionsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  optionCard: {
    flex: 1,
    flexDirection: "row",
    minWidth: "45%",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 2,
    alignItems: "center",
    gap: spacing.md,
  },

  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },

  optionIcon: {
    fontSize: 24,
    width: 32,
    textAlign: "center",  
  },

  optionText : {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },

  optionLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },

  optionLabelSelected: {
    color: colors.primary,
  },

  optionDescription: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
    lineHeight: 16,
  },

  check: {
    borderWidth: 2,
    borderColor: colors.border,
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },

  checkSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  checkMark: {
    color: colors.white,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 16,
  },

  textArea: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    textAlignVertical: "top",
  },

  button: {
    marginTop: spacing.base,
  },
});
