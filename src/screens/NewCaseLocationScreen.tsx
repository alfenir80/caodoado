import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAppStore } from "../store/AppStore";

type Props = NativeStackScreenProps<RootStackParamList, "NewCaseLocation">;

const DEFAULT_DELTA = { latitudeDelta: 0.01, longitudeDelta: 0.01 };

export function NewCaseLocationScreen({ navigation, route }: Props) {
  const { state, dispatch } = useAppStore();
  const { photoCount } = route.params;
  const mapRef = useRef<MapView>(null);

  const [loadingGPS, setLoadingGPS] = useState(true);
  const [gpsError, setGPSError] = useState<string | null>(null);


  const lat = state.draft.location.latitude;
  const lng = state.draft.location.longitude;

  const hasValidLocation = lat !== 0 && lng !== 0;

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setGPSError("Permissão de localização negada. Por favor, permita o acesso à localização para usar esta funcionalidade.");
          setLoadingGPS(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        const { latitude, longitude } = location.coords;
        dispatch({ type: "draft/setLocation", latitude, longitude });

        // Centralizar o mapa na localização atual
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude,
            longitude,
            ...DEFAULT_DELTA,
          });
        }
      } catch (error) {
        setGPSError("Erro ao obter localização. Por favor, tente novamente.");
      } finally {
        setLoadingGPS(false);
      }
    })();
  }, [dispatch]);

  const handleDragMarker = (e: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    dispatch({ type: "draft/setLocation", latitude, longitude });
  };

  const handleLongPressMap = (e: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    dispatch({ type: "draft/setLocation", latitude, longitude });
    mapRef.current?.animateToRegion({
      latitude,
      longitude,
      ...DEFAULT_DELTA,
    }, 400);
  };

  const handleUseCurrentLocation = async () => {
    try {
      setLoadingGPS(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão de localização negada", "Por favor, permita o acesso à localização para usar esta funcionalidade.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const { latitude, longitude } = location.coords;
      dispatch({ type: "draft/setLocation", latitude, longitude });

      // Centralizar o mapa na localização atual
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude,
          longitude,
          ...DEFAULT_DELTA,
        }, 600);
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao obter localização. Por favor, tente novamente.");
    } finally {
      setLoadingGPS(false);
    }
  };

  const initialRegion: Region = {
    latitude: hasValidLocation ? lat : -23.55052, // São Paulo como fallback
    longitude: hasValidLocation ? lng : -46.633308,
    ...DEFAULT_DELTA,
  };



  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>
        {loadingGPS && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#333" />
            <Text style={styles.loadindTxt}>Obtendo localização...</Text>
          </View>
        )}

        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
          onLongPress={handleLongPressMap}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {hasValidLocation && (
            <Marker
              coordinate={{ latitude: lat, longitude: lng }}
              draggable
              onDragEnd={handleDragMarker}
              pinColor="#444"
            />
          )}
        </MapView>

        <View style={styles.hintBanner}>
          <Text style={styles.hintBannerTxt}>Arraste o marcador ou toque no mapa para ajustar a localização do caso.</Text>
        </View>
      </View>

      {gpsError && <Text style={styles.errorTxt}>{gpsError}</Text>}

      <Text style={styles.coords}>Lat: {lat.toFixed(6)} | Lng: {lng.toFixed(6)}</Text>

      <Pressable style={styles.secondaryBtn} onPress={handleUseCurrentLocation} disabled={loadingGPS}>
        <Text style={styles.secondaryTxt}>
          {loadingGPS ? "Obtendo localização..." : "Usar minha localização atual"}
        </Text>
      </Pressable>

      <Pressable
        style={[styles.primaryBtn, !hasValidLocation && styles.disable]}
        onPress={() => navigation.navigate("NewCaseSituation", 
          { photoCount, location: { latitude: lat, longitude: lng } })}
        disabled={!hasValidLocation}
      >
        <Text style={styles.primaryTxt}>Continuar</Text>
      </Pressable>



      
     </View>
  );



}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16,gap: 12 },
  
  mapWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
    minHeight: 320,
    position: "relative",
  },

  map: {
    flex: 1,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    gap: 10,
  },

  loadindTxt: {
    fontSize: 16,
    color: "#333",
  },

  hintBanner: {
    backgroundColor: "#fffae6",
    bottom: 0,
    left: 0,
    right: 0,
    position: "absolute",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffe58f",
  },

  hintBannerTxt: {
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
  },

  coords: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    marginTop: 4,
    fontVariant: ["tabular-nums"],
  },

  errorTxt: {
    fontSize: 14,
    color: "#d00",
    textAlign: "center",
    marginTop: 8,
  },
  

  primaryBtn: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: "#444",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
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

  disable: {
    backgroundColor: "#ccc",
    borderColor: "#aaa",
  },
 }
);