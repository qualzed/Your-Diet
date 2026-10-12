import { StyleSheet, Text, View, Button } from 'react-native';
import { API_URL } from "../api/main.js";

export async function writeUserFoodHistory(userID, foodID, grams, calories, protein, fat, carbs) {
    try {
        const response = await fetch(`${API_URL}/writeHistory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ // || Нужен чтобы установить стандартные значение, а не передавать NaN / None
                userID: parseInt(userID) || 1,
                foodID: parseInt(foodID) || 0,
                grams: parseInt(grams) || 0,
                calories: parseFloat(calories) || 0.0,
                proteins: parseFloat(protein) || 0.0,
                fats: parseFloat(fat) || 0.0,
                carbs: parseFloat(carbs) || 0.0
            }),
        });

        const data = await response.json();
        return data;
    } catch(error) {
        console.error("Ошибка при отправке запроса на бэкенд: ", error);
        return null;
    }
};

export default function historyScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>История приёмов пищи</Text>
      
      <Button 
        title="Назад на главную" 
        onPress={() => navigation.goBack()} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});