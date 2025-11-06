import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { pollsAPI, votesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../utils/toast';
import './PollDetails.css';

const PollDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [poll, setPoll] = useState(null);
  const [options, setOptions] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadPoll();
    checkIfVoted();
  }, [id]);

  const loadPoll = async () => {
    try {
      const response = await pollsAPI.getById(id);
      setPoll(response.data);

      // Mock options since they're not returned from API
      // In production, you'd fetch from /api/polls/{id}/options
      setOptions([
        { id: 1, name: 'Вариант 1', description: 'Описание первого варианта' },
        { id: 2, name: 'Вариант 2', description: 'Описание второго варианта' },
        { id: 3, name: 'Вариант 3', description: 'Описание третьего варианта' },
      ]);
    } catch (error) {
      console.error('Failed to load poll:', error);
      showToast.error('Не удалось загрузить опрос');
    } finally {
      setLoading(false);
    }
  };

  const checkIfVoted = async () => {
    try {
      const response = await votesAPI.getAll({ poll_id: id });
      const userVote = response.data.find(vote => vote.user_id === user?.id);
      if (userVote) {
        setHasVoted(true);
        setShowResults(true);
        loadResults();
      }
    } catch (error) {
      console.error('Failed to check vote status:', error);
    }
  };

  const loadResults = async () => {
    try {
      const response = await votesAPI.getResults(id);
      setResults(response.data);
    } catch (error) {
      console.error('Failed to load results:', error);
    }
  };

  const handleVote = async () => {
    if (!selectedOption) {
      showToast.error('Выберите вариант ответа');
      return;
    }

    if (poll.status !== 'active') {
      showToast.error('Опрос неактивен');
      return;
    }

    setSubmitting(true);
    try {
      await votesAPI.create({
        poll_id: parseInt(id),
        participant_id: user.id,
        option_id: selectedOption,
      });

      showToast.success('Ваш голос учтён!');
      setHasVoted(true);
      setShowResults(true);
      loadResults();
    } catch (error) {
      console.error('Failed to submit vote:', error);
      showToast.error(error.response?.data?.detail || 'Не удалось проголосовать');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleResults = () => {
    if (!showResults) {
      loadResults();
    }
    setShowResults(!showResults);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <h2>Опрос не найден</h2>
        <Link to="/polls" className="btn btn-primary mt-2">
          Вернуться к опросам
        </Link>
      </div>
    );
  }

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

  const getStatusText = (status) => {
    const statusMap = {
      active: 'Активен',
      draft: 'Черновик',
      completed: 'Завершён',
      cancelled: 'Отменён',
    };
    return statusMap[status] || status;
  };

  return (
    <div className="container poll-details-page">
      <div className="poll-header">
        <div className="poll-header-top">
          <Link to="/polls" className="back-link">
            ← Все опросы
          </Link>
          <span className={`status-badge status-${poll.status}`}>
            {getStatusText(poll.status)}
          </span>
        </div>

        <h1>{poll.name}</h1>
        {poll.description && <p className="poll-description">{poll.description}</p>}

        <div className="poll-meta">
          <div className="meta-item">
            <span className="meta-label">Тип:</span>
            <span className="meta-value">{poll.poll_type}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Начало:</span>
            <span className="meta-value">{formatDate(poll.start_date)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Окончание:</span>
            <span className="meta-value">{formatDate(poll.end_date)}</span>
          </div>
        </div>
      </div>

      {hasVoted ? (
        <div className="voted-section card">
          <div className="voted-message">
            <div className="voted-icon">✓</div>
            <div>
              <h3>Вы уже проголосовали</h3>
              <p>Спасибо за участие в опросе!</p>
            </div>
          </div>
          <button
            className="btn btn-outline mt-3"
            onClick={toggleResults}
          >
            {showResults ? 'Скрыть результаты' : 'Показать результаты'}
          </button>
        </div>
      ) : poll.status === 'active' ? (
        <div className="voting-section card">
          <h2>Выберите вариант ответа</h2>
          <div className="options-list">
            {options.map((option) => (
              <label
                key={option.id}
                className={`option-card ${selectedOption === option.id ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="vote"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={() => setSelectedOption(option.id)}
                  className="option-radio"
                />
                <div className="option-content">
                  <div className="option-name">{option.name}</div>
                  {option.description && (
                    <div className="option-description">{option.description}</div>
                  )}
                </div>
                <div className="option-checkmark">
                  {selectedOption === option.id && '✓'}
                </div>
              </label>
            ))}
          </div>

          <div className="voting-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleVote}
              disabled={!selectedOption || submitting}
            >
              {submitting ? 'Отправка...' : 'Проголосовать'}
            </button>
          </div>
        </div>
      ) : (
        <div className="card text-center">
          <h3>Голосование недоступно</h3>
          <p>Этот опрос сейчас {getStatusText(poll.status).toLowerCase()}</p>
          <button
            className="btn btn-primary mt-2"
            onClick={toggleResults}
          >
            {showResults ? 'Скрыть результаты' : 'Показать результаты'}
          </button>
        </div>
      )}

      {showResults && (
        <div className="results-section card">
          <h2>Результаты голосования</h2>
          {results.length === 0 ? (
            <p className="text-center">Голосов пока нет</p>
          ) : (
            <div className="results-list">
              {results.map((result, index) => {
                const optionName = options.find(o => o.id === result.option_id)?.name || `Вариант ${result.option_id}`;
                return (
                  <div key={index} className="result-item">
                    <div className="result-header">
                      <span className="result-name">{optionName}</span>
                      <span className="result-stats">
                        {result.vote_count} голосов ({result.percentage?.toFixed(1) || 0}%)
                      </span>
                    </div>
                    <div className="result-bar">
                      <div
                        className="result-fill"
                        style={{ width: `${result.percentage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PollDetails;
