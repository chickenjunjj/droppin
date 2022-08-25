import { LogBox } from "react-native";
import Navigation from "./src/navigation/Navigation";
import { AppProvider } from "./src/utils/context";

export default function App() {
  LogBox.ignoreLogs([
    "AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage",
  ]);

  return (
    <AppProvider>
      <Navigation />
    </AppProvider>
  );
}
