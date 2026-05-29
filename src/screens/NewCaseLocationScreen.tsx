import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAppStore } from "../store/AppStore";
import { Button } from  "../components/UI";
import { colors, typography, spacing, borderRadius, shadows, zIndex } from "./themes";

type Props = NativeStackScreenProps<RootStackParamList, "NewCaseLocation">;

const DELTA = { latitudeDelta: 0.01, longitudeDelta: 0.01 };

export default function NewCaseLocationScreen({ navigation, route }: Props) {
  const { photoCount } = route.params;
  const { state, dispatch } = useAppStore();
  const [loadingGPS, setLoadingGPS] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  const lat = state.draft.location.latitude || -23.55052;
  const lng = state.draft.location.longitude || -46.633308;
  const hasLocation = !!state.draft.location.latitude && !!state.draft.location.longitude;

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permissão de localização negada.");
          setLoadingGPS(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        dispatch({
          type: "draft/setLocation",
          latitude,
          longitude,
        });
        mapRef.current?.animateToRegion({
          latitude,
          longitude,
          ...DELTA,
        }, 1000);
      } catch (error) {
        setErrorMsg("Erro ao obter localização.");
      } finally {
        setLoadingGPS(false);
      }
    })();
  }, [dispatch]);

  const handleDragEnd = (e: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    dispatch({
      type: "draft/setLocation",
      latitude,
      longitude,
    });
  };

  const handleLongPress = (e: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    dispatch({
      type: "draft/setLocation",
      latitude,
      longitude,
    })
    mapRef.current?.animateToRegion({
      latitude,
      longitude,
      ...DELTA,
    }, 1000);
  };

  const handleUseGPS = async () => {
    try {
      setLoadingGPS(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão de localização negada.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.LocationAccuracy.High });
      const { latitude, longitude } = location.coords;
      dispatch({
        type: "draft/setLocation",
        latitude,
        longitude,
      });
      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        ...DELTA,
      }, 1000);
    } catch (error) {
      Alert.alert("Erro ao obter localização.");
    } finally {
      setLoadingGPS(false);
    }
  };

  const initialRegion: Region = hasLocation
    ? {
        latitude: lat,
        longitude: lng,
        ...DELTA,
      }
    : {
        latitude: -23.55052,
        longitude: -46.633308,
        ...DELTA,
      };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Onde ocorreu?</Text>
        </View>
        <Text style={styles.subtitle}>
          Arraste o marcador para a localização exata ou toque no mapa para posicioná-lo.
        </Text>

        <View style={styles.mapWrapper}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={initialRegion}
            onLongPress={handleLongPress}
          >
            {hasLocation && (
              <Marker
                coordinate={{ latitude: lat, longitude: lng }}
                draggable
                onDragEnd={handleDragEnd}
              />
            )}
          </MapView>

          {loadingGPS && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ marginTop: spacing.sm, color: colors.textPrimary }}>Obtendo localização...</Text>
            </View>
          )}

          {!loadingGPS && (
            <View style={styles.instructionsBanner}>
              <Text style={styles.instructionsText}>
                Toque e segure para posicionar o marcador ou use o botão abaixo para usar sua localização atual.
              </Text>
            </View>
          )}
        </View>

        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
        {hasLocation && (
          <Text style={styles.coordsText}>
            Latitude: {lat.toFixed(5)}, Longitude: {lng.toFixed(5)}
          </Text>
        )}

        <Button
          label="Usar minha localização"
          onPress={handleUseGPS}
          disabled={loadingGPS}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe : {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    padding: spacing.base,
    gap: spacing.md,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  title: {
    fontSize: typography.fontSize.large,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },

  subtitle: {
    fontSize: typography.fontSize.medium,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  //map

  mapWrapper: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...(shadows.medium as any),
  },

  map: {
    flex: 1,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: zIndex.modal,
  },

  //banner roxo semi transparente no rodapé do mapa

  instructionsBanner: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(98, 0, 238, 0.9)",
    padding: spacing.base,
    alignItems: "center",
  },

  instructionsText: {
    color: colors.white,
    fontSize: typography.fontSize.medium,
    textAlign: "center",
  },

  coordsText: {
    textAlign: "center",
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.medium,
  },

  errorText: {
    textAlign: "center",
    marginTop: spacing.sm,
    color: colors.accent,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.medium,
  },

  button: {
    marginTop: spacing.base,
  },
});