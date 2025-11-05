import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pollsAPI } from '../services/api';

const Polls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadPolls();
  }, []);

  const loadPolls = async () => {
    try {
      const response = await pollsAPI.getAll();
      setPolls(response.data);
    } catch (error) {
      console.error('Failed to load polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPolls = polls.filter((poll) => {
    if (filter === 'all') return true;
    return poll.status === filter;
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
        <h1>Polls</h1>
        <Link to="/polls/new" className="btn btn-primary">
          Create New Poll
        </Link>
      </div>

      <div className="flex gap-2 mb-3">
        <button
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button
          className={`btn ${filter === 'draft' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('draft')}
        >
          Draft
        </button>
      </div>

      {filteredPolls.length === 0 ? (
        <div className="card text-center">
          <p>No polls found. Create your first poll!</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {filteredPolls.map((poll) => (
            <div key={poll.id} className="card">
              <h3 style={{ marginBottom: '0.5rem' }}>{poll.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {poll.description || 'No description'}
              </p>
              <div className="flex-between">
                <span className={`status-badge status-${poll.status}`}>{poll.status}</span>
                <Link to={`/polls/${poll.id}`} className="btn btn-sm btn-outline">
                  View Details
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
