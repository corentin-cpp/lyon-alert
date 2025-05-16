import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import AlertsScreen from './screens/AlertsScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChatScreen from './screens/ChatScreen';

export type RootTabParamList = {
  Accueil: undefined;
  Carte: undefined;
  Alertes: undefined;
  Chat: undefined;
  Profil: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap;

              switch (route.name) {
                case 'Accueil':
                  iconName = focused ? 'home' : 'home-outline';
                  break;
                case 'Carte':
                  iconName = focused ? 'map' : 'map-outline';
                  break;
                case 'Alertes':
                  iconName = focused ? 'notifications' : 'notifications-outline';
                  break;
                case 'Chat':
                  iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                  break;
                case 'Profil':
                  iconName = focused ? 'person' : 'person-outline';
                  break;
                default:
                  iconName = 'help-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Accueil" component={HomeScreen} />
          <Tab.Screen name="Carte" component={MapScreen} />
          <Tab.Screen name="Alertes" component={AlertsScreen} />
          <Tab.Screen name="Chat" component={ChatScreen} />
          <Tab.Screen name="Profil" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
} 