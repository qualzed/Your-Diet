const API_URL = 'http://192.168.1.102:8000';

export async function getProductList() {
  try {
    const response = await fetch(`${API_URL}/foodNameAndID`);
    const data = await response.json();
    return data;
  } catch(error) {
    console.error("Ошибка при отправке запроса на бэкенд:", error);
    alert("Не удалось связаться с Python сервером!");
    return null;
  }
}

export async function sendCalculation(productId, weightGrams) {
  // Отменяем если данные не переданы
  if (!productId || !weightGrams) {
    console.warn("sendCalculation: Переданы пустые параметры");
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/calculate`, {
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