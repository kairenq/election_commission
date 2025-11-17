import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pollsAPI } from '../services/api';
import SearchBar from '../components/SearchBar';
import { exportPollsListToPDF } from '../utils/pdfExport';
import { showToast } from '../utils/toast';

const Polls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPolls();
  }, []);

  const loadPolls = async () => {
    try {
      const response = await pollsAPI.getAll();
      setPolls(Array.isArray(response.data) ? response.data : []);
      showToast.success('Опросы успешно загружены');
    } catch (error) {
      console.error('Failed to load polls:', error);
      showToast.error('Ошибка загрузки опросов');
      setPolls([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleExportPDF = () => {
    try {
      exportPollsListToPDF(filteredPolls);
      showToast.success('PDF успешно экспортирован');
    } catch (error) {
      console.error('PDF export failed:', error);
      showToast.error('Ошибка экспорта PDF');
    }
  };

  // Apply both status filter and search filter
  const filteredPolls = polls.filter((poll) => {
    // Status filter
    const matchesStatus = filter === 'all' || poll.status === filter;

    // Search filter
    const matchesSearch = searchTerm === '' ||
      poll.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (poll.description && poll.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div className="flex-between mb-3">
        <h1>📊 Опросы</h1>
        <div className="flex gap-2">
          <button
            className="btn btn-outline"
            onClick={handleExportPDF}
            disabled={filteredPolls.length === 0}
            title="Экспорт в PDF"
          >
            📄 Экспорт PDF
          </button>
          <Link to="/polls/new" className="btn btn-primary">
            ➕ Создать опрос
          </Link>
        </div>
      </div>

      <SearchBar
        onSearch={handleSearch}
        placeholder="Поиск опросов по названию или описанию..."
        className="mb-3"
      />

      <div className="flex gap-2 mb-3">
        <button
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('all')}
        >
          Все
        </button>
        <button
          className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('active')}
        >
          Активные
        </button>
        <button
          className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('completed')}
        >
          Завершённые
        </button>
        <button
          className={`btn ${filter === 'draft' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('draft')}
        >
          Черновики
        </button>
      </div>

      {searchTerm && (
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          Найдено результатов: <strong>{filteredPolls.length}</strong>
        </p>
      )}

      {filteredPolls.length === 0 ? (
        <div className="card text-center">
          <p>
            {searchTerm
              ? '🔍 Ничего не найдено. Попробуйте другой поисковый запрос.'
              : '📝 Опросов не найдено. Создайте свой первый опрос!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-2">
          {filteredPolls.map((poll) => (
            <div key={poll.id} className="card">
              <h3 style={{ marginBottom: '0.5rem' }}>{poll.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {poll.description || 'Без описания'}
              </p>
              <div className="flex-between">
                <span className={`status-badge status-${poll.status}`}>
                  {poll.status === 'active' ? '✅ Активен' :
                   poll.status === 'draft' ? '📝 Черновик' :
                   poll.status === 'completed' ? '🏁 Завершён' : poll.status}
                </span>
                <Link to={`/polls/${poll.id}`} className="btn btn-sm btn-outline">
                  Подробнее →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Polls;
