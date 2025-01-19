import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert
} from 'react-native';
import {
  Surface,
  Text,
  Searchbar,
  ActivityIndicator,
  List,
  IconButton,
  Button
} from 'react-native-paper';
import api from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  // Kullanıcıları getir
  const fetchUsers = async (search = '') => {
    try {
      setError(null);
      const data = await api.fetchUsers({ search });
      
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        throw new Error('Kullanıcı listesi alınamadı');
      }
    } catch (err) {
      console.error('Kullanıcıları getirme hatası:', err);
      setError('Kullanıcılar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // İlk yükleme
  useEffect(() => {
    fetchUsers();
  }, []);

  // Arama değiştiğinde
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Yenileme işlemi
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchUsers(searchQuery);
  }, [searchQuery]);

  // Kullanıcı rolünü güncelle
  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      Alert.alert('Başarılı', 'Kullanıcı rolü güncellendi');
      fetchUsers(searchQuery); // Listeyi yenile
    } catch (error) {
      console.error('Rol güncelleme hatası:', error);
      Alert.alert('Hata', 'Rol güncellenirken bir hata oluştu');
    }
  };

  // Kullanıcıyı sil
  const handleDeleteUser = async (userId) => {
    Alert.alert(
      'Kullanıcıyı Sil',
      'Bu kullanıcıyı silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/users/${userId}`);
              Alert.alert('Başarılı', 'Kullanıcı silindi');
              fetchUsers(searchQuery); // Listeyi yenile
            } catch (error) {
              console.error('Kullanıcı silme hatası:', error);
              Alert.alert('Hata', 'Kullanıcı silinirken bir hata oluştu');
            }
          },
        },
      ]
    );
  };

  // Rol değiştirme menüsü
  const showRoleMenu = (user) => {
    Alert.alert(
      'Rol Değiştir',
      `${user.firstName} ${user.lastName} için yeni rol seçin`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Kullanıcı',
          onPress: () => handleRoleUpdate(user._id, 'user'),
        },
        {
          text: 'Admin',
          onPress: () => handleRoleUpdate(user._id, 'admin'),
        },
      ]
    );
  };

  // Kullanıcı kartı
  const renderUserItem = ({ item }) => (
    <Surface style={styles.userCard}>
      <List.Item
        title={`${item.firstName} ${item.lastName}`}
        description={`${item.email}\nRol: ${item.role || 'Kullanıcı'}`}
        left={props => (
          <List.Icon {...props} icon="account" />
        )}
        right={props => (
          <View style={styles.actionButtons}>
            <IconButton
              icon="account-convert"
              onPress={() => showRoleMenu(item)}
            />
            <IconButton
              icon="delete"
              onPress={() => handleDeleteUser(item._id)}
            />
          </View>
        )}
      />
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
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text>{error}</Text>
          <Button onPress={() => fetchUsers(searchQuery)}>Tekrar Dene</Button>
        </View>
      ) : users.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text>Kullanıcı bulunamadı</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
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
    elevation: 4,
  },
  listContainer: {
    padding: 16,
  },
  userCard: {
    marginBottom: 8,
    elevation: 2,
    borderRadius: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default UserManagement;