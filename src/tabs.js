import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './pages/appScreen';
import SettingsScreen from './pages/settings';

export const Tab = createBottomTabNavigator();

export default function TabsPanel() {
  return (
  <NavigationContainer>
     <Tab.Navigator>
          <Tab.Screen name="Главная" component={HomeScreen} />
          <Tab.Screen name="Настройки" component={SettingsScreen} />
     </Tab.Navigator>
  </NavigationContainer>
  );
}