import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as appStyle from './styles/main.js';
import { isUserLoggedIn } from '../account/user.js';
import { API_URL } from "../api/main.js";
import { mainStyles } from './styles/main.js';

export async function writeUserFoodHistory(userID, foodID, grams, calories, protein, fat, carbs) {
    try {
        const response = await fetch(`${API_URL}/writeHistory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function check() {
        const loggedIn = await isUserLoggedIn(); 
        if (isLoggedIn !== loggedIn) {
          setIsLoggedIn(loggedIn);
        }
      }
      
      check();
    }, [isLoggedIn])
  );

  return (
    <View style={styles.container}>
      {!isLoggedIn ? (
        <View style={styles.mustAuth}>
          <Text style={mainStyles.centeredText}>
            Вы должны быть авторизованы для просмотра своей истории.
          </Text>
        </View>
      ) : (
        <View>
          {/* Здесь надо будет сделать саму историю, получение, показ и всякое такое */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appStyle.BG_COLOR,
  },
  mustAuth: {
    flex: 1,
    justifyContent: 'center',
  },
});