import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import { API_URL } from "../api/main.js";
import storage from "./storage.js";

export async function checkAuthorization() {
     const authorizedStatus = await storage.getItem("authorized");
     if (!authorizedStatus) return console.error("Не найден предмет authorizedStatus.");
     return authorizedStatus
}

export async function sendAutharization(username, password) {
     if (!username || !password) {
          console.warn("Не передан логин или пароль.");
          alert("Вы не указали логил или пароль!");
          return null;
     }
     try {
          const response = await fetch(`${API_URL}/authorizeUser`, {
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json',
               },
               body: JSON.stringify({ // Переводим данные в int и float для питона
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