import React from "react";
import {
    View, Text, StyleSheet, Image, FlatList,
    Pressable, Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAppStore } from "../store/AppStore";
import { colors, typography, spacing, borderRadius, shadows, zIndex } from "./themes";
import { CaseItem } from '../types/case';
import { Button } from  "../components/UI";
import { PreventRemoveProvider } from "@react-navigation/native";

type Props = NativeStackScreenProps<RootStackParamList, "NewCasePhoto">;

const MAX_PHOTOS = 3;

export default function NewCasePhotoScreen({ navigation, route }: Props) {
  const { state, dispatch } = useAppStore();
  const photoUris = state.draft.photoUris || [];
  const canAddMore = photoUris.length < MAX_PHOTOS;

  const handleCamera = async () => {
    if (!canAddMore) {
      Alert.alert("Limite de fotos", `Você pode adicionar no máximo ${MAX_PHOTOS} fotos.`);
      return;
    }
   
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Precisamos de acesso à câmera para tirar fotos.");
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        quality: 0.7,
        allowsEditing: true,
        aspect: [4, 3],
        base64: false,
      });

      if (!result.canceled && result.assets[0].uri) {
        const newUri = result.assets[0].uri;
        dispatch({ type: "draft/addPhoto", photoURI: newUri });
      }
  };

  const handleGallery = async () => {
    if (!canAddMore) {
      Alert.alert("Limite de fotos", `Você pode adicionar no máximo ${MAX_PHOTOS} fotos.`);
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Precisamos de acesso à galeria para escolher fotos.");
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        quality: 0.7,
        allowsEditing: true,
        aspect: [4, 3],
        base64: false,
      });

      if (!result.canceled && result.assets[0].uri) {
        const newUri = result.assets[0].uri;
        dispatch({ type: "draft/addPhoto", photoURI: newUri });
      }
  };

  const handleRemovePhoto = (uri: string) => {
    Alert.alert("Remover foto", "Tem certeza que deseja remover esta foto?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Remover", style: "destructive", onPress: () => dispatch({ type: "draft/removePhoto", photoURI: uri }) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Adicionar fotos do caso</Text>
          <Text style={styles.subtitle}>Tire fotos no local ou escolha da galeria para ajudar na investigação.</Text>
        </View>

        {/* Área de pré-visualização das fotos */}
        {photoUris.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>📷</Text>
            <Text style={styles.emptyTitle}>Nenhuma foto adicionada</Text>
            <Text style={styles.emptyHint}>Use os botões abaixo para tirar fotos ou escolher da galeria.</Text>
          </View>
        ) : (
          <View style={styles.previewArea}>
            <FlatList
              data={photoUris}
              keyExtractor={(uri) => uri}
              numColumns={3}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.previewList}
              renderItem={({ item: uri }) => (
                <View style={styles.thumbWrap}>
                  <Image source={{ uri }} style={styles.thumb} />
                  <Pressable style={styles.removeButton} onPress={() => handleRemovePhoto(uri)}>
                    <Text style={styles.removeIcon}>×</Text>
                  </Pressable>
                </View>
              )}
            />
            <View style={styles.previewFooter}>
              <Text style={styles.counter}>
                {photoUris.length} de {MAX_PHOTOS} fotos
              </Text>
              {canAddMore && (
                <Pressable onPress={() => dispatch({ type: "draft/clearPhotos" })}>
                  <Text style={styles.clearTxt}>Limpar fotos</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}

        {/* Botões de ação */}
        <View style={styles.actionRow}>
          <Button 
            label="Tirar foto" 
            icon="📷"
            variant="secondary"
            fullWidth={false}
            onPress={handleCamera} 
            disabled={!canAddMore}
            style={styles.actionButton} />
          <Button 
            label="Escolher da galeria"
            icon="🖼️" 
            variant="secondary"
            fullWidth={false}
            onPress={handleGallery} 
            disabled={!canAddMore}
            style={styles.actionButton} />
        </View>

        <View style={{flexDirection: "row", justifyContent: "flex-end", marginTop: spacing.base }}>
          <Button 
            label="Próximo" 
            variant="primary" 
            onPress={() => navigation.navigate("NewCaseLocation", { photoCount: photoUris.length })} 
            disabled={photoUris.length === 0} />
        </View>
      </View>
    </SafeAreaView>
  );  

}

const THUMB_SIZE = 110;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.base,
    gap: spacing.base,
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

  //Estado vazio - borda tracejada estilo dropzone

  emptyBox: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.surface2,
    borderStyle: "dashed",
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 220,
  },

  emptyEmoji: {
    fontSize: 52,
  },

  emptyTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },

  emptyHint: {
    fontSize: typography.fontSize.small,
    color: colors.textMuted,
    textAlign: "center",
  },

  //Lista de fotos - grid de miniaturas com gap e borda arredondada

  previewArea: {
    flex: 1,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,    
    boxShadow: shadows.medium,
  },

  previewList: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },

  thumbWrap: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    position: "relative",
  },

  thumb: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    height: 24,
    width: 24,
    borderRadius:borderRadius.full,
    padding: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    boxShadow: shadows.light,
    justifyContent: "center",
    alignItems: "center",
  },

  removeIcon: {
    color: colors.surface,
    fontSize: 16,
    lineHeight: 16,
    fontWeight: typography.fontWeight.bold,
  },

  previewFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  counter: {
    fontSize: typography.fontSize.small,
    color: colors.textMuted,
  },

  countNumber: {
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },

  clearTxt: {
    fontSize: typography.fontSize.small,
    color: colors.accent,
    fontWeight: typography.fontWeight.semibold,
  },

  //botões de ação - estilo primário e secundário

  actionRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },

  actionButton: {
    flex: 1,
    paddingVertical: spacing.base,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
});
  