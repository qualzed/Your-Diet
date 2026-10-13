import { useEffect, useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { TextInput, TouchableOpacity, Pressable, Keyboard } from 'react-native';
import { sendAutharization, isUserLoggedIn, makeUserLoggedIn, unlogUser, sendRegistration, getUserUsername, setUserUsername, getUserProfile } from '../account/user.js';
import * as appStyle from './styles/main.js'

const GENDERS = { 0: 'мужчина', 1: 'женщина' };
const EMPTY_PROFILE = { username: '', mail: '', gender: null };

export default function accountScreen({ navigation }) {
  const [profile, setProfile] = useState(EMPTY_PROFILE);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userMail, setUserMail] = useState('');
  const [formGender, setFormGender] = useState(); // 0 - мужчина, 1 - женщина
  const [secure, setSecure] = useState(true);

  const [authorized, setAuthorized] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Берёт логин из storage и запрашивает остальное у сервера
  const loadProfile = async () => {
    const savedUsername = await getUserUsername();
    if (!savedUsername) return;

    const data = await getUserProfile(savedUsername);
    if (data && data.status === "success") {
      setProfile({ username: savedUsername, mail: data.mail, gender: data.gender });
    }
  };

  // Один раз при запуске
  useEffect(() => {
    (async () => {
      const loggedIn = await isUserLoggedIn();
      setAuthorized(loggedIn);
      if (loggedIn) await loadProfile();
    })();
  }, []);

  // Общая часть после успешного входа или регистрации
  const finishLogin = async () => {
    await makeUserLoggedIn();
    await setUserUsername(username);
    await loadProfile();
    setPassword('');
    setIsRegistering(false);
    setAuthorized(true);
  };

  const handleSendAutharization = async () => {
    const data = await sendAutharization(username, password);
    if (data && data.status === "success") {
      await finishLogin();
    } else if (data) {
      alert(data.message === "undefined"
        ? "Не удалось авторизоваться по вашим данным. Проверьте логин и пароль."
        : "Ошибка: " + data.message);
    }
  };

  const handleSendRegistration = async () => {
    const data = await sendRegistration(username, password, userMail, formGender);
    if (data && data.status === "success") {
      await finishLogin();
    } else if (data) {
      alert("Ошибка: " + data.message);
    }
  };

  const unlogUserAccept = () => {
    Alert.alert('Подтверждение', 'Вы уверены, что хотите выйти из аккаунта?', [
      { text: 'Нет', style: 'cancel' },
      {
        text: 'Да',
        onPress: async () => {
          await unlogUser();
          setProfile(EMPTY_PROFILE);
          setUsername('');
          setAuthorized(false);
        },
      },
    ], { cancelable: true });
  };

  return (
    <Pressable onPress={() => Keyboard.dismiss()} style={styles.container}>
      <View style={styles.container}>
        
        {!authorized && !isRegistering && ( // Авторизация, если не авторизован, логично
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
            <Text style={{color: appStyle.MUTED, bottom: 10, textAlign: 'center'}}>Посмотреть пароль</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={appStyle.mainStyles.button} onPress={handleSendAutharization}>
            <Text style={appStyle.mainStyles.buttonText}>АВТОРИЗОВАТЬСЯ</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsRegistering(true)}>
            <Text style={{color: appStyle.MUTED, textAlign: 'center', marginTop: '10%', fontWeight: 'bold'}}>Нет аккаунта? Зарегестрируйтесь!</Text>
          </TouchableOpacity>
        </View>
        )}

        {authorized && (
        <View>
          <Text style={styles.userData}>Привет, {profile.username}!</Text>
          <Text style={styles.userData}>Вы, {GENDERS[profile.gender]}!</Text>
          <Text style={styles.userData}>{profile.mail}</Text>

          <TouchableOpacity style={styles.leaveAccount} onPress={unlogUserAccept}>
            <Text style={styles.leaveAccountText}>Выйти из аккаунта</Text>
          </TouchableOpacity>
        </View>
        )}

        {isRegistering && ( // Регистрация
        <View style={styles.dataContainer}>
          <Text style={styles.title}>РЕГИСТРАЦИЯ</Text>
          <TextInput
            style={appStyle.mainStyles.input}
            placeholder="Почта"
            placeholderTextColor={appStyle.WHITE}
            autoCorrect={false}
            onChangeText={(text) => setUserMail(text)}
            value={userMail}
          />
          <TextInput
            style={appStyle.mainStyles.input}
            placeholder="Придумайте логин"
            placeholderTextColor={appStyle.WHITE}
            autoCorrect={false}
            onChangeText={(text) => setUsername(text)}
            value={username}
          />
          <TextInput
            style={appStyle.mainStyles.input}
            placeholder="Придумайте пароль"
            placeholderTextColor={appStyle.WHITE}
            autoCorrect={false}
            secureTextEntry={secure}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />

          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Text style={{color: appStyle.MUTED, bottom: 10, textAlign: 'center'}}>Посмотреть пароль</Text>
          </TouchableOpacity>

          <View style={styles.genderContainer}>
            <TouchableOpacity onPress={() => setFormGender(0)} style={[styles.genderBtn, formGender === 0 && {backgroundColor: '#003950'}]}>
              <FontAwesome5 name='male' size={24} color='#00b7ff' />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setFormGender(1)} style={[styles.genderBtn, formGender === 1 && {backgroundColor: '#470024'}]}>
              <FontAwesome5 name='female' size={24} color='#ff0080' />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={appStyle.mainStyles.button} onPress={handleSendRegistration}>
            <Text style={appStyle.mainStyles.buttonText}>ЗАРЕГЕСТРИРОВАТЬСЯ</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsRegistering(false)}>
            <Text style={{color: appStyle.MUTED, textAlign: 'center', marginTop: '10%', fontWeight: 'bold'}}>Я передумал(а) регистрироваться.</Text>
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
  userData: {
    color: '#fff',
    fontSize: 32,
    fontFamily: 'Exo',
    textAlign: 'center',
    paddingTop: '20%'
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 15
  },
  genderBtn: {
    backgroundColor: appStyle.SURFACE_2,
    padding: 10,
    alignItems: 'center',
    borderRadius: 20,
    width: '45%',
  },
  leaveAccount: {
    position: 'absolute',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#d62525',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 20,
    shadowColor: '#ff0000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    marginTop: '175%'
  },
  leaveAccountText: {
    fontSize: 16,
    color: appStyle.WHITE,
  }
});