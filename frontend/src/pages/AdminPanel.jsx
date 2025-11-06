import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pollsAPI, teamsAPI, feedbackAPI, votesAPI } from '../services/api';
import { showToast } from '../utils/toast';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, polls: 0, votes: 0, teams: 0 });
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pollsRes, teamsRes, votesRes] = await Promise.all([
        pollsAPI.getAll(),
        teamsAPI.getAll(),
        votesAPI.getAll(),
      ]);

      setPolls(pollsRes.data);
      setStats({
        users: 0,  // Endpoint не существует в бэкенде
        polls: pollsRes.data.length,
        votes: votesRes.data.length,
        teams: teamsRes.data.length
      });
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      showToast.error('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePoll = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот опрос?')) {
      try {
        await pollsAPI.delete(id);
        showToast.success('Опрос удалён');
        loadData();
      } catch (error) {
        console.error('Ошибка удаления:', error);
        showToast.error('Не удалось удалить опрос');
      }
    }
  };

  const handleEditPoll = (pollId) => {
    navigate(`/polls/${pollId}`);
  };

  const handleCreatePoll = () => {
    navigate('/polls/new');
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="container admin-panel">
      <h1 className="page-title">Админ-панель</h1>

      <div className="admin-stats grid grid-4">
        <div className="stat-card card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.users || 'N/A'}</h3>
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
          <button className="btn btn-primary" onClick={handleCreatePoll}>
            + Создать опрос
          </button>
        </div>

        {polls.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">📊</div>
            <h3>Опросов пока нет</h3>
            <p>Создайте первый опрос для начала работы</p>
            <button className="btn btn-primary mt-2" onClick={handleCreatePoll}>
              Создать опрос
            </button>
          </div>
        ) : (
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
                    <td>#{poll.id}</td>
                    <td className="poll-name-cell">{poll.name}</td>
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
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleEditPoll(poll.id)}
                          title="Просмотр опроса"
                        >
                          👁️
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeletePoll(poll.id)}
                          title="Удалить опрос"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
