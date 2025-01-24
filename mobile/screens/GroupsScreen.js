import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Surface, Text, Title, Button, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const GroupsScreen = () => {
  const groups = [
    {
      id: '1',
      name: 'Ramazan Hatmi',
      members: 30,
      progress: 0.6,
      status: 'Devam Ediyor',
      type: 'Hatim',
      deadline: '15 Nisan 2024'
    },
    {
      id: '2',
      name: 'Yasin-i Şerif',
      members: 15,
      progress: 1.0,
      status: 'Tamamlandı',
      type: 'Sure',
      deadline: 'Tamamlandı'
    }
  ];

  const renderGroup = ({ item }) => (
    <Surface style={styles.groupCard}>
      <View style={styles.headerContainer}>
        <Title style={styles.groupName}>{item.name}</Title>
        <View style={[styles.statusBadge, 
          item.status === 'Tamamlandı' ? styles.completedBadge : styles.ongoingBadge
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <MaterialCommunityIcons name="account-group" size={20} color="#666" />
          <Text style={styles.infoText}>{item.members} Üye</Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialCommunityIcons name="book-open-variant" size={20} color="#666" />
          <Text style={styles.infoText}>{item.type}</Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialCommunityIcons name="calendar" size={20} color="#666" />
          <Text style={styles.infoText}>{item.deadline}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar
          progress={item.progress}
          color={item.status === 'Tamamlandı' ? '#4caf50' : '#2196f3'}
          style={styles.progressBar}
        />
        <Text style={styles.progressText}>
          {Math.round(item.progress * 100)}% Tamamlandı
        </Text>
      </View>

      <Button
        mode="contained"
        onPress={() => {}}
        style={styles.joinButton}
        disabled={item.status === 'Tamamlandı'}
      >
        {item.status === 'Tamamlandı' ? 'Tamamlandı' : 'Katıl'}
      </Button>
    </Surface>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.screenTitle}>Gruplar</Title>
        <TouchableOpacity style={styles.createButton}>
          <MaterialCommunityIcons name="plus" size={24} color="#2196f3" />
          <Text style={styles.createButtonText}>Yeni Grup</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={groups}
        renderItem={renderGroup}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },
  createButtonText: {
    color: '#2196f3',
    marginLeft: 4,
    fontWeight: '600'
  },
  listContainer: {
    padding: 16
  },
  groupCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  completedBadge: {
    backgroundColor: '#e8f5e9'
  },
  ongoingBadge: {
    backgroundColor: '#e3f2fd'
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600'
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoText: {
    marginLeft: 4,
    color: '#666'
  },
  progressContainer: {
    marginBottom: 16
  },
  progressBar: {
    height: 8,
    borderRadius: 4
  },
  progressText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  joinButton: {
    marginTop: 8
  }
});

export default GroupsScreen;
