
import { useEffect, useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { StyleSheet, Text, View, Alert, ScrollView, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { sendAutharization, isUserLoggedIn, makeUserLoggedIn, unlogUser, sendRegistration, getUserUsername, setUserUsername, getUserProfile } from '../account/user.js';
import * as appStyle from './styles/main.js';

const GENDERS = { 0: 'Мужчина', 1: 'Женщина' };
const EMPTY_PROFILE = { username: '', mail: '', gender: null, userID: null };

export default function accountScreen({ navigation }) {
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userMail, setUserMail] = useState('');
  const [formGender, setFormGender] = useState();
  const [secure, setSecure] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    const savedUsername = await getUserUsername();
    if (!savedUsername) return;

    const data = await getUserProfile(savedUsername);
    if (data && data.status === 'success') {
      setProfile({
        username: savedUsername,
        mail: data.mail,
        gender: data.gender,
        userID: data.userID
      });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const loggedIn = await isUserLoggedIn();
        setAuthorized(loggedIn);
        if (loggedIn) await loadProfile();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const finishLogin = async () => {
    await makeUserLoggedIn();
    await setUserUsername(username);
    await loadProfile();
    setPassword('');
    setIsRegistering(false);
    setAuthorized(true);
  };

  const handleSendAutharization = async () => {
    if (!username.trim() || !password) {
      Alert.alert('Заполните поля', 'Введите логин и пароль.');
      return;
    }

    const data = await sendAutharization(username, password);

    if (data && data.status === 'success') {
      await finishLogin();
    } else if (data) {
      Alert.alert(
        'Ошибка авторизации',
        data.message === 'undefined'
          ? 'Проверьте правильность логина и пароля.'
          : data.message
      );
    }
  };

  const handleSendRegistration = async () => {
    if (!userMail.trim() || !username.trim() || !password || formGender === undefined) {
      Alert.alert('Заполните поля', 'Укажите почту, логин, пароль и пол.');
      return;
    }

    const data = await sendRegistration(username, password, userMail, formGender);

    if (data && data.status === 'success') {
      await finishLogin();
    } else if (data) {
      Alert.alert('Ошибка регистрации', data.message);
    }
  };

  const unlogUserAccept = () => {
    Alert.alert('Выход', 'Вы действительно хотите выйти из аккаунта?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: async () => {
          await unlogUser();
          setProfile(EMPTY_PROFILE);
          setUsername('');
          setPassword('');
          setAuthorized(false);
        }
      }
    ]);
  };

  const renderInput = (placeholder, value, onChangeText, icon, options = {}) => (
    <View style={styles.inputContainer}>
      <FontAwesome5 name={icon} size={15} color="#78958A" />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#78958A"
        autoCorrect={false}
        autoCapitalize="none"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={options.secure || false}
        keyboardType={options.keyboardType || 'default'}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#101A16" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSubtitle}>YOUR DIET</Text>
            <Text style={styles.headerTitle}>Аккаунт</Text>
          </View>
          <FontAwesome5 name="user-circle" size={28} color="#78B99A" style={{ marginTop: 50 }}/>
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Загрузка...</Text>
        ) : authorized ? (
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <FontAwesome5 name="user" size={25} color="#A6D8BA" />
              </View>
              <View style={styles.profileMain}>
                <Text style={styles.profileUsername}>{profile.username}</Text>
                <Text style={styles.profileGender}>
                  {GENDERS[profile.gender] || 'Пользователь'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <FontAwesome5 name="envelope" size={15} color="#78B99A" />
              <Text style={styles.infoText}>{profile.mail || 'Почта не указана'}</Text>
            </View>

            <View style={styles.infoRow}>
              <FontAwesome5 name="fingerprint" size={15} color="#78B99A" />
              <Text style={styles.infoText}>ID: {profile.userID || '—'}</Text>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={unlogUserAccept}>
              <FontAwesome5 name="sign-out-alt" size={16} color="#E58B8B" />
              <Text style={styles.logoutText}>Выйти из аккаунта</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>
              {isRegistering ? 'Регистрация' : 'С возвращением'}
            </Text>
            <Text style={styles.formDescription}>
              {isRegistering
                ? 'Создайте аккаунт Your Diet'
                : 'Войдите в свой аккаунт'}
            </Text>

            <View style={styles.formFields}>
              {isRegistering && renderInput(
                'Электронная почта',
                userMail,
                setUserMail,
                'envelope',
                { keyboardType: 'email-address' }
              )}

              {renderInput(
                isRegistering ? 'Придумайте логин' : 'Логин',
                username,
                setUsername,
                'user'
              )}

              <View style={styles.inputContainer}>
                <FontAwesome5 name="lock" size={15} color="#78958A" />
                <TextInput
                  style={styles.input}
                  placeholder="Пароль"
                  placeholderTextColor="#78958A"
                  autoCorrect={false}
                  autoCapitalize="none"
                  secureTextEntry={secure}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setSecure(!secure)}>
                  <FontAwesome5
                    name={secure ? 'eye' : 'eye-slash'}
                    size={16}
                    color="#78958A"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {isRegistering && (
              <View style={styles.genderSection}>
                <Text style={styles.genderTitle}>Пол</Text>
                <View style={styles.genderContainer}>
                  <TouchableOpacity
                    onPress={() => setFormGender(0)}
                    style={[styles.genderButton, formGender === 0 && styles.genderSelected]}
                  >
                    <FontAwesome5 name="male" size={19} color="#A6D8BA" />
                    <Text style={styles.genderText}>Мужчина</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setFormGender(1)}
                    style={[styles.genderButton, formGender === 1 && styles.genderSelected]}
                  >
                    <FontAwesome5 name="female" size={19} color="#A6D8BA" />
                    <Text style={styles.genderText}>Женщина</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={isRegistering ? handleSendRegistration : handleSendAutharization}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {isRegistering ? 'ЗАРЕГИСТРИРОВАТЬСЯ' : 'ВОЙТИ'}
              </Text>
              <FontAwesome5 name="arrow-right" size={15} color="#102019" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => {
                Keyboard.dismiss();
                setIsRegistering(!isRegistering);
              }}
            >
              <Text style={styles.switchText}>
                {isRegistering
                  ? 'Уже есть аккаунт? Войти'
                  : 'Нет аккаунта? Зарегистрироваться'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.footer}>YOUR DIET</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appStyle.BG_COLOR
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 30
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  headerSubtitle: {
    color: '#80C69B',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginTop: 50
  },
  headerTitle: {
    color: appStyle.WHITE,
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Exo'
  },
  loadingText: {
    color: appStyle.MUTED,
    textAlign: 'center',
    marginTop: 60
  },
  profileCard: {
    backgroundColor: appStyle.SURFACE,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: appStyle.BORDER,
    padding: 20,
    overflow: 'hidden'
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingVertical: 5
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#254B38',
    borderWidth: 1,
    borderColor: '#477A5B',
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileMain: {
    flex: 1
  },
  profileUsername: {
    color: appStyle.WHITE,
    fontSize: 21,
    fontWeight: 'bold',
    fontFamily: 'Exo'
  },
  profileGender: {
    color: '#83B997',
    fontSize: 13,
    marginTop: 5
  },
  divider: {
    height: 1,
    backgroundColor: appStyle.BORDER,
    marginVertical: 20
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appStyle.SURFACE_2,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
    gap: 13
  },
  infoText: {
    color: appStyle.WHITE,
    fontSize: 13,
    flex: 1
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#38252A',
    borderWidth: 1,
    borderColor: '#58353B',
    borderRadius: 15,
    padding: 15,
    marginTop: 12
  },
  logoutText: {
    color: '#E58B8B',
    fontSize: 13,
    fontWeight: '600'
  },
  formCard: {
    backgroundColor: appStyle.SURFACE,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: appStyle.BORDER,
    padding: 22
  },
  formTitle: {
    color: appStyle.WHITE,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Exo'
  },
  formDescription: {
    color: appStyle.MUTED,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
    marginBottom: 25
  },
  formFields: {
    gap: 13
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appStyle.SURFACE_2,
    borderWidth: 1,
    borderColor: appStyle.BORDER,
    borderRadius: 15,
    paddingHorizontal: 16,
    height: 56,
    gap: 13
  },
  input: {
    flex: 1,
    color: appStyle.WHITE,
    fontSize: 14,
    paddingVertical: 0
  },
  genderSection: {
    marginTop: 22
  },
  genderTitle: {
    color: appStyle.WHITE,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12
  },
  genderButton: {
    flex: 1,
    height: 65,
    backgroundColor: appStyle.SURFACE_2,
    borderWidth: 1,
    borderColor: appStyle.BORDER,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9
  },
  genderSelected: {
    backgroundColor: '#244B36',
    borderColor: '#80C69B'
  },
  genderText: {
    color: appStyle.WHITE,
    fontSize: 12,
    fontWeight: '600'
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#80C69B',
    borderRadius: 15,
    height: 55,
    marginTop: 25,
    gap: 12,
    shadowColor: '#80C69B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4
  },
  submitButtonText: {
    color: '#10251A',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.7
  },
  switchButton: {
    alignItems: 'center',
    paddingTop: 21
  },
  switchText: {
    color: '#80C69B',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center'
  },
  footer: {
    color: appStyle.MUTED,
    opacity: 0.5,
    fontSize: 9,
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 28
  }
});