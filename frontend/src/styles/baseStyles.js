//frontend>src>styles>baseStyles.js
import { StyleSheet } from "react-native";

export const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FAF3E0",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  successText: {
    color: "green",
    marginBottom: 10,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorContainer: {
    padding: 20,
  },
  errorText: {
    color: "red",
  },
  retryButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  retryButtonText: {
    color: "white",
    textAlign: "center",
  },
  mapView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3B3B3B",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#D1D1D1",
    marginBottom: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#A8D5E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#3B3B3B",
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    color: "#3B3B3B",
  },
  buttonDisabled: {
    backgroundColor: "#D3D3D3",
  },
  buttonActive: {
    backgroundColor: "#5DADE2",
  },
  h1: {
    fontSize: 36,
    fontWeight: "bold",
  },
  h2: {
    fontSize: 30,
    fontWeight: "bold",
  },
  bodyText: {
    fontSize: 14,
  },
});
