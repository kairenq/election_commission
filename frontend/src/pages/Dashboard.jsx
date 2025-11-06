import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pollsAPI, teamsAPI, feedbackAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    polls: 0,
    teams: 0,
    feedback: 0,
  });
  const [recentPolls, setRecentPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [pollsRes, teamsRes, feedbackRes] = await Promise.all([
        pollsAPI.getAll(0, 5),
        teamsAPI.getAll(),
        feedbackAPI.getAll(),
      ]);

      setStats({
        polls: pollsRes.data.length,
        teams: teamsRes.data.length,
        feedback: feedbackRes.data.length,
      });

      setRecentPolls(pollsRes.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container dashboard">
      <div className="dashboard-header">
        <h1>С возвращением, {user?.full_name || user?.username}! 👋</h1>
        <p>Вот что происходит с вашими опросами сегодня</p>
      </div>

      <div className="stats-grid grid grid-3">
        <div className="stat-card card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.polls}</h3>
            <p>Активных опросов</p>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.teams}</h3>
            <p>Команд</p>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <h3>{stats.feedback}</h3>
            <p>Отзывов</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header flex-between">
          <h2>Недавние опросы</h2>
          <Link to="/polls" className="btn btn-primary">
            Все опросы →
          </Link>
        </div>

        {recentPolls.length === 0 ? (
          <div className="card text-center">
            <p>Опросов пока нет. Создайте свой первый опрос!</p>
            <Link to="/polls/new" className="btn btn-primary mt-2">
              Создать опрос
            </Link>
          </div>
        ) : (
          <div className="polls-grid grid grid-2">
            {recentPolls.map((poll) => (
              <Link to={`/polls/${poll.id}`} key={poll.id} className="poll-card card">
                <h3>{poll.name}</h3>
                <p className="poll-description">{poll.description || 'Без описания'}</p>
                <div className="poll-meta">
                  <span className={`status-badge status-${poll.status}`}>
                    {poll.status === 'active' ? 'Активен' :
                     poll.status === 'draft' ? 'Черновик' :
                     poll.status === 'completed' ? 'Завершён' : poll.status}
                  </span>
                  <span className="poll-type">{poll.poll_type}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h2>Быстрые действия</h2>
        <div className="grid grid-2">
          <Link to="/polls/new" className="action-card card">
            <span className="action-icon">📝</span>
            <h3>Создать опрос</h3>
            <p>Начать новый опрос</p>
          </Link>

          <Link to="/teams" className="action-card card">
            <span className="action-icon">👥</span>
            <h3>Управление командами</h3>
            <p>Просмотр и организация команд</p>
          </Link>

          <Link to="/feedback/new" className="action-card card">
            <span className="action-icon">💬</span>
            <h3>Оставить отзыв</h3>
            <p>Поделиться мнением</p>
          </Link>

          <Link to="/polls" className="action-card card">
            <span className="action-icon">📊</span>
            <h3>Посмотреть результаты</h3>
            <p>Проверить результаты голосования</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
