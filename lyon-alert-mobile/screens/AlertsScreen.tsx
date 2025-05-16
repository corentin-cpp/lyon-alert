import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

type Alert = {
  id: string;
  title: string;
  description: string;
  date: string;
};

const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Travaux',
    description: 'Travaux sur la rue de la République',
    date: '2024-03-20',
  },
  {
    id: '2',
    title: 'Manifestation',
    description: 'Manifestation prévue place Bellecour',
    date: '2024-03-21',
  },
];

export default function AlertsScreen() {
  const renderAlert = ({ item }: { item: Alert }) => (
    <TouchableOpacity style={styles.alertCard}>
      <Text style={styles.alertTitle}>{item.title}</Text>
      <Text style={styles.alertDescription}>{item.description}</Text>
      <Text style={styles.alertDate}>{item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockAlerts}
        renderItem={renderAlert}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  alertCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  alertDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  alertDate: {
    fontSize: 14,
    color: '#999',
  },
}); 