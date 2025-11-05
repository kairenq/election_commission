import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pollsAPI, teamsAPI, feedbackAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    polls: 0,
    teams: 0,
    feedback: 0,
  });
  const [recentPolls, setRecentPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [pollsRes, teamsRes, feedbackRes] = await Promise.all([
        pollsAPI.getAll(0, 5),
        teamsAPI.getAll(),
        feedbackAPI.getAll(),
      ]);

      setStats({
        polls: pollsRes.data.length,
        teams: teamsRes.data.length,
        feedback: feedbackRes.data.length,
      });

      setRecentPolls(pollsRes.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.full_name || user?.username}! 👋</h1>
        <p>Here's what's happening with your polls today</p>
      </div>

      <div className="stats-grid grid grid-3">
        <div className="stat-card card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.polls}</h3>
            <p>Active Polls</p>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.teams}</h3>
            <p>Teams</p>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <h3>{stats.feedback}</h3>
            <p>Feedback Items</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header flex-between">
          <h2>Recent Polls</h2>
          <Link to="/polls" className="btn btn-primary">
            View All Polls
          </Link>
        </div>

        {recentPolls.length === 0 ? (
          <div className="card text-center">
            <p>No polls yet. Create your first poll to get started!</p>
            <Link to="/polls/new" className="btn btn-primary mt-2">
              Create Poll
            </Link>
          </div>
        ) : (
          <div className="polls-grid grid grid-2">
            {recentPolls.map((poll) => (
              <Link to={`/polls/${poll.id}`} key={poll.id} className="poll-card card">
                <h3>{poll.name}</h3>
                <p className="poll-description">{poll.description || 'No description'}</p>
                <div className="poll-meta">
                  <span className={`status-badge status-${poll.status}`}>{poll.status}</span>
                  <span className="poll-type">{poll.poll_type}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="grid grid-2">
          <Link to="/polls/new" className="action-card card">
            <span className="action-icon">📝</span>
            <h3>Create Poll</h3>
            <p>Start a new voting poll</p>
          </Link>

          <Link to="/teams" className="action-card card">
            <span className="action-icon">👥</span>
            <h3>Manage Teams</h3>
            <p>View and organize teams</p>
          </Link>

          <Link to="/feedback/new" className="action-card card">
            <span className="action-icon">💬</span>
            <h3>Submit Feedback</h3>
            <p>Share your thoughts</p>
          </Link>

          <Link to="/polls" className="action-card card">
            <span className="action-icon">📊</span>
            <h3>View Results</h3>
            <p>Check voting results</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
