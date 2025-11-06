import React, { useEffect, useState } from 'react';
import { pollsAPI, teamsAPI, feedbackAPI } from '../services/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const [stats, setStats] = useState({ users: 0, polls: 0, votes: 0, teams: 0 });
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pollsRes, teamsRes] = await Promise.all([
        pollsAPI.getAll(),
        teamsAPI.getAll(),
      ]);

      setPolls(pollsRes.data);
      setStats({
        users: 45,  // Будет из API
        polls: pollsRes.data.length,
        votes: 128, // Будет из API
        teams: teamsRes.data.length
      });
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePoll = async (id) => {
    if (window.confirm('Удалить этот опрос?')) {
      try {
        await pollsAPI.delete(id);
        loadData();
      } catch (error) {
        alert('Ошибка удаления');
      }
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="container admin-panel">
      <h1 className="page-title">⚙️ Админ-панель</h1>

      <div className="admin-stats grid grid-4">
        <div className="stat-card card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.users}</h3>
            <p>Пользователей</p>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{stats.polls}</h3>
            <p>Опросов</p>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">🗳️</div>
          <div className="stat-info">
            <h3>{stats.votes}</h3>
            <p>Голосов</p>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">🏢</div>
          <div className="stat-info">
            <h3>{stats.teams}</h3>
            <p>Команд</p>
          </div>
        </div>
      </div>

      <div className="admin-section">
        <div className="section-header flex-between">
          <h2>Управление опросами</h2>
          <button className="btn btn-primary">➕ Создать опрос</button>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Тип</th>
                <th>Статус</th>
                <th>Дата создания</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {polls.map((poll) => (
                <tr key={poll.id}>
                  <td>{poll.id}</td>
                  <td>{poll.name}</td>
                  <td>{poll.poll_type || 'Опрос'}</td>
                  <td>
                    <span className={`status-badge status-${poll.status}`}>
                      {poll.status === 'active' ? 'Активен' :
                       poll.status === 'draft' ? 'Черновик' :
                       poll.status === 'completed' ? 'Завершён' : poll.status}
                    </span>
                  </td>
                  <td>{new Date(poll.created_at).toLocaleDateString('ru-RU')}</td>
                  <td>
                    <button className="btn btn-sm btn-outline mr-1">✏️</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeletePoll(poll.id)}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
