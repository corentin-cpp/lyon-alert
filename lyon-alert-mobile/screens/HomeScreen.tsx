import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '../App';

type HomeScreenNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Accueil'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bonjour,</Text>
        <Text style={styles.nameText}>John Doe</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="alert-circle" size={24} color="#007AFF" />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Alertes actives</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={24} color="#34C759" />
          <Text style={styles.statNumber}>45</Text>
          <Text style={styles.statLabel}>Résolues</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alertes récentes</Text>
        <TouchableOpacity 
          style={styles.alertCard}
          onPress={() => navigation.navigate('Alertes')}
        >
          <View style={styles.alertHeader}>
            <Ionicons name="warning" size={24} color="#FF9500" />
            <Text style={styles.alertTitle}>Travaux</Text>
            <Text style={styles.alertTime}>Il y a 2h</Text>
          </View>
          <Text style={styles.alertDescription}>
            Travaux sur la rue de la République, circulation perturbée
          </Text>
          <View style={styles.alertFooter}>
            <View style={styles.alertLocation}>
              <Ionicons name="location" size={16} color="#666" />
              <Text style={styles.locationText}>Rue de la République</Text>
            </View>
            <TouchableOpacity style={styles.detailsButton}>
              <Text style={styles.detailsText}>Voir détails</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Carte')}
          >
            <Ionicons name="map" size={24} color="#007AFF" />
            <Text style={styles.actionText}>Voir la carte</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Chat')}
          >
            <Ionicons name="chatbubbles" size={24} color="#007AFF" />
            <Text style={styles.actionText}>Messages</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  alertCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  alertTime: {
    fontSize: 12,
    color: '#999',
  },
  alertDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  detailsButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  detailsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 15,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
  },
}); 