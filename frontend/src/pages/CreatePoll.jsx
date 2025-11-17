import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pollsAPI, teamsAPI } from '../services/api';
import { showToast } from '../utils/toast';
import './CreatePoll.css';

const CreatePoll = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);

  // Set default dates: now and +7 days
  const now = new Date();
  const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const formatDateTimeLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    poll_type: 'corporate_survey',
    status: 'draft',
    start_date: formatDateTimeLocal(now),
    end_date: formatDateTimeLocal(weekLater),
    team_id: '',
  });
  const [options, setOptions] = useState([
    { name: '', description: '' },
    { name: '', description: '' },
  ]);

  const pollTypes = [
    { value: 'corporate_survey', label: 'Корпоративный опрос' },
    { value: 'project_voting', label: 'Голосование по проекту' },
    { value: 'feedback', label: 'Обратная связь' },
    { value: 'election', label: 'Выборы' },
    { value: 'general', label: 'Общий опрос' },
  ];

  // Fetch teams on component mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await teamsAPI.getAll();
        setTeams(response.data || []);
      } catch (error) {
        console.error('Failed to fetch teams:', error);
        showToast.error('Не удалось загрузить список команд');
      }
    };
    fetchTeams();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { name: '', description: '' }]);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    } else {
      showToast.error('Минимум 2 варианта ответа');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      showToast.error('Введите название опроса');
      return;
    }

    const validOptions = options.filter(opt => opt.name.trim());
    if (validOptions.length < 2) {
      showToast.error('Нужно минимум 2 варианта ответа');
      return;
    }

    if (formData.start_date && formData.end_date) {
      if (new Date(formData.start_date) >= new Date(formData.end_date)) {
        showToast.error('Дата окончания должна быть позже даты начала');
        return;
      }
    }

    setLoading(true);
    try {
      // Prepare poll data with options
      const pollData = {
        ...formData,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : new Date().toISOString(),
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        team_id: formData.team_id ? parseInt(formData.team_id) : null,
        options: validOptions,  // Include options in the request
      };

      const response = await pollsAPI.create(pollData);
      showToast.success('Опрос создан успешно!');
      navigate(`/polls/${response.data.id}`);
    } catch (error) {
      console.error('Failed to create poll:', error);
      showToast.error(error.response?.data?.detail || 'Не удалось создать опрос');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container create-poll-page">
      <div className="page-header">
        <h1>Создать новый опрос</h1>
        <p>Заполните форму для создания опроса или голосования</p>
      </div>

      <form onSubmit={handleSubmit} className="create-poll-form">
        <div className="form-section card">
          <h2>Основная информация</h2>

          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Название опроса *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Например: Выбор корпоративного мероприятия"
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
              placeholder="Подробное описание опроса..."
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="poll_type">
                Тип опроса *
              </label>
              <select
                id="poll_type"
                name="poll_type"
                className="form-select"
                value={formData.poll_type}
                onChange={handleInputChange}
              >
                {pollTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
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
                <option value="draft">Черновик</option>
                <option value="active">Активен</option>
                <option value="completed">Завершён</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="team_id">
              Команда
            </label>
            <select
              id="team_id"
              name="team_id"
              className="form-select"
              value={formData.team_id}
              onChange={handleInputChange}
            >
              <option value="">Все команды (не выбрано)</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <small className="form-hint">Выберите команду, если опрос предназначен для конкретной команды</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="start_date">
                Дата и время начала
              </label>
              <input
                type="datetime-local"
                id="start_date"
                name="start_date"
                className="form-input"
                value={formData.start_date}
                onChange={handleInputChange}
                min={formatDateTimeLocal(new Date())}
                max={formData.end_date}
              />
              <small className="form-hint">Установлено на текущее время</small>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="end_date">
                Дата и время окончания
              </label>
              <input
                type="datetime-local"
                id="end_date"
                name="end_date"
                className="form-input"
                value={formData.end_date}
                onChange={handleInputChange}
                min={formData.start_date}
              />
              <small className="form-hint">Установлено на +7 дней от начала</small>
            </div>
          </div>
        </div>

        <div className="form-section card">
          <div className="section-header flex-between">
            <h2>Варианты ответов</h2>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={addOption}
            >
              + Добавить вариант
            </button>
          </div>

          <div className="options-list">
            {options.map((option, index) => (
              <div key={index} className="option-item">
                <div className="option-number">{index + 1}</div>
                <div className="option-fields">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Название варианта *"
                      value={option.name}
                      onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Описание (опционально)"
                      value={option.description}
                      onChange={(e) => handleOptionChange(index, 'description', e.target.value)}
                    />
                  </div>
                </div>
                {options.length > 2 && (
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeOption(index)}
                    title="Удалить вариант"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/polls')}
            disabled={loading}
          >
            Отмена
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Создание...' : 'Создать опрос'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePoll;
