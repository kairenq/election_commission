import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Платформа Корпоративного Голосования</h1>
          <p className="hero-subtitle">
            Создавайте опросы, собирайте отзывы и принимайте решения вместе
          </p>
          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Перейти в панель
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Начать работу
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Войти
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Возможности платформы</h2>
          <div className="grid grid-3">
            <div className="feature-card card">
              <div className="feature-icon">📊</div>
              <h3>Простое голосование</h3>
              <p>Создавайте и управляйте опросами для вашей команды в пару кликов</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">👥</div>
              <h3>Управление командами</h3>
              <p>Организуйте участников в команды и отслеживайте результаты</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">📈</div>
              <h3>Результаты в реальном времени</h3>
              <p>Просматривайте результаты голосования и аналитику онлайн</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">🔒</div>
              <h3>Безопасность</h3>
              <p>Ваши голоса защищены аутентификацией и шифрованием</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">💬</div>
              <h3>Система обратной связи</h3>
              <p>Собирайте и обрабатывайте отзывы от участников</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">🚀</div>
              <h3>Быстро и надёжно</h3>
              <p>Создано на современных технологиях для скорости и надёжности</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
