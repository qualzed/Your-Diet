import time, traceback
import mysql.connector
from mysql.connector import pooling, IntegrityError

pool = None

def read_env():
     with open('./server/.env', 'r') as f:
          lines = f.readlines()
          return {
               "host": lines[0].strip().strip("'").strip('"'),
               "user": lines[1].strip().strip("'").strip('"'),
               "password": lines[2].strip().strip("'").strip('"'),
               "database": lines[3].strip().strip("'").strip('"'),
          }

def startDB():
     global pool
     pool = pooling.MySQLConnectionPool(
          pool_name="yourdiet",
          pool_size=5,
          use_pure=True,
          **read_env()
     )
     print("[+] Успех! База данных Your Diet успешно подключена.")

def _run(sql: str, val: tuple = (), fetch: str | None = None, commit: bool = False):
     conn = pool.get_connection()
     try:
          cur = conn.cursor(dictionary=True)
          try:
               cur.execute(sql, val)
               result = None
               if fetch == "one":
                    result = cur.fetchone()
               elif fetch == "all":
                    result = cur.fetchall()
               if commit:
                    conn.commit()
               return result
          finally:
               cur.close()
     finally:
          conn.close()

def closeDB():
     print("[+] База данных была закрыта.")

def userExist(username: str) -> bool:
     return _run("SELECT 1 FROM accounts WHERE username = %s", (username,), fetch="one") is not None

def registerUser(username: str, password: str, mail: str, gender: int):
     if userExist(username):
          print(f"[LOG] Пользователь {username} уже существует.")
          return "Пользователь с таким логином существует."

     try:
          _run(
               "INSERT INTO accounts (username, password, mail, gender) VALUES (%s, %s, %s, %s)",
               (username, password, mail, gender),
               commit=True
          )
          print(f"[LOG] Пользователь {username} успешно зарегистрирован в БД!")
          return True
     except IntegrityError:
          return "Пользователь с таким логином существует."
     except Exception:
          traceback.print_exc()
          return "Не удалось зарегистрировать пользователя."

def checkAuthorizationUserData(username: str, password: str) -> bool:
     row = _run("SELECT password FROM accounts WHERE username = %s", (username,), fetch="one")
     return row is not None and row["password"] == password

def getUsernameByUserID(userID: int):
     row = _run("SELECT username FROM accounts WHERE id = %s", (userID,), fetch="one")
     return row["username"] if row else None

def getUserIDByUsername(username: str):
     row = _run("SELECT id FROM accounts WHERE username = %s", (username,), fetch="one")
     return row["id"] if row else None

def getUserProfile(username: str):
     return _run("SELECT mail, gender, id FROM accounts WHERE username = %s", (username,), fetch="one")

def createHistory(userID: int, foodID: int, grams: int, calories: float, fats: float, proteins: float, carbs: float):
     _run(
          "INSERT INTO history (userID, time, foodID, grams, calories, fats, proteins, carbs) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
          (userID, int(time.time()), foodID, grams, calories, fats, proteins, carbs),
          commit=True
     )
     print("[LOG] История употребления пищи была зарегистрирована.")

def findHistories(userID: int, timeStart: int, timeEnd: int) -> list:
     return _run(
          "SELECT * FROM history WHERE time >= %s AND time <= %s AND userID = %s ORDER BY time",
          (timeStart, timeEnd, userID),
          fetch="all"
     )

startDB()