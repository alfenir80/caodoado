import React, { useEffect, useRef, useState} from "react";
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from "react-native";
import MapView, { Marker, Region, Callout } from "react-native-maps";
import * as Location from "expo-location";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAppStore } from "../store/AppStore";
import { Badge  } from  "../components/UI";
import { colors, typography, spacing, borderRadius, shadows, zIndex, STATUS_META } from "./themes";
import { CaseItem, CaseStatus } from '../types/case';

type Props = NativeStackScreenProps<RootStackParamList, "Map">;

const SP_REGION = {
  latitude: -23.55052,
  longitude: -46.633308,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

export const MapScreen: React.FC<Props> = ({ navigation }) => {
  const { state } = useAppStore();
  const [region, setRegion] = useState<Region>(SP_REGION);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Precisamos de acesso à localização para mostrar os casos próximos.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const userRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setRegion(userRegion);
      mapRef.current?.animateToRegion(userRegion, 1000);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>

        {state.loadingCases && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingTxt}>Carregando casos...</Text>
          </View>
        )}

        <MapView ref={mapRef} style={styles.map} initialRegion={region} showsUserLocation>
          {state.cases.map((caseItem) => (
            <Marker
              key={caseItem.id}
              coordinate={{
                latitude: caseItem.location.latitude,
                longitude: caseItem.location.longitude,
              }}
              pinColor={STATUS_META[caseItem.status as CaseStatus].color}
            >
              <Callout tooltip={false}>
                <View style={styles.callout}>
                  <Text style={styles.calloutSituation}>{caseItem.situation}</Text>
                  <Badge label={caseItem.status} 
                    color={STATUS_META[caseItem.status as CaseStatus].color} 
                    surface={STATUS_META[caseItem.status as CaseStatus].surface}/>                
                  <Text style={styles.calloutAction}>Toque para ver detalhes</Text>
                </View>
              </Callout>
            </Marker> 
          ))}
        </MapView>

        <View style={styles.legend}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: STATUS_META.ABERTO.color }]} />
            <Text style={styles.legendTxt}>Aberto</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: STATUS_META.EM_ANDAMENTO.color }]} />
            <Text style={styles.legendTxt}>Em andamento</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: STATUS_META.RESOLVIDO.color }]} />
            <Text style={styles.legendTxt}>Resolvido</Text>
          </View>
        </View>

        <Pressable style={styles.myLocationButton} onPress={() => mapRef.current?.animateToRegion(region, 1000)}>
          <View style={styles.myLocationIcon} />
        </Pressable>

        <Pressable style={styles.fab} onPress={() => navigation.navigate("NewCasePhoto")}>
          <Text style={styles.fabTxt}>Reportar</Text>
         {/* <Ionicons name="add" size={20} color={colors.white} /> */}
         </Pressable>
      </View>

    </View>
  );  

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapWrapper: {
    flex: 1,
  },
  map: {
    flex: 1,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    gap: spacing.md,
  },

  loadingTxt: {
    fontSize: typography.fontSize.medium,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },

  callout: {
    width: 200,
    padding: spacing.sm,
    gap: spacing.sm,
  },

  calloutSituation: {
    fontSize: typography.fontSize.medium,
    fontWeight: typography.fontWeight.extrabold,
    color: colors.textPrimary,
  },

  calloutAction: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.primaryLight,
    marginTop: spacing.xs,
  },

  legend: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    shadowColor: shadows.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
    zIndex: zIndex.tooltip,
  },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  legendDot: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
  },

  legendTxt: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.semibold,
  },

  myLocationButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: colors.primary,
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    shadowColor: shadows.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    zIndex: zIndex.tooltip,
  },

  myLocationIcon: {
    width: 16,
    height: 16,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
  },

  fab: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    shadowColor: shadows.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    zIndex: zIndex.tooltip,
  },

  fabTxt: {
    fontSize: typography.fontSize.xs,
    color: colors.white,
    fontWeight: typography.fontWeight.black,
    marginTop: -2,
  },

});
