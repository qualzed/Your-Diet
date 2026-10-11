import mysql.connector, time

MYSQL_HOST: str
MYSQL_USER: str
MYSQL_PASSWORD: str
MYSQL_DB: str
mycursor = None
mydb = None

def read_env():
     global MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB
     with open('./server/.env', 'r') as f:
          lines = f.readlines()
          MYSQL_HOST = lines[0].strip().strip("'").strip('"')
          MYSQL_USER = lines[1].strip().strip("'").strip('"')
          MYSQL_PASSWORD = lines[2].strip().strip("'").strip('"')
          MYSQL_DB = lines[3].strip().strip("'").strip('"')

def closeDB():
     mycursor.close()
     mydb.close()

def registerUser(username: str, password: str):
     sql = "INSERT INTO accounts (username, pass) VALUES (%s, %s)"
     val = (username, password)
     
     mycursor.execute(sql, val)
     mydb.commit()
     print(f"[LOG] Пользователь {username} успешно зарегистрирован в БД!")

def getUsernameByUserID(userID: int):
     sql = "SELECT username FROM accounts WHERE id = %s"
     val = (userID,)

     mycursor.execute(sql, val)

     result = mycursor.fetchone()

     if result:
          return result[0]
     return None

def getUserIDByUsername(username: str):
     sql = "SELECT id FROM accounts WHERE username = %s"
     val = (username,)

     mycursor.execute(sql, val)

     result = mycursor.fetchone()

     if result:
          return result[0]
     return None

def createHistory(userID: int, foodID: int, grams: int, calories: float, fats: float, proteins: float, carbs: float):
     sql = "INSERT INTO history (userID, time, foodID, grams, calories, fats, proteins, carbs) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
     val = (userID, int(time.time()), foodID, grams, calories, fats, proteins, carbs)

     mycursor.execute(sql, val)
     mydb.commit()
     print(f"[LOG] История употребления пищи была зарегестрирована.")

def findHistories(userID: int, timeStart: int, timeEnd: int):
     sql = "SELECT * FROM history WHERE time >= %s AND time <= %s AND userID = %s ORDER BY time"
     val = (timeStart, timeEnd, userID)

     mycursor.execute(sql, val)

     result: tuple = mycursor.fetchall()

     if result:
          return result
     return None

def startDB():
     global mycursor, mydb

     read_env()

     mydb = mysql.connector.connect(
          host=MYSQL_HOST,
          user=MYSQL_USER,
          password=MYSQL_PASSWORD,
          database=MYSQL_DB,
          use_pure=True
     )

     mycursor = mydb.cursor()

     if mydb.is_connected():
          print("[+] Успех! База данных Your Diet успешно подключена.")

startDB()