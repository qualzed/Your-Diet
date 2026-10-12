import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { Dropdown } from 'react-native-element-dropdown';
import { sendCalculation, getProductList } from '../client';
import { TextInput, TouchableOpacity, Pressable, Keyboard } from 'react-native';
import { writeUserFoodHistory } from './history.js';
import { StyleSheet, Text, View } from 'react-native';

export const TAB_COLOR = '#C1121F';
export const BG_COLOR = '#080808';
export const FG_COLOR = '#C1121F';
export const TEXT_COLOR = '#C1121F';
const SURFACE = '#121212';
const SURFACE_2 = '#1A1A1A';
const BORDER = '#2A2A2A';
const MUTED = '#8A8A8A';
const WHITE = '#F5F5F5';
let APP_NAME = "YOUR DIET";

export default function HomeScreen({ navigation }) {
  // Шрифт загружаем
  const [loaded] = useFonts({
  'Exo': require('./../../assets/fonts/Exo2-Regular.ttf')
  });

  // Переменные для ввода и вывода
  const [productsList, setProductsList] = useState([]);
  const [productId, setProductId] = useState(null);
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState(null);

  const handleFoodList = async () => {
  const data = await getProductList();

  if (data && data.status === "success") {
      setProductsList(data.foods);
  } else if (data) {
      alert("Ошибка: " + data.message);
  }
  };

  useEffect(() => {
  if (loaded) {
      handleFoodList();
  }
  }, [loaded]);

  const handleCalculate = async () => {
  if (!productId || !weight) {
      alert("Пожалуйста, заполните все поля!");
      return;
  }

  const data = await sendCalculation(productId, weight);

  if (data && data.status === "success") {
      setResult(data);
      // writeUserFoodHistory(1, productId, weight, data.calories, data.protein, data.fat, data.carbs); // проверял, работает
  } else if (data) {
      alert("Ошибка: " + (data.message || JSON.stringify(data)));
  }
  };

  if (!loaded) return null;

  return (
    // Pressable фиксит клавиатуру
  <Pressable onPress={() => Keyboard.dismiss()} style={styles.container}>
    <View style={styles.container}>
      <Text style={styles.AppHeader}>{APP_NAME}</Text>
        
        <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>Продукт</Text>

        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          containerStyle={styles.dropdownList}
          itemTextStyle={styles.itemText}
          activeColor={SURFACE_2}
          iconColor={FG_COLOR}
          data={productsList}
          search
          searchPlaceholder="Поиск..."
          placeholder="Выберите продукт"
          labelField="food"         // Название получаем
          valueField="food_id"      // Получаем айдишку
          value={productId}
          onChange={item => {
          setProductId(item.food_id); // Сохраняет выбранный продукт
          }}
        />

        <Text style={styles.inputLabel}>Вес (в граммах):</Text>
        <TextInput
            style={styles.input}
            placeholder="Например: 150"
            placeholderTextColor={WHITE}
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
              <Text style={styles.resultText}>Калории: {result.calories} калорий</Text>
              <Text style={styles.resultText}>Белки: {result.protein} г</Text>
              <Text style={styles.resultText}>Жиры: {result.fat} г</Text>
              <Text style={styles.resultText}>Углеводы: {result.carbs} г</Text>
        </View>
        )}
    </View>
  </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  AppHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Exo',
    fontSize: 34,
    letterSpacing: 6,
    color: FG_COLOR,
    marginTop: 40,
    marginBottom: 36,
    textShadowColor: 'rgba(193, 18, 31, 0.7)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  formContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 22,
    backgroundColor: SURFACE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: FG_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  inputLabel: {
    fontFamily: 'Exo',
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: MUTED,
    marginBottom: 8,
  },
  input: {
    backgroundColor: SURFACE_2,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    height: 52,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontFamily: 'Exo',
    fontSize: 17,
    color: WHITE,
  },
  dropdown: {
    backgroundColor: SURFACE_2,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    height: 52,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  dropdownList: {
    backgroundColor: SURFACE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  itemText: {
    fontFamily: 'Exo',
    fontSize: 16,
    color: WHITE,
  },
  placeholderStyle: {
    fontFamily: 'Exo',
    fontSize: 17,
    color: MUTED,
  },
  selectedTextStyle: {
    fontFamily: 'Exo',
    fontSize: 17,
    color: WHITE,
  },
  inputSearchStyle: {
    fontFamily: 'Exo',
    fontSize: 16,
    height: 44,
    borderRadius: 10,
    color: WHITE,
    backgroundColor: SURFACE_2,
    borderColor: BORDER,
  },
  button: {
    backgroundColor: FG_COLOR,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    shadowColor: FG_COLOR,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 12,
  },
  buttonText: {
    color: WHITE,
    fontWeight: 'bold',
    fontFamily: 'Exo',
    fontSize: 17,
    letterSpacing: 2,
  },
  resultContainer: {
    marginHorizontal: 20,
    backgroundColor: SURFACE,
    padding: 22,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    borderLeftWidth: 5,
    borderLeftColor: FG_COLOR,
    marginTop: 4,
    shadowColor: FG_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  resultTitle: {
    fontFamily: 'Exo',
    fontWeight: 'bold',
    fontSize: 20,
    color: FG_COLOR,
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  resultText: {
    fontWeight: 'bold',
    fontFamily: 'Exo',
    fontSize: 18,
    color: WHITE,
    marginBottom: 8,
  },
});