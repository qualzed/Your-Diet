import { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { TextInput, TouchableOpacity, Pressable, Keyboard } from 'react-native';
import { sendAutharization } from '../account/user.js';
import * as appStyle from './styles/main.js'

export default function accountScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // const makeUserAuthorized = async () => {

  // };

  const handleSendAutharization = async () => {
    const data = await sendAutharization(username, password);
    if (data && data.status === "success") {
        console.log("АВТОРИЗОВАН УСПЕШНО!");
    } else if (data) {
        alert("Ошибка: " + data.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Аккаунт</Text>
      <TextInput
        style={styles.input}
        placeholder="Логин"
        placeholderTextColor={appStyle.WHITE}
        onChangeText={(text) => setUsername(text)}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        placeholderTextColor={appStyle.WHITE}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      
      <TouchableOpacity onPress={handleSendAutharization}>
        <Text>Авторизоваться.</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
    // backgroundColor: appStyle.BG_COLOR,
  },
  input: {
      backgroundColor: appStyle.SURFACE_2,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: appStyle.BORDER,
      height: 52,
      paddingHorizontal: 16,
      marginBottom: 20,
      fontFamily: 'Exo',
      fontSize: 17,
      color: appStyle.WHITE,
    },
});