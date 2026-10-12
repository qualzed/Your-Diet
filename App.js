import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import TabsPanel from './src/tabs';

export default function App() {
  return (
    <View style={styles.container}>
      <TabsPanel />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  }
});