import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { Dropdown } from 'react-native-element-dropdown';
import { sendCalculation, getProductList } from './src/client';

let BG_COLOR = '#014BAA';
let FG_COLOR = '#F8F3F0';
let TEXT_COLOR = '#F8F3F0';
let APP_NAME = "YOUR DIET";

export default function App() {
  // Шрифт загружаем
  const [loaded] = useFonts({
    'Exo': require('./assets/fonts/Exo2-Regular.ttf')
  });

  const [productsList, setProductsList] = useState([]);

  // Переменные для ввода и вывода
  const [productId, setProductId] = useState(null);
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState(null);

  const handleFoodList = async () => {
    const data = await getProductList();

    if (data && data.status === "success") {
      setProductsList(data.foods);
      console.log(data.foods);
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
    } else if (data) {
      alert("Ошибка: " + (data.message || JSON.stringify(data)));
    }
  };

  if (!loaded) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.AppHeader}>{APP_NAME}</Text>

      <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>Продукт</Text>

        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
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
          placeholderTextColor={'#000'}
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

      <StatusBar style="auto" />
    </View>
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
    fontSize: 24,
    color: TEXT_COLOR,
    marginTop: 10,
    marginBottom: 50,
  },
  formContainer: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Exo',
    fontSize: 16,
    color: TEXT_COLOR,
    marginBottom: 5,
  },
  input: {
    backgroundColor: FG_COLOR,
    borderRadius: 8,
    height: 45,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontFamily: 'Exo',
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: FG_COLOR,
    borderRadius: 8,
    height: 45,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  placeholderStyle: {
    fontFamily: 'Exo',
    fontSize: 16,
    color: '#000',
  },
  selectedTextStyle: {
    fontFamily: 'Exo',
    fontSize: 16,
    color: '#000',
  },
  inputSearchStyle: {
    fontFamily: 'Exo',
    fontSize: 16,
    height: 40,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#000',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: TEXT_COLOR,
    fontWeight: 'bold',
    fontFamily: 'Exo',
    fontSize: 16,
  },
  resultContainer: {
    marginHorizontal: 30,
    backgroundColor: TEXT_COLOR,
    padding: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  resultTitle: {
    fontFamily: 'Exo',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  resultText: {
    fontWeight: 'bold',
    fontFamily: 'Exo',
    fontSize: 20,
    marginBottom: 5,
  }
});