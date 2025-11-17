import React, { useEffect, useState } from 'react';
import { feedbackAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../utils/toast';
import './Feedback.css';

const Feedback = () => {
  const { user } = useAuth();
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    feedback_type: 'suggestion',
    title: '',
    description: '',
  });

  const feedbackTypes = [
    { value: 'complaint', label: 'Жалоба', icon: '⚠️', color: '#dc2626' },
    { value: 'suggestion', label: 'Предложение', icon: '💡', color: '#f59e0b' },
    { value: 'question', label: 'Вопрос', icon: '❓', color: '#3b82f6' },
    { value: 'bug_report', label: 'Сообщение об ошибке', icon: '🐛', color: '#8b5cf6' },
  ];

  const statusLabels = {
    open: 'Открыто',
    in_progress: 'В обработке',
    resolved: 'Решено',
    closed: 'Закрыто',
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const response = await feedbackAPI.getAll();
      // Filter feedback by current user
      const allFeedback = Array.isArray(response.data) ? response.data : [];
      const userFeedback = allFeedback.filter(f => f.participant_id === user?.id);
      setFeedbackList(userFeedback);
    } catch (error) {
      console.error('Failed to load feedback:', error);
      showToast.error('Не удалось загрузить обратную связь');
      setFeedbackList([]);
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

    if (!formData.title.trim()) {
      showToast.error('Введите заголовок');
      return;
    }

    if (!formData.description.trim()) {
      showToast.error('Введите описание');
      return;
    }

    setSubmitting(true);
    try {
      await feedbackAPI.create({
        ...formData,
        participant_id: user.id,
        status: 'open',
      });

      showToast.success('Обратная связь отправлена!');
      setFormData({
        feedback_type: 'suggestion',
        title: '',
        description: '',
      });
      setShowForm(false);
      loadFeedback();
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      showToast.error(error.response?.data?.detail || 'Не удалось отправить обратную связь');
    } finally {
      setSubmitting(false);
    }
  };

  const getTypeInfo = (type) => {
    return feedbackTypes.find(t => t.value === type) || feedbackTypes[1];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
    <div className="container feedback-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Обратная связь</h1>
          <p>Отправьте нам свои предложения, вопросы или сообщения об ошибках</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Отмена' : '+ Новое обращение'}
        </button>
      </div>

      {showForm && (
        <div className="feedback-form-section card">
          <h2>Новое обращение</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="feedback_type">
                Тип обращения
              </label>
              <div className="type-selector">
                {feedbackTypes.map(type => (
                  <label
                    key={type.value}
                    className={`type-option ${formData.feedback_type === type.value ? 'selected' : ''}`}
                    style={{
                      borderColor: formData.feedback_type === type.value ? type.color : 'var(--border-color)',
                    }}
                  >
                    <input
                      type="radio"
                      name="feedback_type"
                      value={type.value}
                      checked={formData.feedback_type === type.value}
                      onChange={handleInputChange}
                      className="type-radio"
                    />
                    <span className="type-icon">{type.icon}</span>
                    <span className="type-label">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Заголовок *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Краткое описание проблемы или предложения"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">
                Подробное описание *
              </label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Опишите вашу проблему, предложение или вопрос как можно подробнее..."
                rows="6"
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowForm(false)}
                disabled={submitting}
              >
                Отмена
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Отправка...' : 'Отправить'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="feedback-list-section">
        <h2>Мои обращения</h2>
        {feedbackList.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">📬</div>
            <h3>У вас пока нет обращений</h3>
            <p>Создайте своё первое обращение, нажав кнопку выше</p>
          </div>
        ) : (
          <div className="feedback-grid">
            {feedbackList.map((feedback) => {
              const typeInfo = getTypeInfo(feedback.feedback_type);
              return (
                <div key={feedback.id} className="feedback-card card">
                  <div className="feedback-header">
                    <div className="feedback-type" style={{ color: typeInfo.color }}>
                      <span className="type-icon">{typeInfo.icon}</span>
                      <span>{typeInfo.label}</span>
                    </div>
                    <span className={`status-badge status-${feedback.status === 'open' ? 'active' : 'completed'}`}>
                      {statusLabels[feedback.status] || feedback.status}
                    </span>
                  </div>

                  <h3 className="feedback-title">{feedback.title}</h3>
                  <p className="feedback-description">{feedback.description}</p>

                  <div className="feedback-footer">
                    <span className="feedback-date">
                      {formatDate(feedback.created_at)}
                    </span>
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

export default Feedback;
