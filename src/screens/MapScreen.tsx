import React, { useEffect, useRef, useState} from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import MapView, { Marker, Region, Callout } from "react-native-maps";
import * as Location from "expo-location";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAppStore } from "../store/AppStore";
import { CaseItem, CaseStatus } from '../types/case';

type Props = NativeStackScreenProps<RootStackParamList, "Map">;

const SP_REGION = {
  latitude: -23.55052,
  longitude: -46.633308,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

const STATUS_COLORS: Record<CaseStatus, string> = {
  ABERTO: "red",
  EM_ANDAMENTO: "orange",
  RESOLVIDO: "green",
};

const STATUS_LABELS: Record<CaseStatus, string> = {
  ABERTO: "Aberto",
  EM_ANDAMENTO: "Em Andamento",
  RESOLVIDO: "Resolvido",
};

export function MapScreen({ navigation }: Props) {
  const { state, dispatch } = useAppStore();
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<Region | null>(null);
  const [loadingGPS, setLoadingGPS] = useState(true);

  //tentativa de centralizar o mapa na localização do usuário
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permissão de localização negada", "Por favor, permita o acesso à localização para usar esta funcionalidade.");
          setLoadingGPS(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const region: Region = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setUserLocation(region);
        mapRef.current?.animateToRegion(region, 1000);
      } catch (error) {
        Alert.alert("Erro ao obter localização", "Não foi possível obter sua localização. Por favor, tente novamente.");
      } finally {
        setLoadingGPS(false);
      }
    })();
  }, []);

  const goToUserLocation = () => {
    if (userLocation) {
      mapRef.current?.animateToRegion(userLocation, 1000);
      return;
    } 
    Alert.alert("Localização não disponível", "Não foi possível obter sua localização. Por favor, tente novamente."); 
  };
  
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={SP_REGION}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {state.cases.map((caseItem: CaseItem) => (
          <Marker
            key={caseItem.id}
            coordinate={{
              latitude: caseItem.location.latitude,
              longitude: caseItem.location.longitude,
            }}
            pinColor={STATUS_COLORS[caseItem.status]}
            onCalloutPress={() => navigation.navigate("CaseDetails", { caseId: caseItem.id })}
          >
            <Callout tooltip = {false}>
              <View style={styles.callout}>
                <Text style={styles.calloutId}>Caso #{caseItem.id}</Text>
                <View style={[styles.calloutBadge, { backgroundColor: STATUS_COLORS[caseItem.status] }]}>
                  <Text style={styles.calloutBadgeText}>{STATUS_LABELS[caseItem.status]}</Text>
                </View>
                <Text style={styles.calloutAction}>Toque para detalhes</Text>
              </View>
            </Callout>
            
          </Marker>
        ))}
      </MapView>


      <View style={styles.legend}>
        <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Legenda:</Text>
        {Object.entries(STATUS_LABELS).map(([status, label]) => (
          <View key={status} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={{ width: 16, height: 16, 
              backgroundColor: STATUS_COLORS[status as CaseStatus], borderRadius: 8 }} />
            <Text>{label}</Text>
          </View>
        ))}
      </View>

      <Pressable
        style={styles.myLocationButton}
        onPress={goToUserLocation}
      >
        <Text style={styles.myLocationIcon}>📍</Text>
      </Pressable>

      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate("NewCasePhoto") }
      >
        <Text style={styles.fabText}>➕</Text>
      </Pressable>
     
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  callout: {
    width: 180,
    padding: 10,
    gap: 4,
  },

  calloutId: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#222",
  },

  calloutBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },

  calloutBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  calloutAction: {
    marginTop: 4,
    backgroundColor: "#fff",
    fontSize: 11,
  },

  myLocationButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#fff",
    width: 44,
    height: 44,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },    

  myLocationIcon: {
    fontSize: 24,
    color: "#444",
  },

  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#fff",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  fabText: {
    fontSize: 24,
    color: "#444",
    fontWeight: "900",
    marginTop: -2,
  },  

  legend: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 10,
    borderRadius: 10,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});