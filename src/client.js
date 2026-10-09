const API_URL = 'http://127.0.0.1:8000/calculate';

// export async function getProductNameByID() {
     
// }

export async function sendCalculation(productId, weightGrams) {
  // Отменяем если данные не переданы
  if (!productId || !weightGrams) {
    console.warn("sendCalculation: Переданы пустые параметры");
    return null;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ // Переводим данные в int и float для питона
        product_id: parseInt(productId),
        weight_grams: parseFloat(weightGrams)
      }),
    });

    // Собираем ответ JSON
    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Ошибка при отправке запроса на бэкенд:", error);
    alert("Не удалось связаться с Python сервером!");
    return null;
  }
}