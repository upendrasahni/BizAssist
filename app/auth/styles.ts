import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  header: {
    height: 140,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "700" },
  container: { flex: 1, padding: 20, backgroundColor: "#f6f9fb" },
  row: { marginBottom: 14 },
  label: { color: "#0b2632", fontWeight: "600", marginBottom: 6 },
  input: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e6eef4",
    color: "#0b2632",
  },
  primaryBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#0b66c3",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  rowInline: { flexDirection: "row", justifyContent: "center", marginTop: 14 },
  muted: { color: "#64748b" },
  link: { color: "#0b66c3", fontWeight: "700" },
});

export default styles