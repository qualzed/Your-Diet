import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { TextInput, TouchableOpacity, Pressable, Keyboard } from 'react-native';
import { sendAutharization } from '../account/user.js';
import { isUserLoggedIn, makeUserLoggedIn } from '../account/storage.js';
import * as appStyle from './styles/main.js'

export default function accountScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const loggedIn = await isUserLoggedIn();
        setAuthorized(loggedIn);
      } catch (e) {
        console.error(e);
      }
    }
    checkStatus();
  }, []); // Пустой массив чтобы сработало один раз, не более

  const handleSendAutharization = async () => { 
    const data = await sendAutharization(username, password);
    if (data && data.status === "success") {
      setAuthorized(true);
      makeUserLoggedIn();
      console.log("Пользователь был авторизован.");
    } else if (data) {
      if (data.message === "undefined") {
        alert("Не удалось авторизоваться по вашим данным. Проверьте логин и пароль.");
      } else {
        alert("Ошибка: " + data.message);
      }
    }
  };

  return (
    <Pressable onPress={() => Keyboard.dismiss()} style={styles.container}>
      <View style={styles.container}>
        
        {!authorized && (
        <View style={styles.dataContainer}>
          <Text style={styles.title}>Авторизация в Your Diet.</Text>
          <TextInput
            style={appStyle.mainStyles.input}
            placeholder="Логин"
            placeholderTextColor={appStyle.WHITE}
            autoCorrect={false}
            onChangeText={(text) => setUsername(text)}
            value={username}
          />
          <TextInput
            style={appStyle.mainStyles.input}
            placeholder="Пароль"
            placeholderTextColor={appStyle.WHITE}
            autoCorrect={false}
            secureTextEntry={secure}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Text style={{color: appStyle.MUTED, bottom: 15, textAlign: 'center'}}>Посмотреть пароль</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={appStyle.mainStyles.button} onPress={handleSendAutharization}>
            <Text style={appStyle.mainStyles.buttonText}>АВТОРИЗОВАТЬСЯ</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{color: appStyle.MUTED, textAlign: 'center', marginTop: '10%', fontWeight: 'bold'}}>Нет аккаунта? Зарегестрируйтесь!</Text>
          </TouchableOpacity>
        </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appStyle.BG_COLOR
  },
  dataContainer: {
    marginTop: '50%',
    backgroundColor: appStyle.SURFACE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: appStyle.BORDER,
    marginHorizontal: 20,
    padding: 22,
    shadowColor: appStyle.FG_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10
  },
  title: {
    textAlign: 'center',
    paddingBottom: 22,
    color: appStyle.WHITE,
    fontWeight: 'bold',
    fontFamily: 'Exo',
    fontSize: 20,
  },
});