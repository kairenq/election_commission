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

      // Ensure we have arrays
      const pollsData = Array.isArray(pollsRes.data) ? pollsRes.data : [];
      const teamsData = Array.isArray(teamsRes.data) ? teamsRes.data : [];
      const feedbackData = Array.isArray(feedbackRes.data) ? feedbackRes.data : [];

      setStats({
        polls: pollsData.length,
        teams: teamsData.length,
        feedback: feedbackData.length,
      });

      setRecentPolls(pollsData);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      // Set empty arrays on error
      setRecentPolls([]);
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
        <h1>Добро пожаловать, {user?.full_name || user?.username}!</h1>
        <p>Управляйте голосованиями, просматривайте результаты и взаимодействуйте с участниками</p>
      </div>

      <div className="stats-grid grid grid-3">
        <div className="stat-card card">
          <div className="stat-icon">🗳️</div>
          <div className="stat-content">
            <h3>{stats.polls}</h3>
            <p>Всего голосований</p>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.teams}</h3>
            <p>Зарегистрированных команд</p>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <h3>{stats.feedback}</h3>
            <p>Обращений обратной связи</p>
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
          <div className="card text-center" style={{ padding: '3rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗳️</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Голосований пока нет</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Создайте своё первое голосование, чтобы начать собирать мнения участников
            </p>
            <Link to="/polls/new" className="btn btn-primary">
              + Создать голосование
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
            <span className="action-icon">🗳️</span>
            <h3>Создать голосование</h3>
            <p>Запустить новое голосование или опрос</p>
          </Link>

          <Link to="/polls" className="action-card card">
            <span className="action-icon">📊</span>
            <h3>Все голосования</h3>
            <p>Просмотреть все опросы и результаты</p>
          </Link>

          <Link to="/teams" className="action-card card">
            <span className="action-icon">👥</span>
            <h3>Команды</h3>
            <p>Управление командами участников</p>
          </Link>

          <Link to="/feedback" className="action-card card">
            <span className="action-icon">💬</span>
            <h3>Обратная связь</h3>
            <p>Отправить обращение или предложение</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
