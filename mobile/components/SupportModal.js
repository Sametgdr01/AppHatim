import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import Modal from 'react-native-modal';
import * as Clipboard from 'expo-clipboard';
import { Button } from 'react-native-paper';

const IYZICO_PAYMENT_LINK = 'https://www.iyzico.com/destek/AppHatim';

const SupportModal = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handlePaymentLink = async () => {
    try {
      await Linking.openURL(IYZICO_PAYMENT_LINK);
    } catch (error) {
      Alert.alert('Hata', 'Ödeme sayfası açılamadı.');
    }
  };

  const copyPaymentLink = async () => {
    await Clipboard.setStringAsync(IYZICO_PAYMENT_LINK);
    Alert.alert('Başarılı', 'Ödeme linki panoya kopyalandı.');
  };

  const handlePaymentComplete = () => {
    Alert.alert(
      'Teşekkür Ederiz!', 
      'Desteğiniz için çok teşekkür ederiz. Uygulamayı geliştirmemize katkıda bulundunuz.', 
      [{ text: 'Tamam', onPress: toggleModal }]
    );
  };

  return (
    <View>
      <TouchableOpacity 
        style={styles.supportButton} 
        onPress={toggleModal}
      >
        <Text style={styles.supportButtonText}>Destek Ol</Text>
      </TouchableOpacity>

      <Modal 
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Uygulamaya Destek Ol</Text>
          <Text style={styles.modalDescription}>
            Hatim App'in gelişimine destek olmak isterseniz, aşağıdaki butona tıklayarak ödeme yapabilirsiniz.
          </Text>

          <View style={styles.buttonContainer}>
            <Button 
              mode="contained" 
              onPress={handlePaymentLink} 
              style={styles.paymentButton}
            >
              Ödeme Sayfasına Git
            </Button>

            <Button 
              mode="outlined" 
              onPress={copyPaymentLink} 
              style={styles.copyButton}
            >
              Linki Kopyala
            </Button>

            <Button 
              mode="text" 
              onPress={handlePaymentComplete} 
              style={styles.completeButton}
            >
              Ödeme Tamamlandı
            </Button>
          </View>

          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  supportButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1000
  },
  supportButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  modal: {
    justifyContent: 'center',
    margin: 20
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15
  },
  modalDescription: {
    textAlign: 'center',
    marginBottom: 20
  },
  buttonContainer: {
    width: '100%',
    gap: 10
  },
  paymentButton: {
    backgroundColor: '#2196F3'
  },
  copyButton: {
    borderColor: '#2196F3'
  },
  completeButton: {
    color: '#4CAF50'
  },
  closeButton: {
    marginTop: 15
  },
  closeButtonText: {
    color: 'red'
  }
});

export default SupportModal;
