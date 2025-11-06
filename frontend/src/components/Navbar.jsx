import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
            📊 Платформа Голосования
          </Link>

          <div className="navbar-links">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="nav-link">
                  Панель
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="nav-link admin-link">
                    ⚙️ Админ
                  </Link>
                )}
                <Link to="/polls" className="nav-link">
                  Опросы
                </Link>
                <Link to="/teams" className="nav-link">
                  Команды
                </Link>
                <Link to="/feedback" className="nav-link">
                  Отзывы
                </Link>
                <div className="navbar-user">
                  <span className="user-name">👤 {user?.username}</span>
                  <button onClick={handleLogout} className="btn btn-sm btn-outline">
                    Выход
                  </button>
                </div>
              </>
            ) : (
              <>
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
    </nav>
  );
};

export default Navbar;
