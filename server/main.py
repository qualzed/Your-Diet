from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# app.post = recieve, app.get = give

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

food_db = [
    # --- Источники белка (Мясо, птица, яйца) ---
    {'id': 1, 'food': 'Куриное филе (сырое)', 'calories': 11.0, 'protein': 2.3, 'fat': 0.2, 'carbs': 0.0},
    {'id': 2, 'food': 'Куриное филе (вареное)', 'calories': 15.3, 'protein': 3.0, 'fat': 0.4, 'carbs': 0.0},
    {'id': 3, 'food': 'Куриное филе (жареное на масле)', 'calories': 19.5, 'protein': 2.8, 'fat': 0.9, 'carbs': 0.0},
    {'id': 4, 'food': 'Яйцо куриное (вареное)', 'calories': 15.5, 'protein': 1.3, 'fat': 1.1, 'carbs': 0.1},
    {'id': 5, 'food': 'Яйцо куриное (глазунья на масле)', 'calories': 18.2, 'protein': 1.2, 'fat': 1.5, 'carbs': 0.1},
    {'id': 6, 'food': 'Говядина (сырая)', 'calories': 19.0, 'protein': 1.9, 'fat': 1.2, 'carbs': 0.0},
    {'id': 7, 'food': 'Говядина (тушеная)', 'calories': 23.0, 'protein': 2.6, 'fat': 1.4, 'carbs': 0.0},
    {'id': 8, 'food': 'Свинина (сырая нежирная)', 'calories': 16.0, 'protein': 2.0, 'fat': 0.9, 'carbs': 0.0},
    {'id': 9, 'food': 'Свинина (жареная на масле)', 'calories': 35.0, 'protein': 2.2, 'fat': 2.9, 'carbs': 0.0},

    # --- Рыба и морепродукты ---
    {'id': 10, 'food': 'Горбуша (сырая)', 'calories': 14.0, 'protein': 2.1, 'fat': 0.6, 'carbs': 0.0},
    {'id': 11, 'food': 'Горбуша (запеченая)', 'calories': 16.5, 'protein': 2.4, 'fat': 0.8, 'carbs': 0.0},
    {'id': 12, 'food': 'Креветки (вареные)', 'calories': 9.5, 'protein': 2.2, 'fat': 0.1, 'carbs': 0.0},

    # --- Углеводы (Крупы, макароны) ---
    {'id': 13, 'food': 'Рис белый (сухой)', 'calories': 34.5, 'protein': 0.7, 'fat': 0.1, 'carbs': 7.9},
    {'id': 14, 'food': 'Рис белый (вареный)', 'calories': 11.6, 'protein': 0.2, 'fat': 0.0, 'carbs': 2.5},
    {'id': 15, 'food': 'Гречка (сухая)', 'calories': 33.0, 'protein': 1.3, 'fat': 0.3, 'carbs': 6.2},
    {'id': 16, 'food': 'Гречка (вареная на воде)', 'calories': 9.2, 'protein': 0.4, 'fat': 0.1, 'carbs': 2.0},
    {'id': 17, 'food': 'Макароны (сухие)', 'calories': 35.0, 'protein': 1.2, 'fat': 0.2, 'carbs': 7.1},
    {'id': 18, 'food': 'Макароны (отварные)', 'calories': 13.0, 'protein': 0.4, 'fat': 0.1, 'carbs': 2.6},

    # --- Молочные продукты ---
    {'id': 19, 'food': 'Творог 5% (сырой)', 'calories': 12.1, 'protein': 1.7, 'fat': 0.5, 'carbs': 0.3},
    {'id': 20, 'food': 'Сыр Тильзитер 45%', 'calories': 34.0, 'protein': 2.5, 'fat': 2.6, 'carbs': 0.0},

    # --- Овощи и фрукты ---
    {'id': 21, 'food': 'Картофель (сырой)', 'calories': 7.7, 'protein': 0.2, 'fat': 0.0, 'carbs': 1.7},
    {'id': 22, 'food': 'Картофель (фри/жареный)', 'calories': 28.0, 'protein': 0.4, 'fat': 1.6, 'carbs': 3.0},
    {'id': 23, 'food': 'Огурец свежий', 'calories': 1.5, 'protein': 0.1, 'fat': 0.0, 'carbs': 0.3},
    {'id': 24, 'food': 'Помидор свежий', 'calories': 2.0, 'protein': 0.1, 'fat': 0.0, 'carbs': 0.4},
    {'id': 25, 'food': 'Банан свежий', 'calories': 9.5, 'protein': 0.1, 'fat': 0.0, 'carbs': 2.2},
    {'id': 26, 'food': 'Яблоко свежее', 'calories': 5.0, 'protein': 0.0, 'fat': 0.0, 'carbs': 1.2}
]

@app.get('/foods')
def get_all_foods():
    return food_db

class CalculationRequest(BaseModel):
    product_id: int
    weight_grams: float

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