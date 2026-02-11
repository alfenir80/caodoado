import React from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";

type CasePin = {
  id: string;
  status: "ABERTO" | "EM ATENDIMENTO" | "RESOLVIDO";
};

const mockPins: CasePin[] = [
  { id: "3841", status: "ABERTO" },
  { id: "5698", status: "EM ATENDIMENTO" },
  { id: "4822", status: "RESOLVIDO" },
];

export function MapScreen() {
  return (
   <View style={styles.container}>
     <View style={styles.mapBox}>
      <Text style={styles.mapTitle}>Mapa de Casos</Text>
      <View style={styles.pinsOverlay}>
        <FlatList 
          data={mockPins}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable style={styles.pinRow} 
              onPress={() => console.log("Pin pressed:", item.id)}>
              <View style={styles.pinDot} />
              <Text style={styles.pinText}>{item.id} - {item.status}</Text>
            </Pressable>
          )}
         />
        <Pressable style={styles.filterBtn} onPress={() => console.log("Filter pressed")}>
          <Text style={styles.filterTxt}>Filtrar</Text>
        </Pressable>
        <Pressable style={styles.fab} onPress={() => console.log("FAB pressed")}>
          <Text style={styles.fabTxt}>+</Text>
        </Pressable>
      </View> 
     </View>
   </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  mapBox: {
    flex: 1,
    backgroundColor: "#eee",
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 14,
    overflow: "hidden",
  },
  mapTitle: {textAlign: "center", marginTop: 12, 
      color: "#555", fontWeight: "800"},
  
  pinsOverlay: {
    position: "absolute",
    top: 48,
    left: 12,
    right: 12,
    bottom: 12,
    paddingTop: 8,  
  },
  pinRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 12, 
    marginBottom: 8,
  },
  
  pinDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#333",
    marginRight: 10,
  },

  pinText: {
    color: "#222",  
    fontWeight: "700",
  },

  filterBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#777",
  },

  filterTxt: {
    color: "#222",
    fontWeight: "800",
  },

  fab: {
    position: "absolute",
    right: 14,
    bottom: 14,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#444",
    alignItems: "center",
    justifyContent: "center",
  },

  fabTxt: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    marginTop: -2,
  },
} 
);