import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { DataTable, Surface, Text, Searchbar, IconButton, Portal, Modal, Button, Chip, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [visible, setVisible] = useState(false);

  // Örnek kullanıcı verileri
  const users = [
    { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com', role: 'Kullanıcı', status: 'Aktif' },
    { id: 2, name: 'Mehmet Demir', email: 'mehmet@example.com', role: 'Admin', status: 'Aktif' },
    { id: 3, name: 'Ayşe Kaya', email: 'ayse@example.com', role: 'Kullanıcı', status: 'Pasif' },
  ];

  const showModal = (user) => {
    setSelectedUser(user);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setSelectedUser(null);
  };

  const renderUserStatus = (status) => {
    const color = status === 'Aktif' ? '#4caf50' : '#ff5252';
    return (
      <Chip 
        mode="outlined" 
        style={[styles.statusChip, { borderColor: color }]}
        textStyle={{ color, fontSize: 14 }}
      >
        {status}
      </Chip>
    );
  };

  const renderUserRole = (role) => {
    const color = role === 'Admin' ? '#6200ee' : '#666';
    return (
      <Chip 
        mode="outlined" 
        style={[styles.roleChip, { borderColor: color }]}
        textStyle={{ color, fontSize: 14 }}
      >
        {role}
      </Chip>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.headerCard}>
        <Text style={styles.headerTitle}>Kullanıcı Yönetimi</Text>
        <Text style={styles.headerSubtitle}>Tüm kullanıcıları görüntüle ve yönet</Text>
      </Surface>

      <Surface style={styles.surface}>
        <Searchbar
          placeholder="İsim veya e-posta ile ara..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          iconColor="#6200ee"
          placeholderTextColor="#666"
        />

        <DataTable>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title style={styles.columnTitle}><Text style={styles.headerText}>Kullanıcı</Text></DataTable.Title>
            <DataTable.Title style={styles.columnTitle}><Text style={styles.headerText}>Rol</Text></DataTable.Title>
            <DataTable.Title style={styles.columnTitle}><Text style={styles.headerText}>Durum</Text></DataTable.Title>
            <DataTable.Title style={styles.columnTitle}><Text style={styles.headerText}>İşlem</Text></DataTable.Title>
          </DataTable.Header>

          {users.map((user) => (
            <DataTable.Row key={user.id} style={styles.tableRow}>
              <DataTable.Cell style={styles.userCell}>
                <View>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
              </DataTable.Cell>
              <DataTable.Cell>{renderUserRole(user.role)}</DataTable.Cell>
              <DataTable.Cell>{renderUserStatus(user.status)}</DataTable.Cell>
              <DataTable.Cell>
                <IconButton
                  icon="dots-vertical"
                  size={24}
                  color="#6200ee"
                  onPress={() => showModal(user)}
                />
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </Surface>

      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
          {selectedUser && (
            <View>
              <View style={styles.modalHeader}>
                <MaterialCommunityIcons name="account-circle" size={40} color="#6200ee" />
                <View style={styles.modalHeaderText}>
                  <Text style={styles.modalTitle}>Kullanıcı İşlemleri</Text>
                  <Text style={styles.modalSubtitle}>{selectedUser.name}</Text>
                </View>
              </View>
              
              <Divider style={styles.modalDivider} />

              <View style={styles.modalInfo}>
                <View style={styles.modalInfoRow}>
                  <MaterialCommunityIcons name="email" size={24} color="#666" />
                  <Text style={styles.modalInfoText}>{selectedUser.email}</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <MaterialCommunityIcons name="shield-account" size={24} color="#666" />
                  <Text style={styles.modalInfoText}>{selectedUser.role}</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <MaterialCommunityIcons name="circle" size={24} color={selectedUser.status === 'Aktif' ? '#4caf50' : '#ff5252'} />
                  <Text style={styles.modalInfoText}>{selectedUser.status}</Text>
                </View>
              </View>

              <View style={styles.modalButtons}>
                <Button 
                  mode="contained" 
                  onPress={() => {
                    // Rol değiştirme işlemi
                    hideModal();
                  }}
                  style={[styles.modalButton, { backgroundColor: '#6200ee' }]}
                  labelStyle={styles.buttonLabel}
                >
                  Rol Değiştir
                </Button>
                <Button 
                  mode="contained" 
                  onPress={() => {
                    // Durum değiştirme işlemi
                    hideModal();
                  }}
                  style={[styles.modalButton, { backgroundColor: selectedUser.status === 'Aktif' ? '#ff5252' : '#4caf50' }]}
                  labelStyle={styles.buttonLabel}
                >
                  {selectedUser.status === 'Aktif' ? 'Pasif Yap' : 'Aktif Yap'}
                </Button>
              </View>
            </View>
          )}
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
  headerCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: '#6200ee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  surface: {
    margin: 16,
    elevation: 4,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  searchbar: {
    margin: 16,
    elevation: 0,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    minHeight: 70,
  },
  userCell: {
    flex: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusChip: {
    height: 32,
  },
  roleChip: {
    height: 32,
  },
  modal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalHeaderText: {
    marginLeft: 16,
    flex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  modalInfo: {
    marginBottom: 24,
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  modalInfoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    minWidth: 140,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    paddingVertical: 4,
  },
  columnTitle: {
    flex: 1,
  },
});

export default UserManagement; 