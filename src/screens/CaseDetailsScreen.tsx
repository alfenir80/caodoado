import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAppStore } from "../store/AppStore";
import type { CaseStatus } from "../types/case";
import { CaseItem } from '../types/case';
import { colors, typography, spacing, borderRadius, STATUS_META } from "./themes";

type Props = NativeStackScreenProps<RootStackParamList, "CaseDetails">;

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
        <View style={[styles.badge, { backgroundColor: STATUS_META[item.status].surface }]}>
          <Text style={[styles.badgeText, { color: STATUS_META[item.status].color }]}>{STATUS_META[item.status].label}</Text>
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
              pinColor={STATUS_META[item.status].color}
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
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  notFoundText: {
    fontSize: typography.fontSize.large,
    color: colors.textSecondary,
    textAlign: "center",
  },
  
  badge: {
    alignSelf: "flex-start",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
  },
  
  badgeText: {
    fontWeight: typography.fontWeight.black,
    fontSize: typography.fontSize.small,
  },

  id: {
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },

  situation: {
    fontSize: typography.fontSize.xlarge,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.bold,
  },

  date: {
    fontSize: typography.fontSize.small,
    color: colors.textSecondary,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },

  sectionTitle: {
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.extrabold,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },

  mapWrapper: {
    height: 180,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },

  map: {
    flex: 1,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
    alignItems: "flex-start",
  },

  infoLabel: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    flex: 1,
  },

  infoValue: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    flex: 2,
    fontWeight: typography.fontWeight.semibold,
    textAlign: "right",
  },

  updateRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "flex-start",
  },

  updateDot: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    marginTop: 6,
  },

  updateContent: {
    flex: 1,
    gap: 2,
  },

  updateTitle: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.semibold,
  },

  updateDate: {
    fontSize: typography.fontSize.small,
    color: colors.textMuted,
  },
});