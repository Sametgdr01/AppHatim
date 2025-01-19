import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  RefreshControl, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { 
  Avatar, 
  Surface, 
  Modal, 
  Portal, 
  RadioButton, 
  Searchbar 
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../services/api';

const UserManagement = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const fetchUserList = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedUsers = await api.fetchUsers({
        search: searchQuery,
        includeDetails: true
      });

      if (Array.isArray(fetchedUsers)) {
        // gudersamet@gmail.com kullanıcısını her zaman listenin başına koy
        const sametUserIndex = fetchedUsers.findIndex(user => user.email === 'gudersamet@gmail.com');
        if (sametUserIndex !== -1) {
          const sametUser = fetchedUsers.splice(sametUserIndex, 1)[0];
          fetchedUsers.unshift({
            ...sametUser,
            role: 'superadmin' // Her zaman super admin olarak göster
          });
        }

        setUsers(fetchedUsers);
      } else {
        console.error('Kullanıcı listesi dizi değil:', fetchedUsers);
        Alert.alert('Hata', 'Kullanıcı listesi alınamadı');
        setUsers([]);
      }
    } catch (error) {
      console.error('Kullanıcı listesi alınırken hata:', error);
      Alert.alert('Hata', 'Kullanıcı listesi alınamadı');
      setUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchUserList();
  }, [fetchUserList]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserList();
  };

  const handleAssignRole = async () => {
    if (!selectedUser) return;

    // Samet Güder için özel kontrol
    if (selectedUser.email === 'gudersamet@gmail.com') {
      Alert.alert(
        'İzin Hatası', 
        'Bu kullanıcının rolü değiştirilemez. Samet Güder her zaman Super Admin olarak kalacaktır.'
      );
      return;
    }

    try {
      await api.assignUserRole(selectedUser.id, selectedRole);
      Alert.alert('Başarılı', `${selectedUser.name} kullanıcısına ${selectedRole} rolü atandı.`);
      setRoleModalVisible(false);
      fetchUserList(); // Listeyi güncelle
    } catch (error) {
      Alert.alert('Hata', 'Rol ataması yapılamadı.');
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role || 'user');
    setRoleModalVisible(true);
  };

  const renderUserItem = ({ item }) => (
    <Surface style={styles.userCard}>
      <View style={styles.userCardContent}>
        <Avatar.Image 
          source={{ uri: item.profileImage || 'https://via.placeholder.com/150' }} 
          size={50} 
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userRole}>
            Mevcut Rol: {item.role || 'Kullanıcı'}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.roleAssignButton}
          onPress={() => openRoleModal(item)}
        >
          <MaterialCommunityIcons name="account-edit" size={24} color="#6200ee" />
        </TouchableOpacity>
      </View>
    </Surface>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Kullanıcı ara..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      ) : (
        <FlatList
          data={Array.isArray(users) ? users : []}
          renderItem={renderUserItem}
          keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={['#6200ee']} 
            />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Kullanıcı bulunamadı</Text>
            </View>
          )}
        />
      )}

      <Portal>
        <Modal 
          visible={roleModalVisible} 
          onDismiss={() => setRoleModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Rol Ata: {selectedUser?.name}</Text>
          
          <RadioButton.Group 
            onValueChange={newValue => setSelectedRole(newValue)} 
            value={selectedRole}
          >
            <View style={styles.radioGroup}>
              <View style={styles.radioItem}>
                <RadioButton value="user" />
                <Text>Kullanıcı</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="admin" />
                <Text>Admin</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="superadmin" />
                <Text>Super Admin</Text>
              </View>
            </View>
          </RadioButton.Group>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setRoleModalVisible(false)}
            >
              <Text style={styles.modalCancelButtonText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalConfirmButton}
              onPress={handleAssignRole}
            >
              <Text style={styles.modalConfirmButtonText}>Rol Ata</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    margin: 16,
  },
  userCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  userCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userRole: {
    fontSize: 14,
    color: '#666',
  },
  roleAssignButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 16,
    color: '#666'
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalCancelButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#6200ee',
    borderRadius: 8,
  },
  modalCancelButtonText: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  modalConfirmButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#6200ee',
    borderRadius: 8,
    marginLeft: 8,
  },
  modalConfirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UserManagement;