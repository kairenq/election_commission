import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Corporate Voting Platform</h1>
          <p className="hero-subtitle">
            Create polls, gather feedback, and make decisions together
          </p>
          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Features</h2>
          <div className="grid grid-3">
            <div className="feature-card card">
              <div className="feature-icon">📊</div>
              <h3>Easy Polling</h3>
              <p>Create and manage polls for your team with just a few clicks</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">👥</div>
              <h3>Team Management</h3>
              <p>Organize participants into teams and track voting patterns</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">📈</div>
              <h3>Real-time Results</h3>
              <p>View voting results and analytics in real-time</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your votes are secure with authentication and encryption</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">💬</div>
              <h3>Feedback System</h3>
              <p>Collect and manage feedback from participants</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">🚀</div>
              <h3>Fast & Reliable</h3>
              <p>Built with modern technology for speed and reliability</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
