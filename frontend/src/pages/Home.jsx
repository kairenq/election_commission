import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content container">
          <h1 className="hero-title">Система Электронного Голосования</h1>
          <p className="hero-subtitle">
            Современная платформа для проведения опросов, голосований и сбора обратной связи.
            Прозрачно, безопасно и удобно.
          </p>
          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-secondary btn-lg">
                Открыть панель управления
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-secondary btn-lg">
                  Создать аккаунт
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'white' }}>
                  Войти в систему
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Ключевые возможности</h2>
          <div className="grid grid-3">
            <div className="feature-card card">
              <div className="feature-icon">🗳️</div>
              <h3>Создание голосований</h3>
              <p>Быстро создавайте опросы и голосования с несколькими вариантами ответов</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">📊</div>
              <h3>Результаты в реальном времени</h3>
              <p>Отслеживайте ход голосования и просматривайте детальную статистику</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">👥</div>
              <h3>Управление участниками</h3>
              <p>Организуйте пользователей в команды для групповых голосований</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">🔒</div>
              <h3>Безопасность данных</h3>
              <p>Защита голосов с помощью аутентификации и шифрования данных</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">💬</div>
              <h3>Обратная связь</h3>
              <p>Встроенная система для сбора предложений и обращений участников</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">📱</div>
              <h3>Адаптивный дизайн</h3>
              <p>Работает на всех устройствах - компьютере, планшете и смартфоне</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
