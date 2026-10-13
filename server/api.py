from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json, asyncio, traceback, time
import db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FOOD_JSON_PATH = "server/food.json"
with open(FOOD_JSON_PATH, "r", encoding="utf-8") as file:
    food_db = json.load(file)

class CalculationRequest(BaseModel):
    product_id: int
    weight_grams: float

class ReturnNameAndIDRequest(BaseModel):
    product_id: int
    product_name: str

class writeHistoryRequest(BaseModel):
    userID: int
    foodID: int
    grams: int
    calories: float
    proteins: float
    fats: float
    carbs: float

class getHistoryRequest(BaseModel):
    userID: int
    timePeriod: int # 0 - За 7 дней, 1 - 15 дней, 2 - 30 дней

class userAccountRequest(BaseModel):
    username: str
    password: str

@app.get('/foods')
def get_all_foods():
    return food_db

@app.get('/foodNameAndID')
def getFoodNameAndID():
    food_list = []
    for item in food_db:
        short_info = {
            "food_id": item['id'], 
            "food": item['food']
        }
        food_list.append(short_info)
    return {
        "status": "success",
        "foods": food_list
    }

@app.post('/writeHistory')
async def writeHistory(data: writeHistoryRequest):
    try:
        db.createHistory(data.userID, data.foodID, data.grams, data.calories, data.fats, data.proteins, data.carbs)
        return {"status": "success"}
    except Exception as e:
        traceback.print_exc() # Ошибку в консоль выводит, обычный принт не хочет почемуто
        return {"status": "error", "message": e}

@app.post('/getHistory')
async def getHistory(data:getHistoryRequest):
    try:
        timePeriod = 0
        match data.timePeriod:
            case 0:
                timePeriod = 604800
            case 1:
                timePeriod = 1296000
            case 2:
                timePeriod = 2592000

        histories: tuple = db.findHistories(data.userID, int(time.time()) - timePeriod, time.time())
    except Exception as e:
        traceback.print_exc() # Ошибку в консоль выводит, обычный принт не хочет почемуто
        return {"status": "error", "message": e}

@app.post('/calculate')
def calculate_nutrients(data: CalculationRequest):
    selected_product = None # Просто инициализация

    for item in food_db: # Перебираем всю еду
        if item['id'] == data.product_id: # Если айди совпадает с тем что дал пользователь
            selected_product = item # то выбранный продукт
            break # ну и поиск завершаем
            
    if selected_product == None: # если все же не нашли
        return {"status": "error", "message": "Продукт не найден"}

    portions = data.weight_grams / 10.0 # делим на 10.0 тк данные в food_db были под 10 гр

    total_calories = selected_product['calories'] * portions
    total_protein = selected_product['protein'] * portions
    total_fat = selected_product['fat'] * portions
    total_carbs = selected_product['carbs'] * portions

    return { # ну и возвращаем под конец, если хорошо все, округляем до 2 цифр
        "status": "success",
        "product_name": selected_product['food'],
        "weight_grams": data.weight_grams,
        "calories": round(total_calories, 2),
        "protein": round(total_protein, 2),
        "fat": round(total_fat, 2),
        "carbs": round(total_carbs, 2)
    }

@app.post("/authorizeUser")
def userAuthorization(data: userAccountRequest):
    try:
        if db.checkAuthorizationUserData(data.username, data.password):
            return {"status": "success"}
        else:
            return {"status": "error", "message": "Неправильный логин или пароль."}
    except Exception as e:
        return {"status": "backend_error", "details": str(e)}

@app.post("/registerUser")
def userRegistration(data: userAccountRequest):
    try:
        register_result = db.registerUser(data.username, data.password)
        if register_result is True:
            return {"status": "success"}
        else:
            return {"status": "error", "message": register_result}
    except Exception as e:
        return {"status": "backend_error", "details": str(e)}