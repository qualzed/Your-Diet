import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { Dropdown } from 'react-native-element-dropdown';
import { sendCalculation, getProductList } from '../client';
import { TextInput, TouchableOpacity, Pressable, Keyboard } from 'react-native';
import { writeUserFoodHistory } from './historyScreen.js';
import { StyleSheet, Text, View } from 'react-native';
import * as appStyle from './styles/main.js';
import { isUserLoggedIn } from '../account/user.js';

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
        const isLogged = await isUserLoggedIn();
        if (isLogged === true) {
          writeUserFoodHistory(1, productId, weight, data.calories, data.protein, data.fat, data.carbs);
        }
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
          activeColor={appStyle.SURFACE_2}
          iconColor={appStyle.FG_COLOR}
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
            style={appStyle.mainStyles.input}
            placeholder="Например: 150"
            placeholderTextColor={appStyle.WHITE}
            keyboardType="numeric"
            value={weight}
            onChangeText={(text) => setWeight(text)}
        />

        <TouchableOpacity style={appStyle.mainStyles.button} onPress={handleCalculate}>
          <Text style={appStyle.mainStyles.buttonText}>РАССЧИТАТЬ БЖУ</Text>
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
    backgroundColor: appStyle.BG_COLOR,
  },
  AppHeader: {
    marginTop: '20%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Exo',
    fontSize: 34,
    letterSpacing: 6,
    color: appStyle.FG_COLOR,
    marginBottom: 36,
    textShadowColor: appStyle.FG_COLOR,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  formContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 22,
    backgroundColor: appStyle.SURFACE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: appStyle.BORDER,
    shadowColor: appStyle.FG_COLOR,
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
    color: appStyle.MUTED,
    marginBottom: 8,
  },
  dropdown: {
    backgroundColor: appStyle.SURFACE_2,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: appStyle.BORDER,
    height: 52,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  dropdownList: {
    backgroundColor: appStyle.SURFACE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: appStyle.BORDER,
    overflow: 'hidden',
  },
  itemText: {
    fontFamily: 'Exo',
    fontSize: 16,
    color: appStyle.WHITE,
  },
  placeholderStyle: {
    fontFamily: 'Exo',
    fontSize: 17,
    color: appStyle.MUTED,
  },
  selectedTextStyle: {
    fontFamily: 'Exo',
    fontSize: 17,
    color: appStyle.WHITE,
  },
  inputSearchStyle: {
    fontFamily: 'Exo',
    fontSize: 16,
    height: 44,
    borderRadius: 10,
    color: appStyle.WHITE,
    backgroundColor: appStyle.SURFACE_2,
    borderColor: appStyle.BORDER,
  },
  resultContainer: {
    marginHorizontal: 20,
    backgroundColor: appStyle.SURFACE,
    padding: 22,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: appStyle.BORDER,
    borderLeftWidth: 5,
    borderLeftColor: appStyle.FG_COLOR,
    marginTop: 4,
    shadowColor: appStyle.FG_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  resultTitle: {
    fontFamily: 'Exo',
    fontWeight: 'bold',
    fontSize: 20,
    color: appStyle.FG_COLOR,
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: appStyle.BORDER,
  },
  resultText: {
    fontWeight: 'bold',
    fontFamily: 'Exo',
    fontSize: 18,
    color: appStyle.WHITE,
    marginBottom: 8,
  },
});