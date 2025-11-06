import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pollsAPI, teamsAPI, feedbackAPI, votesAPI } from '../services/api';
import { showToast } from '../utils/toast';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, polls: 0, votes: 0, teams: 0, feedback: 0 });
  const [polls, setPolls] = useState([]);
  const [teams, setTeams] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, polls, teams, feedback

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pollsRes, teamsRes, votesRes, feedbackRes] = await Promise.all([
        pollsAPI.getAll(),
        teamsAPI.getAll(),
        votesAPI.getAll(),
        feedbackAPI.getAll(),
      ]);

      setPolls(pollsRes.data);
      setTeams(teamsRes.data);
      setFeedbackList(feedbackRes.data);
      setStats({
        users: 0,  // Endpoint не существует в бэкенде
        polls: pollsRes.data.length,
        votes: votesRes.data.length,
        teams: teamsRes.data.length,
        feedback: feedbackRes.data.length,
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

  const handleDeleteTeam = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту команду?')) {
      try {
        await teamsAPI.delete(id);
        showToast.success('Команда удалена');
        loadData();
      } catch (error) {
        console.error('Ошибка удаления:', error);
        showToast.error('Не удалось удалить команду');
      }
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это обращение?')) {
      try {
        await feedbackAPI.delete(id);
        showToast.success('Обращение удалено');
        loadData();
      } catch (error) {
        console.error('Ошибка удаления:', error);
        showToast.error('Не удалось удалить обращение');
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

  // Calculate additional statistics
  const activePolls = polls.filter(p => p.status === 'active').length;
  const completedPolls = polls.filter(p => p.status === 'completed').length;
  const draftPolls = polls.filter(p => p.status === 'draft').length;
  const openFeedback = feedbackList.filter(f => f.status === 'open').length;

  return (
    <div className="container admin-panel">
      <div className="admin-header">
        <div>
          <h1 className="page-title">Панель администратора</h1>
          <p className="page-subtitle">Полный контроль над системой голосования</p>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="admin-stats grid grid-4">
        <div className="stat-card card">
          <div className="stat-icon">🗳️</div>
          <div className="stat-info">
            <h3>{stats.votes}</h3>
            <p>Всего голосов</p>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{stats.polls}</h3>
            <p>Опросов создано</p>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.teams}</h3>
            <p>Активных команд</p>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">💬</div>
          <div className="stat-info">
            <h3>{stats.feedback}</h3>
            <p>Обращений</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📈 Обзор
        </button>
        <button
          className={`tab-button ${activeTab === 'polls' ? 'active' : ''}`}
          onClick={() => setActiveTab('polls')}
        >
          🗳️ Опросы ({stats.polls})
        </button>
        <button
          className={`tab-button ${activeTab === 'teams' ? 'active' : ''}`}
          onClick={() => setActiveTab('teams')}
        >
          👥 Команды ({stats.teams})
        </button>
        <button
          className={`tab-button ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          💬 Обратная связь ({openFeedback}/{stats.feedback})
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="admin-overview">
          <div className="overview-grid grid grid-3">
            <div className="overview-card card">
              <h3>Статус опросов</h3>
              <div className="overview-stats">
                <div className="overview-stat-item">
                  <span className="status-badge status-active">Активные</span>
                  <span className="stat-value">{activePolls}</span>
                </div>
                <div className="overview-stat-item">
                  <span className="status-badge status-completed">Завершённые</span>
                  <span className="stat-value">{completedPolls}</span>
                </div>
                <div className="overview-stat-item">
                  <span className="status-badge status-draft">Черновики</span>
                  <span className="stat-value">{draftPolls}</span>
                </div>
              </div>
            </div>

            <div className="overview-card card">
              <h3>Обратная связь</h3>
              <div className="overview-stats">
                <div className="overview-stat-item">
                  <span className="feedback-status open">Открытые</span>
                  <span className="stat-value">{openFeedback}</span>
                </div>
                <div className="overview-stat-item">
                  <span className="feedback-status resolved">Решённые</span>
                  <span className="stat-value">
                    {feedbackList.filter(f => f.status === 'resolved').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="overview-card card">
              <h3>Быстрые действия</h3>
              <div className="quick-actions-list">
                <button className="btn btn-primary btn-sm btn-block" onClick={handleCreatePoll}>
                  + Создать опрос
                </button>
                <button className="btn btn-secondary btn-sm btn-block" onClick={() => navigate('/teams')}>
                  + Создать команду
                </button>
              </div>
            </div>
          </div>

          <div className="recent-activity card">
            <h3>Последняя активность</h3>
            <div className="activity-list">
              {polls.slice(0, 5).map((poll) => (
                <div key={poll.id} className="activity-item">
                  <div className="activity-icon">🗳️</div>
                  <div className="activity-content">
                    <p><strong>{poll.name}</strong></p>
                    <span className="activity-time">
                      Создано: {new Date(poll.created_at).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <span className={`status-badge status-${poll.status}`}>
                    {poll.status === 'active' ? 'Активен' : poll.status === 'draft' ? 'Черновик' : 'Завершён'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Polls Tab */}
      {activeTab === 'polls' && (
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
      )}

      {/* Teams Tab */}
      {activeTab === 'teams' && (
        <div className="admin-section">
          <div className="section-header flex-between">
            <h2>Управление командами</h2>
            <button className="btn btn-primary" onClick={() => navigate('/teams')}>
              + Создать команду
            </button>
          </div>

          {teams.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-icon">👥</div>
              <h3>Команд пока нет</h3>
              <p>Создайте первую команду</p>
            </div>
          ) : (
            <div className="teams-admin-grid">
              {teams.map((team) => (
                <div key={team.id} className="team-admin-card card">
                  <div className="team-card-header">
                    <h3>{team.name}</h3>
                    <span className={`status-badge status-${team.status === 'active' ? 'active' : 'cancelled'}`}>
                      {team.status === 'active' ? 'Активна' : 'Неактивна'}
                    </span>
                  </div>
                  {team.description && <p className="team-description">{team.description}</p>}
                  <div className="team-card-footer">
                    <span className="team-date">
                      Создана: {new Date(team.created_at).toLocaleDateString('ru-RU')}
                    </span>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteTeam(team.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="admin-section">
          <div className="section-header">
            <h2>Обратная связь</h2>
          </div>

          {feedbackList.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-icon">💬</div>
              <h3>Обращений пока нет</h3>
            </div>
          ) : (
            <div className="feedback-admin-list">
              {feedbackList.map((feedback) => (
                <div key={feedback.id} className="feedback-admin-card card">
                  <div className="feedback-card-header">
                    <div className="feedback-type-badge">
                      {feedback.feedback_type === 'complaint' && '⚠️ Жалоба'}
                      {feedback.feedback_type === 'suggestion' && '💡 Предложение'}
                      {feedback.feedback_type === 'question' && '❓ Вопрос'}
                      {feedback.feedback_type === 'bug_report' && '🐛 Баг-репорт'}
                    </div>
                    <span className={`status-badge status-${feedback.status === 'open' ? 'active' : 'completed'}`}>
                      {feedback.status === 'open' ? 'Открыто' :
                       feedback.status === 'resolved' ? 'Решено' :
                       feedback.status === 'in_progress' ? 'В работе' : 'Закрыто'}
                    </span>
                  </div>
                  <h3>{feedback.title}</h3>
                  <p className="feedback-description">{feedback.description}</p>
                  <div className="feedback-card-footer">
                    <span className="feedback-date">
                      {new Date(feedback.created_at).toLocaleDateString('ru-RU')}
                    </span>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteFeedback(feedback.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
