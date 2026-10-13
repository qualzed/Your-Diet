import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../api/main.js";
import { storage } from "./storage.js";

export async function sendAutharization(username, password) {
     if (!username || !password) {
          console.warn("Не передан логин или пароль.");
          alert("Вы не указали логин или пароль!");
          return null;
     }
     try {
          const response = await fetch(`${API_URL}/authorizeUser`, {
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                    username: username.toString(),
                    password: password.toString()
               }),
          });

          const data = await response.json();
          console.log(data);
          return data;

     } catch (error) {
          alert("Произошла неизвестная ошибка! Если вы разработчик - посмотрите консоль.")
          console.error("Ошибка при отправке запроса на бэкенд:", error);
          return null;
     }
}

export async function sendRegistration(username, password, mail, gender) {
     if (!username || !password || !mail) {
          alert(`Вы забыли что-то указать...`);
          return null;
     }
     try {
          const response = await fetch(`${API_URL}/registerUser`, {
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                    username: username.toString(),
                    password: password.toString(), 
                    mail: mail.toString(),
                    gender: parseInt(gender) // 0 - мужчина, 1 - женщина
               }),
          });

          const data = await response.json();
          console.log(data);
          return data;

     } catch (error) {
          alert("Произошла неизвестная ошибка! Если вы разработчик - посмотрите консоль.")
          console.error("Ошибка при отправке запроса на бэкенд:", error);
          return null;
     }
}

export const isUserLoggedIn = async () => {
     try {
          const status = await storage.getItem("loginStatus");

          if (status === "true") {
               return true;
          }

          return false;
     } catch (error) {
          console.error("Ошибка при проверке статуса входа:", error);
          return false;
     }
};

export const makeUserLoggedIn = async () => {
     await storage.setItem("loginStatus", "true");
};

export async function getUserProfile(username) {
     if (!username) return null;
     try {
          const response = await fetch(`${API_URL}/getUserProfile`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ username: username.toString() }),
          });
          return await response.json();
     } catch (error) {
          console.error("Ошибка при получении профиля:", error);
          return null;
     }
}

export const unlogUser = async () => {
     await storage.removeItem("loginStatus");
     await storage.removeItem("username");
};

export const getUserUsername = async () => {
     return await storage.getItem("username");
};

export const setUserUsername = async (username) => {
     await storage.setItem("username", username)
};