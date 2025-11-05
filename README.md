# Избирательная комиссия Брянской области

Информационная система для управления избирательными процессами.

## Технологии

### Backend
- **FastAPI** - современный веб-фреймворк для создания API
- **SQLAlchemy** - ORM для работы с базой данных
- **SQLite** - легковесная база данных
- **JWT** - аутентификация и авторизация
- **Pydantic** - валидация данных

### Frontend
- **React** - библиотека для создания пользовательских интерфейсов
- **Material-UI** - современная UI библиотека
- **Vite** - сборщик проекта
- **Axios** - HTTP клиент
- **Zustand** - управление состоянием
- **React Router** - маршрутизация

## Структура БД

Система включает следующие таблицы:
- **Роли** (admin, staff, party, voter)
- **Пользователи** (Users)
- **Избиратели** (Voters)
- **Партии** (Parties)
- **Сотрудники** (Staff)
- **Выборы** (Elections)
- **Голосование** (Votes)
- **Жалобы** (Complaints)
- **Результаты** (VotingResults)

## Установка и запуск

### Backend

1. Перейдите в папку backend:
```bash
cd backend
```

2. Создайте виртуальное окружение:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows
```

3. Установите зависимости:
```bash
pip install -r requirements.txt
```

4. Создайте файл .env:
```bash
cp .env.example .env
```

5. Запустите сервер:
```bash
python main.py
```

Сервер будет доступен по адресу: http://localhost:8000

API документация: http://localhost:8000/docs

### Frontend

1. Перейдите в папку frontend:
```bash
cd frontend
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите dev-сервер:
```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

## Учетные данные по умолчанию

### Администратор
- **Email**: admin@election.ru
- **Login**: admin
- **Password**: admin123

### Регистрация новых пользователей

Система поддерживает регистрацию трех типов пользователей:
1. **Избиратель** (Voter) - может голосовать, подавать жалобы
2. **Партия** (Party) - может просматривать результаты
3. **Сотрудник** (Staff) - может обрабатывать жалобы

## Функциональность

### Администратор (Admin)
- Управление всеми выборами (создание, редактирование, удаление)
- Просмотр всех избирателей
- Просмотр всех партий
- Управление сотрудниками
- Просмотр всех голосов
- Управление жалобами
- Управление результатами голосования

### Сотрудник (Staff)
- Просмотр и обработка жалоб
- Просмотр результатов выборов
- Доступ к статистике

### Избиратель (Voter)
- Регистрация в системе
- Участие в голосовании
- Подача жалоб
- Просмотр результатов выборов
- Управление профилем

### Партия (Party)
- Регистрация в системе
- Просмотр результатов выборов
- Просмотр статистики по партии

## API Endpoints

### Аутентификация
- `POST /api/v1/auth/login` - Вход в систему
- `POST /api/v1/auth/register/voter` - Регистрация избирателя
- `POST /api/v1/auth/register/party` - Регистрация партии
- `POST /api/v1/auth/register/staff` - Регистрация сотрудника
- `GET /api/v1/auth/me` - Получить данные текущего пользователя

### Выборы
- `GET /api/v1/elections` - Список всех выборов
- `POST /api/v1/elections` - Создать выборы (admin)
- `PUT /api/v1/elections/{id}` - Обновить выборы (admin)
- `DELETE /api/v1/elections/{id}` - Удалить выборы (admin)

### Избиратели
- `GET /api/v1/voters` - Список избирателей (admin)
- `GET /api/v1/voters/{id}` - Данные избирателя
- `PUT /api/v1/voters/{id}` - Обновить данные
- `DELETE /api/v1/voters/{id}` - Удалить избирателя (admin)

### Партии
- `GET /api/v1/parties` - Список всех партий
- `GET /api/v1/parties/{id}` - Данные партии
- `PUT /api/v1/parties/{id}` - Обновить партию
- `DELETE /api/v1/parties/{id}` - Удалить партию (admin)

### Голосование
- `GET /api/v1/votes` - Список голосов (admin)
- `POST /api/v1/votes` - Проголосовать
- `DELETE /api/v1/votes/{id}` - Удалить голос (admin)

### Жалобы
- `GET /api/v1/complaints` - Список жалоб (staff, admin)
- `POST /api/v1/complaints` - Создать жалобу
- `PUT /api/v1/complaints/{id}` - Обновить жалобу (staff, admin)
- `DELETE /api/v1/complaints/{id}` - Удалить жалобу (staff, admin)

### Результаты
- `GET /api/v1/results` - Результаты голосования
- `POST /api/v1/results` - Добавить результаты (admin)
- `PUT /api/v1/results/{id}` - Обновить результаты (admin)
- `DELETE /api/v1/results/{id}` - Удалить результаты (admin)

## Особенности

- ✅ Современный и красивый UI с Material-UI
- ✅ Адаптивный дизайн (mobile-friendly)
- ✅ JWT аутентификация
- ✅ Разделение прав доступа (admin, staff, party, voter)
- ✅ Полный CRUD для всех сущностей
- ✅ Валидация данных на клиенте и сервере
- ✅ Автоматическая инициализация БД
- ✅ API документация (Swagger)

## Разработка

### Backend
```bash
cd backend
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm run dev
```

## Производство

### Backend
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Лицензия

MIT

## Автор

Информационная система избирательной комиссии Брянской области
