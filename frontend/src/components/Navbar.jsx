import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InstructionsModal from './InstructionsModal';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.is_superuser || user?.role_id === 1;

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <img src="/ico.png" alt="Logo" style={{ height: '24px', marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Система Голосования
          </Link>

          <div className="navbar-links">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="nav-link">
                  📊 Панель
                </Link>
                <Link to="/polls" className="nav-link">
                  🗳️ Голосования
                </Link>
                <Link to="/teams" className="nav-link">
                  👥 Команды
                </Link>
                <Link to="/feedback" className="nav-link">
                  💬 Обратная связь
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="nav-link admin-link">
                    ⚙️ Админ
                  </Link>
                )}
                <button
                  className="btn-help"
                  onClick={() => setShowInstructions(true)}
                  title="Инструкция"
                >
                  ❓
                </button>
                <div className="navbar-user">
                  <span className="user-name">{user?.full_name || user?.username}</span>
                  <button onClick={handleLogout} className="btn btn-sm btn-danger">
                    Выход
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  className="btn-help"
                  onClick={() => setShowInstructions(true)}
                  title="Инструкция"
                >
                  ❓
                </button>
                <Link to="/login" className="nav-link">
                  Вход
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        isAdmin={isAdmin}
      />
    </nav>
  );
};

export default Navbar;
