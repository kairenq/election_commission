# 🚀 Deployment Guide

## Готовые конфигурации для деплоя

Этот проект готов к деплою на:
- **Backend**: Render
- **Frontend**: Cloudflare Pages

---

## 🔧 Backend Deployment (Render)

### Автоматический деплой через render.yaml

1. Зарегистрируйтесь на [Render](https://render.com)
2. Создайте новый **Web Service**
3. Подключите GitHub репозиторий
4. Render автоматически обнаружит `render.yaml`

### Ручная настройка

Если render.yaml не работает:

1. **Create New** → **Web Service**
2. **Settings**:
   - **Name**: `voting-platform-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Environment Variables**:
   ```
   SECRET_KEY=generate-secure-random-string-here
   DATABASE_URL=sqlite:///./voting_platform.db
   BACKEND_CORS_ORIGINS=https://your-frontend.pages.dev
   DEBUG=False
   ```

4. **Deploy** → Дождитесь сборки

### Health Check для Uptime Monitoring

Backend поддерживает GET и HEAD запросы на `/health`:

```bash
# GET запрос
curl https://your-backend.onrender.com/health

# HEAD запрос (для аптайм мониторинга)
curl -I https://your-backend.onrender.com/health
```

Ответ:
```json
{
  "status": "ok",
  "app": "Voting Platform API"
}
```

### Настройка Uptime Robot

1. Зарегистрируйтесь на [UptimeRobot](https://uptimerobot.com)
2. **Add New Monitor**:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: Voting Platform API
   - **URL**: `https://your-backend.onrender.com/health`
   - **Monitoring Interval**: 5 минут
3. Monitor будет отправлять HEAD запросы каждые 5 минут
4. Это предотвратит "засыпание" Free tier на Render

### PostgreSQL Database (опционально)

Для продакшена рекомендуется PostgreSQL:

1. В Render создайте **PostgreSQL Database**
2. Скопируйте **Internal Database URL**
3. Добавьте в переменные окружения:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   ```

---

## 🌐 Frontend Deployment (Cloudflare Pages)

### Через GitHub Integration

1. Войдите в [Cloudflare Dashboard](https://dash.cloudflare.com)
2. **Pages** → **Create a project** → **Connect to Git**
3. Выберите ваш GitHub репозиторий
4. **Build Settings**:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `frontend`

5. **Environment Variables**:
   ```
   NODE_VERSION=18
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

6. **Save and Deploy**

### Через Wrangler CLI

```bash
# Установить Wrangler
npm install -g wrangler

# Войти в Cloudflare
wrangler login

# Деплой
cd frontend
npm install
npm run build
wrangler pages deploy dist --project-name=voting-platform
```

### Custom Domain (опционально)

1. В Cloudflare Pages откройте ваш проект
2. **Custom domains** → **Set up a custom domain**
3. Следуйте инструкциям для добавления домена

---

## 🐳 Docker Deployment

### Локальный запуск

```bash
# Запустить всё приложение
docker-compose up

# В фоновом режиме
docker-compose up -d

# Остановить
docker-compose down
```

### Production Docker

```bash
# Backend
cd backend
docker build -t voting-platform-backend .
docker run -p 8000:8000 \
  -e SECRET_KEY=your-secret \
  -e DATABASE_URL=sqlite:///./voting_platform.db \
  voting-platform-backend

# Frontend
cd frontend
docker build -t voting-platform-frontend .
docker run -p 5173:5173 voting-platform-frontend
```

---

## 🔐 Security Checklist

Перед деплоем в продакшн:

- [ ] Изменить `SECRET_KEY` на случайную строку
- [ ] Установить `DEBUG=False`
- [ ] Настроить правильные CORS origins
- [ ] Использовать PostgreSQL вместо SQLite
- [ ] Включить HTTPS
- [ ] Настроить rate limiting
- [ ] Добавить мониторинг (UptimeRobot, Better Uptime)
- [ ] Настроить backup базы данных
- [ ] Проверить логи на наличие ошибок

---

## 📊 Мониторинг

### Рекомендуемые сервисы для мониторинга:

1. **UptimeRobot** (Free) - https://uptimerobot.com
   - HTTP(s) мониторинг
   - HEAD запросы на `/health`
   - Email уведомления

2. **Better Uptime** - https://betteruptime.com
   - Расширенный мониторинг
   - Incident management
   - Status page

3. **Sentry** - https://sentry.io
   - Error tracking
   - Performance monitoring
   - Интеграция с FastAPI

### Настройка мониторинга

```python
# В backend/app/main.py можно добавить Sentry
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn="your-sentry-dsn",
    integrations=[FastApiIntegration()],
)
```

---

## 🔄 CI/CD (опционально)

### GitHub Actions для автодеплоя

Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        run: echo "Render auto-deploys from GitHub"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Cloudflare Pages
        run: echo "Cloudflare auto-deploys from GitHub"
```

---

## 📝 Post-Deployment

После успешного деплоя:

1. Проверьте API: `https://your-backend.onrender.com/docs`
2. Проверьте frontend: `https://your-frontend.pages.dev`
3. Зарегистрируйте тестового пользователя
4. Создайте тестовый опрос
5. Проголосуйте и проверьте результаты
6. Настройте UptimeRobot для предотвращения сна сервера

---

## 🆘 Troubleshooting

### Backend не запускается на Render

- Проверьте логи в Render Dashboard
- Убедитесь что `requirements.txt` содержит все зависимости
- Проверьте переменные окружения

### Frontend не подключается к API

- Проверьте переменную `VITE_API_URL`
- Убедитесь что CORS настроен правильно
- Проверьте что backend запущен

### Database ошибки

- Для SQLite убедитесь что есть права на запись
- Для PostgreSQL проверьте CONNECTION_STRING
- Проверьте логи миграций

### CORS ошибки

В backend обновите `BACKEND_CORS_ORIGINS`:
```python
BACKEND_CORS_ORIGINS = [
    "https://your-frontend.pages.dev",
    "http://localhost:5173"
]
```

---

## 💡 Tips

1. **Free Tier на Render засыпает** через 15 минут неактивности
   - Используйте UptimeRobot для пингов каждые 5 минут

2. **Cloudflare Pages** предлагает:
   - Неограниченные запросы
   - Automatic SSL
   - Global CDN
   - Analytics

3. **Дождитесь прогрева** backend после деплоя:
   - Первый запрос может занять 30-60 секунд
   - UptimeRobot поможет держать сервис "теплым"

---

Made with ❤️ for deployment success!
