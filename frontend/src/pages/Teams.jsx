import React, { useEffect, useState } from 'react';
import { teamsAPI } from '../services/api';
import { showToast } from '../utils/toast';
import './Teams.css';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
  });

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const response = await teamsAPI.getAll();
      setTeams(response.data);
    } catch (error) {
      console.error('Failed to load teams:', error);
      showToast.error('Не удалось загрузить команды');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast.error('Введите название команды');
      return;
    }

    setSubmitting(true);
    try {
      const teamData = {
        ...formData,
        registration_date: new Date().toISOString(),
      };

      if (editingTeam) {
        await teamsAPI.update(editingTeam.id, teamData);
        showToast.success('Команда обновлена!');
      } else {
        await teamsAPI.create(teamData);
        showToast.success('Команда создана!');
      }

      resetForm();
      loadTeams();
    } catch (error) {
      console.error('Failed to save team:', error);
      showToast.error(error.response?.data?.detail || 'Не удалось сохранить команду');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      description: team.description || '',
      status: team.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (teamId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту команду?')) {
      return;
    }

    try {
      await teamsAPI.delete(teamId);
      showToast.success('Команда удалена');
      loadTeams();
    } catch (error) {
      console.error('Failed to delete team:', error);
      showToast.error('Не удалось удалить команду');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: 'active',
    });
    setEditingTeam(null);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container teams-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Управление командами</h1>
          <p>Создавайте и управляйте командами для групповых голосований</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Отмена' : '+ Создать команду'}
        </button>
      </div>

      {showForm && (
        <div className="team-form-section card">
          <h2>{editingTeam ? 'Редактировать команду' : 'Новая команда'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Название команды *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Введите название команды"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">
                Описание
              </label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Описание команды..."
                rows="4"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="status">
                Статус
              </label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">Активна</option>
                <option value="inactive">Неактивна</option>
              </select>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={resetForm}
                disabled={submitting}
              >
                Отмена
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Сохранение...' : editingTeam ? 'Обновить' : 'Создать'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="teams-list-section">
        <h2>Все команды ({teams.length})</h2>
        {teams.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">👥</div>
            <h3>Команд пока нет</h3>
            <p>Создайте первую команду для организации групповых голосований</p>
          </div>
        ) : (
          <div className="teams-grid">
            {teams.map((team) => (
              <div key={team.id} className="team-card card">
                <div className="team-header">
                  <h3 className="team-name">{team.name}</h3>
                  <span className={`status-badge status-${team.status === 'active' ? 'active' : 'cancelled'}`}>
                    {team.status === 'active' ? 'Активна' : 'Неактивна'}
                  </span>
                </div>

                {team.description && (
                  <p className="team-description">{team.description}</p>
                )}

                <div className="team-meta">
                  <div className="meta-row">
                    <span className="meta-label">Дата создания:</span>
                    <span className="meta-value">{formatDate(team.registration_date || team.created_at)}</span>
                  </div>
                  {team.id && (
                    <div className="meta-row">
                      <span className="meta-label">ID команды:</span>
                      <span className="meta-value">#{team.id}</span>
                    </div>
                  )}
                </div>

                <div className="team-actions">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => handleEdit(team)}
                  >
                    Редактировать
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(team.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
