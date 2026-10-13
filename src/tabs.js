import { StyleSheet } from 'react-native';
import { NavigationContainer } from 'expo-router/react-navigation';
import { createBottomTabNavigator } from 'expo-router/js-tabs';
import { Ionicons } from '@expo/vector-icons';
import { FG_COLOR, TAB_COLOR} from './pages/appScreen';

import HomeScreen from './pages/appScreen';
import historyScreen from './pages/historyScreen';
import accountScreen from './pages/accountScreen';

export const Tab = createBottomTabNavigator();

const TAB_RADIUS = 32;
const INACTIVE = '#707070';

export default function TabsPanel() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: TAB_COLOR,
          tabBarInactiveTintColor: INACTIVE,
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.label,
          tabBarItemStyle: styles.item,
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ focused, color }) => {
            const icons = {
              Home: focused ? 'nutrition' : 'nutrition-outline',
              History: focused ? 'refresh-outline' : 'refresh',
              Account: focused ? 'at-circle' : 'at-circle-outline'
            };
            return <Ionicons name={icons[route.name]} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Главная' }} />
        <Tab.Screen name="History" component={historyScreen} options={{ title: 'История' }} />
        <Tab.Screen name="Account" component={accountScreen} options={{ title: 'Аккаунт' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 24,
    height: 68,
    borderRadius: TAB_RADIUS,
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    elevation: 0,
    shadowColor: FG_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
  },
  background: {
    borderRadius: TAB_RADIUS,
    overflow: 'hidden',
  },
  blurFallback: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(18, 18, 18, 0.55)',
  },
  item: {
    paddingTop: 8,
  },
  label: {
    fontFamily: 'Exo',
    fontSize: 11,
    letterSpacing: 0.5,
  },
});