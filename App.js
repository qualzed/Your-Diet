import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { Picker } from '@expo/ui';
import { sendCalculation } from './src/client';

let BG_COLOR = '#88f34a';
let TEXT_COLOR = '#000';
let APP_NAME = "YOUR DIET";

export default function App() {
  // Шрифт загружаем
  const [loaded] = useFonts({
    'Rubik': require('./assets/fonts/Rubik-Regular.ttf')
  });

  // Переменные для ввода и вывода
  const [productId, setProductId] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState(null);
  const [language, setLanguage] = useState('Java');

  // Ничего не возращаем если шрифт не загрузился
  if (!loaded) return null;

  // Функция расчета
  const handleCalculate = async () => {
    if (!productId || !weight) {
      alert("Пожалуйста, заполните все поля!");
      return;
    }

    // Вызываем функцию из src/client
    const data = await sendCalculation(productId, weight);
    
    if (data && data.status === "success") {
      setResult(data);
    } else if (data) {
      alert("Ошибка: " + data.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.AppHeader}>{APP_NAME}</Text>

      <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>Продукт</Text>

        {/* Сюда надо засунуть getProductNameByID, чтобы списки получать с сервера*/}
        <Picker selectedValue={productId} onValueChange={value => setProductId(value)}> 
          <Picker.Item label="Пример 1" value="1" />
          <Picker.Item label="Пример 2" value="2" />
        </Picker>

        <Text style={styles.inputLabel}>Вес (в граммах):</Text>
        <TextInput
          style={styles.input}
          placeholder="Например: 150"
          keyboardType="numeric"
          value={weight}
          onChangeText={(text) => setWeight(text)}
        />

        <TouchableOpacity style={styles.button} onPress={handleCalculate}>
          <Text style={styles.buttonText}>РАССЧИТАТЬ БЖУ</Text>
        </TouchableOpacity>
      </View>

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Продукт: {result.product_name}</Text>
          <Text style={styles.resultText}>Калории: {result.calories} ккал</Text>
          <Text style={styles.resultText}>Белки: {result.protein} г</Text>
          <Text style={styles.resultText}>Жиры: {result.fat} г</Text>
          <Text style={styles.resultText}>Углеводы: {result.carbs} г</Text>
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
    paddingTop: 20,
  },
  AppHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Rubik',
    fontSize: 24,
    color: TEXT_COLOR,
    marginBottom: 30,
  },
  formContainer: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Rubik',
    fontSize: 16,
    color: TEXT_COLOR,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 45,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontFamily: 'Rubik',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Rubik',
    fontSize: 16,
  },
  resultContainer: {
    marginHorizontal: 30,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  resultTitle: {
    fontFamily: 'Rubik',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  resultText: {
    fontFamily: 'Rubik',
    fontSize: 16,
    marginBottom: 5,
  }
});