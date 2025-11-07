import React, { useEffect, useState } from 'react';
import { teamsAPI, participantsAPI } from '../services/api';
import { showToast } from '../utils/toast';
import { useAuth } from '../context/AuthContext';
import './Teams.css';

const Teams = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [myParticipant, setMyParticipant] = useState(null);
  const [expandedTeams, setExpandedTeams] = useState({});
  const [teamMembers, setTeamMembers] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
  });

  const isAdmin = user?.is_superuser || user?.role_id === 1;

  useEffect(() => {
    loadTeams();
    loadMyParticipant();
  }, []);

  const loadTeams = async () => {
    try {
      const response = await teamsAPI.getAll();
      setTeams(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to load teams:', error);
      showToast.error('Не удалось загрузить команды');
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMyParticipant = async () => {
    try {
      const response = await participantsAPI.getMe();
      setMyParticipant(response.data);
    } catch (error) {
      // No participant record yet - that's ok
      setMyParticipant(null);
    }
  };

  const loadTeamMembers = async (teamId) => {
    try {
      const response = await teamsAPI.getWithMembers(teamId);
      setTeamMembers(prev => ({ ...prev, [teamId]: response.data.members || [] }));
    } catch (error) {
      console.error('Failed to load team members:', error);
      showToast.error('Не удалось загрузить членов команды');
    }
  };

  const toggleTeamExpansion = async (teamId) => {
    const isExpanded = expandedTeams[teamId];
    setExpandedTeams(prev => ({ ...prev, [teamId]: !isExpanded }));

    if (!isExpanded && !teamMembers[teamId]) {
      await loadTeamMembers(teamId);
    }
  };

  const handleJoinTeam = async (teamId) => {
    try {
      await participantsAPI.joinTeam(teamId);
      showToast.success('Вы присоединились к команде!');
      await loadMyParticipant();
      // Reload team members if team is expanded
      if (expandedTeams[teamId]) {
        await loadTeamMembers(teamId);
      }
    } catch (error) {
      console.error('Failed to join team:', error);
      showToast.error(error.response?.data?.detail || 'Не удалось присоединиться к команде');
    }
  };

  const handleLeaveTeam = async () => {
    if (!window.confirm('Вы уверены, что хотите покинуть команду?')) {
      return;
    }

    try {
      await participantsAPI.leaveTeam();
      showToast.success('Вы покинули команду');
      await loadMyParticipant();
      // Reload all expanded teams
      for (const teamId in expandedTeams) {
        if (expandedTeams[teamId]) {
          await loadTeamMembers(teamId);
        }
      }
    } catch (error) {
      console.error('Failed to leave team:', error);
      showToast.error('Не удалось покинуть команду');
    }
  };

  const handleRemoveMember = async (participantId, teamId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого участника из команды?')) {
      return;
    }

    try {
      await participantsAPI.removeFromTeam(participantId);
      showToast.success('Участник удален из команды');
      await loadTeamMembers(teamId);
    } catch (error) {
      console.error('Failed to remove member:', error);
      showToast.error('Не удалось удалить участника');
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
        {isAdmin && (
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
          >
            {showForm ? 'Отмена' : '+ Создать команду'}
          </button>
        )}
      </div>

      {myParticipant && myParticipant.team_id && (
        <div className="my-team-section card">
          <h3>Моя команда</h3>
          <p>Вы состоите в команде: <strong>{teams.find(t => t.id === myParticipant.team_id)?.name || `ID ${myParticipant.team_id}`}</strong></p>
          <button
            className="btn btn-sm btn-outline"
            onClick={handleLeaveTeam}
          >
            Покинуть команду
          </button>
        </div>
      )}

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
            {teams.map((team) => {
              const isMyTeam = myParticipant?.team_id === team.id;
              const isExpanded = expandedTeams[team.id];
              const members = teamMembers[team.id] || [];

              return (
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
                    <div className="meta-row">
                      <span className="meta-label">Членов:</span>
                      <span className="meta-value">{members.length || 0}</span>
                    </div>
                  </div>

                  {/* Members list */}
                  <div className="team-members-section">
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => toggleTeamExpansion(team.id)}
                    >
                      {isExpanded ? '▼ Скрыть членов' : '▶ Показать членов'}
                    </button>

                    {isExpanded && (
                      <div className="members-list">
                        {members.length === 0 ? (
                          <p className="empty-members">В команде пока нет участников</p>
                        ) : (
                          <ul>
                            {members.map((member) => (
                              <li key={member.id} className="member-item">
                                <div className="member-info">
                                  <span className="member-name">{member.full_name}</span>
                                  {member.email && <span className="member-email">{member.email}</span>}
                                </div>
                                {isAdmin && (
                                  <button
                                    className="btn btn-xs btn-danger"
                                    onClick={() => handleRemoveMember(member.id, team.id)}
                                  >
                                    Удалить
                                  </button>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="team-actions">
                    {!isMyTeam && !myParticipant?.team_id && team.status === 'active' && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleJoinTeam(team.id)}
                      >
                        Присоединиться
                      </button>
                    )}
                    {isMyTeam && (
                      <span className="my-team-badge">Моя команда</span>
                    )}
                    {isAdmin && (
                      <>
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
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
