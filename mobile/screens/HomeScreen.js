import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Linking } from 'react-native';
import { Surface, Text, Title, Avatar, ProgressBar, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import NotificationService from '../services/NotificationService';
import WebView from 'react-native-webview';

const HomeScreen = ({ navigation }) => {
  const { user, isAdmin } = useAuth();
  const [supportModalVisible, setSupportModalVisible] = useState(false);
  
  // Diğer state ve fonksiyonlar...

  const handleSupport = () => {
    setSupportModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Destek Popup Modal */}
      <Modal
        visible={supportModalVisible}
        onRequestClose={() => setSupportModalVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Destek Ol</Text>
              <TouchableOpacity onPress={() => setSupportModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <WebView
              source={{ uri: 'https://iyzi.link/AJ8JeQ' }}
              style={styles.webview}
            />
          </View>
        </View>
      </Modal>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Üst Bar - Anasayfa ve Destek Ol */}
        <Surface style={styles.topBar}>
          <Text style={styles.pageTitle}>Anasayfa</Text>
          <TouchableOpacity 
            style={styles.supportButton}
            onPress={handleSupport}
          >
            <MaterialCommunityIcons name="heart" size={24} color="#6200ee" />
            <Text style={styles.supportButtonText}>Destek Ol</Text>
          </TouchableOpacity>
        </Surface>

        {/* Kullanıcı Karşılama Bölümü */}
        <Surface style={styles.welcomeCard}>
          <View style={styles.welcomeHeader}>
            <Avatar.Icon 
              size={50} 
              icon="account" 
              style={styles.avatar}
            />
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeText}>
                Hoş Geldin, {user ? user.fullName || user.name : 'Misafir'}
              </Text>
              <Text style={styles.subtitleText}>
                Bugün hatmini tamamlamaya ne dersin?
              </Text>
            </View>
          </View>
        </Surface>

        {/* Hatim İstatistikleri */}
        <Surface style={styles.statsCard}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="book-open-variant" size={24} color="#6200ee" />
              <Text style={styles.statLabel}>Toplam Cüz</Text>
              <Text style={styles.statValue}>30/30</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="calendar-check" size={24} color="#6200ee" />
              <Text style={styles.statLabel}>Günler</Text>
              <Text style={styles.statValue}>15/30</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="fire" size={24} color="#6200ee" />
              <Text style={styles.statLabel}>Seri Gün</Text>
              <Text style={styles.statValue}>7</Text>
            </View>
          </View>
        </Surface>

        {/* Hızlı Eylemler */}
        <Surface style={styles.quickActionsCard}>
          <View style={styles.quickActionsHeader}>
            <MaterialCommunityIcons name="lightning-bolt" size={24} color="#6200ee" />
            <Text style={styles.quickActionsTitle}>Hızlı Eylemler</Text>
          </View>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('ReadQuran')}
            >
              <MaterialCommunityIcons name="book-open-page-variant" size={24} color="#6200ee" />
              <Text style={styles.quickActionText}>Hatmi Oku</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('JuzProgress')}
            >
              <MaterialCommunityIcons name="chart-line" size={24} color="#6200ee" />
              <Text style={styles.quickActionText}>İlerleme</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('InviteFriends')}
            >
              <MaterialCommunityIcons name="account-plus" size={24} color="#6200ee" />
              <Text style={styles.quickActionText}>Davet Et</Text>
            </TouchableOpacity>
          </View>
        </Surface>

        {/* Diğer kartlar... */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0e6ff',
    padding: 8,
    borderRadius: 20,
  },
  supportButtonText: {
    marginLeft: 4,
    color: '#6200ee',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  webview: {
    flex: 1,
  },
  welcomeCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#6200ee',
  },
  welcomeTextContainer: {
    marginLeft: 16,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitleText: {
    color: '#666',
    marginTop: 4,
  },
  // Diğer stiller aynı kalacak...
});

export default HomeScreen;