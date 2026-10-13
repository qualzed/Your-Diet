from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json, traceback, time
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

# Период истории в секундах: 0 - 7 дней, 1 - 15 дней, 2 - 30 дней
HISTORY_PERIODS = {0: 604800, 1: 1296000, 2: 2592000}

class CalculationRequest(BaseModel):
    product_id: int
    weight_grams: float

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
    mail: str | None = None
    gender: int | None = None

class userProfileRequest(BaseModel):
    username: str

@app.get('/foods')
def get_all_foods():
    return food_db

@app.get('/foodNameAndID')
def getFoodNameAndID():
    food_list = [{"food_id": item['id'], "food": item['food']} for item in food_db]
    return {"status": "success", "foods": food_list}

@app.post('/writeHistory')
def writeHistory(data: writeHistoryRequest):
    try:
        db.createHistory(data.userID, data.foodID, data.grams, data.calories, data.fats, data.proteins, data.carbs)
        return {"status": "success"}
    except Exception as e:
        traceback.print_exc()
        return {"status": "error", "message": str(e)}

@app.post('/getHistory')
def getHistory(data: getHistoryRequest):
    if data.timePeriod not in HISTORY_PERIODS:
        return {"status": "error", "message": "Неверный период."}
    try:
        now = int(time.time())
        histories = db.findHistories(data.userID, now - HISTORY_PERIODS[data.timePeriod], now)
        return {"status": "success", "histories": histories}
    except Exception as e:
        traceback.print_exc()
        return {"status": "error", "message": str(e)}

@app.post('/calculate')
def calculate_nutrients(data: CalculationRequest):
    selected_product = None

    for item in food_db:
        if item['id'] == data.product_id:
            selected_product = item
            break

    if selected_product is None:
        return {"status": "error", "message": "Продукт не найден"}

    portions = data.weight_grams / 10.0 # данные в food_db даны на 10 гр

    return {
        "status": "success",
        "product_name": selected_product['food'],
        "weight_grams": data.weight_grams,
        "calories": round(selected_product['calories'] * portions, 2),
        "protein": round(selected_product['protein'] * portions, 2),
        "fat": round(selected_product['fat'] * portions, 2),
        "carbs": round(selected_product['carbs'] * portions, 2)
    }

@app.post("/authorizeUser")
def userAuthorization(data: userAccountRequest):
    try:
        if db.checkAuthorizationUserData(data.username, data.password):
            return {"status": "success"}
        return {"status": "error", "message": "Неправильный логин или пароль."}
    except Exception as e:
        traceback.print_exc()
        return {"status": "backend_error", "details": str(e)}

@app.post("/registerUser")
def userRegistration(data: userAccountRequest):
    if not data.mail or data.gender not in (0, 1):
        return {"status": "error", "message": "Укажите почту и пол."}

    try:
        register_result = db.registerUser(data.username, data.password, data.mail, data.gender)
        if register_result is True:
            return {"status": "success"}
        return {"status": "error", "message": register_result}
    except Exception as e:
        traceback.print_exc()
        return {"status": "backend_error", "details": str(e)}

@app.post("/getUserProfile")
def getUserProfile(data: userProfileRequest):
    try:
        profile = db.getUserProfile(data.username)
        if profile is None:
            return {"status": "error", "message": "Пользователь не найден."}
        return {"status": "success", "mail": profile["mail"], "gender": profile["gender"]}
    except Exception as e:
        traceback.print_exc()
        return {"status": "backend_error", "details": str(e)}