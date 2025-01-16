import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Surface, Text, TouchableRipple, Portal, Modal, Button, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AdminPanel = ({ navigation }) => {
  const [visible, setVisible] = useState(false);

  const stats = {
    totalUsers: 150,
    activeUsers: 120,
    totalHatims: 25,
    specialHatims: 8
  };

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const renderStatItem = (icon, value, label, color = '#6200ee') => (
    <Surface style={styles.statItem}>
      <MaterialCommunityIcons name={icon} size={32} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Surface>
  );

  return (
    <ScrollView style={styles.container}>
      {/* İstatistikler */}
      <Surface style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Genel İstatistikler</Text>
        <View style={styles.statsGrid}>
          {renderStatItem('account-multiple', stats.totalUsers, 'Toplam Kullanıcı')}
          {renderStatItem('account-check', stats.activeUsers, 'Aktif Kullanıcı', '#4caf50')}
          {renderStatItem('book-open-page-variant', stats.totalHatims, 'Toplam Hatim', '#1976d2')}
          {renderStatItem('star-circle', stats.specialHatims, 'Özel Gece Hatmi', '#f57c00')}
        </View>
      </Surface>

      {/* Yönetim Menüsü */}
      <Surface style={styles.menuCard}>
        <Text style={styles.sectionTitle}>Yönetim</Text>
        
        <TouchableRipple onPress={() => navigation.navigate('UserManagement')}>
          <View style={styles.menuItem}>
            <MaterialCommunityIcons name="account-cog" size={24} color="#6200ee" />
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Kullanıcı Yönetimi</Text>
              <Text style={styles.menuDescription}>Kullanıcıları görüntüle ve yönet</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#6200ee" />
          </View>
        </TouchableRipple>

        <TouchableRipple onPress={() => navigation.navigate('HatimManagement')}>
          <View style={styles.menuItem}>
            <MaterialCommunityIcons name="book-cog" size={24} color="#6200ee" />
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Hatim Yönetimi</Text>
              <Text style={styles.menuDescription}>Hatimleri görüntüle ve yönet</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#6200ee" />
          </View>
        </TouchableRipple>

        <TouchableRipple onPress={showModal}>
          <View style={styles.menuItem}>
            <MaterialCommunityIcons name="star-circle" size={24} color="#6200ee" />
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Özel Gece Hatmi Oluştur</Text>
              <Text style={styles.menuDescription}>Yeni özel gece hatmi başlat</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#6200ee" />
          </View>
        </TouchableRipple>
      </Surface>

      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
          <Text style={styles.modalTitle}>Özel Gece Hatmi Oluştur</Text>
          <Text style={styles.modalText}>
            Bu özellik yakında eklenecektir. Şu anda geliştirme aşamasındadır.
          </Text>
          <Button mode="contained" onPress={hideModal}>
            Tamam
          </Button>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statsCard: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  menuCard: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statLabel: {
    color: '#666',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  menuContent: {
    flex: 1,
    marginLeft: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  menuDescription: {
    color: '#666',
    fontSize: 14,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalText: {
    marginBottom: 16,
  },
});

export default AdminPanel; 