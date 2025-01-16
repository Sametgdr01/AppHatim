import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Switch, Surface, Text, Divider } from 'react-native-paper';

const NotificationSettingsScreen = () => {
  const [settings, setSettings] = useState({
    hatimReminders: true,
    groupUpdates: true,
    dailyReminders: false,
    completionAlerts: true,
    newGroupInvites: true,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.settingsContainer}>
        <List.Section>
          <List.Item
            title="Hatim Hatırlatıcıları"
            description="Günlük okuma hatırlatmaları"
            left={props => <List.Icon {...props} icon="bell-ring" />}
            right={() => (
              <Switch
                value={settings.hatimReminders}
                onValueChange={() => toggleSetting('hatimReminders')}
                color="#6200ee"
              />
            )}
          />
          <Divider />
          <List.Item
            title="Grup Güncellemeleri"
            description="Grup hatimlerindeki değişiklikler"
            left={props => <List.Icon {...props} icon="account-group" />}
            right={() => (
              <Switch
                value={settings.groupUpdates}
                onValueChange={() => toggleSetting('groupUpdates')}
                color="#6200ee"
              />
            )}
          />
          <Divider />
          <List.Item
            title="Günlük Hatırlatıcılar"
            description="Günlük okuma hedefleri"
            left={props => <List.Icon {...props} icon="calendar-clock" />}
            right={() => (
              <Switch
                value={settings.dailyReminders}
                onValueChange={() => toggleSetting('dailyReminders')}
                color="#6200ee"
              />
            )}
          />
          <Divider />
          <List.Item
            title="Tamamlama Bildirimleri"
            description="Hatim tamamlama bildirimleri"
            left={props => <List.Icon {...props} icon="check-circle" />}
            right={() => (
              <Switch
                value={settings.completionAlerts}
                onValueChange={() => toggleSetting('completionAlerts')}
                color="#6200ee"
              />
            )}
          />
          <Divider />
          <List.Item
            title="Yeni Grup Davetleri"
            description="Grup hatim davet bildirimleri"
            left={props => <List.Icon {...props} icon="account-plus" />}
            right={() => (
              <Switch
                value={settings.newGroupInvites}
                onValueChange={() => toggleSetting('newGroupInvites')}
                color="#6200ee"
              />
            )}
          />
        </List.Section>
      </Surface>

      <Text style={styles.note}>
        Not: Bildirim ayarlarınızı değiştirdiğinizde otomatik olarak kaydedilecektir.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  settingsContainer: {
    margin: 16,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: '#fff',
  },
  note: {
    margin: 16,
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default NotificationSettingsScreen; 