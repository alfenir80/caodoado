import React from "react";
import { View, Text, StyleSheet, Pressable,
  Image, Alert, FlatList, ActivityIndicator} from "react-native";
import * as ImagePicker from "expo-image-picker";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAppStore } from "../store/AppStore";
import { SectionBase } from "react-native/types_generated/index";

type Props = NativeStackScreenProps<RootStackParamList, "NewCasePhoto">;

const MAX_PHOTOS = 3;

export function NewCasePhotoScreen({ navigation }: Props) {

  const { state, dispatch } = useAppStore();
  const photoUris = state.draft.photoUris;
  const canAddMore = photoUris.length < MAX_PHOTOS;

  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos de acesso à câmera para tirar fotos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      quality: 0.7,
      base64: false,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets[0].uri) {
      dispatch({ type: "draft/addPhoto", photoURI: result.assets[0].uri });   
    }
  };

  const handleGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos de acesso à galeria para escolher fotos.");
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 0.7,
      base64: false,
      allowsEditing: true,
      aspect: [4, 3],
      allowsMultipleSelection: true,
      selectionLimit: MAX_PHOTOS - photoUris.length,
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map(asset => asset.uri);
      selectedUris.forEach(uri => dispatch({ type: "draft/addPhoto", photoURI: uri }));
    }
  };

  const handleRemovePhoto = (uri: string) => {
    Alert.alert("Remover foto", "Deseja remover esta foto?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Remover", style: "destructive", onPress: () => dispatch({ type: "draft/removePhoto", photoURI: uri }) },
    ]);
  };

  const handleContinue = () => {
    if (photoUris.length === 0) {
      Alert.alert("Atenção", "Adicione pelo menos uma foto para continuar.");
      return;
    }
    navigation.navigate("NewCaseLocation", {photoCount: photoUris.length});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Fotos</Text>
      <Text style={styles.subtitle}>
        Tire até {MAX_PHOTOS} fotos ou escolha da galeria para mostrar a situação do animal.
      </Text>

      {photoUris.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>📷</Text>
          <Text style={styles.emptyTitle}>Nenhuma foto adicionada</Text>
          <Text style={styles.emptyHint}>Tire uma foto ou escolha da galeria</Text>
        </View>
      ) : (
        <FlatList
          data={photoUris}
          renderItem={({ item }) => (
            <View style={styles.thumbContainer}>
              <Image source={{ uri: item }} style={styles.thumb} />
              <Pressable style={styles.removeButton} onPress={() => handleRemovePhoto(item)}>
                <Text style={styles.removeTxt}>×</Text>
              </Pressable>
            </View>
          )}
          keyExtractor={(uri) => uri}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.previewList}
        />
      )}

      <Text style={styles.counter}>{photoUris.length} / {MAX_PHOTOS} fotos</Text>

      <View style={styles.row}>
        <Pressable 
          style={[styles.primaryButton, !canAddMore && styles.disable]}
          onPress={handleCamera} 
          disabled={!canAddMore}
        >
          <Text style={styles.primaryButtonText}>Tirar Foto</Text>
        </Pressable>

        <Pressable 
          style={[styles.secondaryButton, !canAddMore && styles.disable]} 
          onPress={handleGallery} 
          disabled={!canAddMore}
        >
          <Text style={styles.secondaryButtonText}>Escolher da Galeria</Text>
        </Pressable>
      </View>

      <Pressable style={styles.clearLink} onPress={() => dispatch({ type: "draft/reset" })}>
        <Text style={styles.clearLinkText}>Limpar Fotos</Text>
      </Pressable>

      <Pressable style={[styles.primaryButton, photoUris.length === 0 && styles.disable]} 
        onPress={handleContinue} 
        disabled={photoUris.length === 0}
      >
        <Text style={styles.primaryButtonText}>Continuar</Text>
      </Pressable>  

    </View>
  );
}

const THUMBNAIL_SIZE = 120;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },

  emptyBox: {
    flex: 1,
    minHeight: 240,
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 16,
  },

  emptyIcon: {
    fontSize: 48,
    color: "#ccc",
  },

  emptyTitle: {
    fontSize: 16,
    color: "#555",
    fontWeight: "700",
  },

  emptyHint: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },

  previewScroll: {
    flexGrow: 0,
  },

  previewList: {
    gap: 10,
    paddingVertical: 8,
  },

  thumbContainer: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },  
  
  thumb: {
    width: "100%",
    height: "100%",
  },

  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  removeTxt: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 16,
    fontWeight: "bold",
  },

  counter: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
    marginTop: -4,
  },

  row: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },

  primaryButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 16,
  },

  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },

  secondaryButton: {
    backgroundColor: "#6c757d",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  secondaryButtonText: {
    color: "#222",
    fontSize: 15,
    fontWeight: "700",
  },

  disable: { opacity: 0.6 },

  clearLink: {
     alignSelf: "center",
     paddingVertical: 8,
     paddingHorizontal: 16,
     borderRadius: 12,
     borderWidth: 1,
     borderColor: "#ccc",
     marginTop: 12,
  },

  clearLinkText: {
    color: "#555",
    fontSize: 14,
    fontWeight: "600",
  },

}); 