import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAppStore } from "../store/AppStore";
import type { CaseStatus } from "../types/case";
import { CaseItem } from '../types/case';

const STATUS_COLORS: Record<CaseStatus, string> = {
  ABERTO: "red",
  EM_ANDAMENTO: "orange",
  RESOLVIDO: "green",
};

const STATUS_LABELS: Record<CaseStatus, string> = {
  ABERTO: "Aberto",
  EM_ANDAMENTO: "Em atendimento",
  RESOLVIDO: "Resolvido",
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = NativeStackScreenProps<RootStackParamList, "CaseDetails">;

export default function CaseDetailsScreen({ route }: Props) {
  const { caseId } = route.params;
  const { state } = useAppStore();
  const item = state.cases.find((c) => c.id === caseId);

  if (!item) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Caso não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.content}>
        <View style={[styles.badge, { backgroundColor: STATUS_COLORS[item.status] }]}>
          <Text style={styles.badgeText}>{STATUS_LABELS[item.status]}</Text>
        </View>
        <Text style={styles.situation}>{item.situation}</Text>
        <Text style={styles.id}>ID: {item.id}</Text>
        <Text style={styles.date}>Criado em: {formatDate(item.createdAtISO)}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Localização</Text>
        <View style={styles.mapWrapper}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: item.location.latitude,
              longitude: item.location.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}   
          >
            <Marker
              coordinate={{
                latitude: item.location.latitude,
                longitude: item.location.longitude,
              }}
              title={item.situation}
              pinColor={STATUS_COLORS[item.status]}
            />
          </MapView>
        </View>

        <View style={styles.divider} />
        
        <Text style={styles.sectionTitle}>Detalhes</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Fotos</Text>
          <Text style={styles.infoValue}>
            {item.photosCount} {item.photosCount === 1 ? "foto" : "fotos"}
          </Text>
        </View>

        {item.notes && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Observações</Text>
            <Text style={styles.infoValue}>{item.notes}</Text>
          </View>
        )}

        {item.assignedTo && (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Responsável</Text>
              <Text style={styles.infoValue}>{item.assignedTo.name}</Text>
            </View>
            {item.assignedTo?.org && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Organização</Text>
                <Text style={styles.infoValue}>{item.assignedTo.org}</Text>
              </View>
            )}
          </>
        )}

        {item.updates && item.updates.length > 0 && (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Atualizações</Text>
            {item.updates.map((update, index) => (
              <View key={index} style={styles.updateRow}>
                <View style={styles.updateDot} />
                <View style={styles.updateContent}>
                  <Text style={styles.updateTitle}>{update.text}</Text>
                  <Text style={styles.updateDate}>{formatDate(update.atISO)}</Text>
                </View>
              </View>
            ))}
          </>
        )}


      
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
    gap: 15,
    paddingBottom: 40,
  },
  
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
  
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  
  badgeText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },

  id: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#999",
    marginTop: 4,
  },

  situation: {
    fontSize: 22,
    color: "#222",
    fontWeight: "bold",
  },

  date: {
    fontSize: 14,
    color: "#aaa",
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },

  mapWrapper: {
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },

  map: {
    flex: 1,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
  },

  infoLabel: {
    fontSize: 14,
    color: "#999",
    flex: 1,
  },

  infoValue: {
    fontSize: 14,
    color: "#333",
    flex: 2,
    fontWeight: "600",
    textAlign: "right",
  },

  updateRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },

  updateDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#444",
    marginTop: 6,
  },

  updateContent: {
    flex: 1,
    gap: 2,
  },

  updateTitle: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },

  updateDate: {
    fontSize: 12,
    color: "#999",
  },
});