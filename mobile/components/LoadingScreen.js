import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Surface, Text, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LoadingScreen = () => {
  const [spinValue] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Surface style={styles.surface}>
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ rotate: spin }] },
          ]}
        >
          <MaterialCommunityIcons
            name="shield-lock"
            size={50}
            color="#6200ee"
          />
        </Animated.View>

        <Text style={styles.title}>Bağlanılıyor...</Text>
        <Text style={styles.subtitle}>
          Bilgileriniz uçtan uca özel güvenlik sistemleri ile korunmaktadır
        </Text>

        <View style={styles.indicatorContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>

        <Text style={styles.info}>
          İlk bağlantı biraz zaman alabilir, lütfen bekleyin...
        </Text>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  surface: {
    padding: 20,
    borderRadius: 10,
    elevation: 4,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  indicatorContainer: {
    marginVertical: 20,
  },
  info: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default LoadingScreen;
