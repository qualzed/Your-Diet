from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

app = FastAPI()
FOOD_JSON_PATH = "server/food.json"
with open(FOOD_JSON_PATH, "r", encoding="utf-8") as file:
    food_db = json.load(file)

# app.post = recieve, app.get = give

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CalculationRequest(BaseModel):
    product_id: int
    weight_grams: float

class returnNameAndIDRequst(BaseModel):
    product_id: int
    product_name: str

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

     return { # ну и возращаем под конец, если хорошо все, округляем до 2 цифр
          "status": "success",
          "product_name": selected_product['food'],
          "weight_grams": data.weight_grams,
          "calories": round(total_calories, 2),
          "protein": round(total_protein, 2),
          "fat": round(total_fat, 2),
          "carbs": round(total_carbs, 2)
     }