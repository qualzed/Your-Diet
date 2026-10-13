import { StyleSheet, Text, View, Button } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import * as appStyle from './styles/main.js';
import { isUserLoggedIn } from '../account/user.js';
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
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appStyle.BG_COLOR,
  },
});