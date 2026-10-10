CREATE TABLE IF NOT EXISTS accounts (
     id INTEGER,
     username VARCHAR(16), -- Не больше чем 16 символов в юзернейме
     pass VARCHAR(32), -- Пароль
     age INTEGER,
     gender INTEGER,  -- 0 - не указан, 1 - мужчина, 2 - женщина
     PRIMARY KEY (id), UNIQUE (username)
);
CREATE TABLE IF NOT EXISTS history (
     id INTEGER, -- Айди истории, записи в истории
     userID INTEGER, -- а тут айди юзера, типо кому принадлежит история
     time INTEGER, -- ну запишем в unix время этой записи
     foodID INTEGER, -- Айди еды, потом определим имя через айди что же он съел
     calories FLOAT, -- ну сколько калорий употребил
     fats FLOAT, -- жиры
     proteins FLOAT, -- белки
     carbs FLOAT, -- углеводы
     PRIMARY KEY (id)
);