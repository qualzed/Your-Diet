import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = AsyncStorage;

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
     const status = await storage.getItem("loginStatus")
}

export const getUserLogin = async () => {
     return await storage.getItem("login");
};