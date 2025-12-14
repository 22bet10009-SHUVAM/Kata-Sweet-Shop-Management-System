import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiShoppingBag, FiLogOut, FiUser, FiHome, FiSettings } from 'react-icons/fi';
import { GiCupcake } from 'react-icons/gi';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <GiCupcake />
          <span className="text-gradient">Kata</span>
        </Link>

        {/* Navigation Links */}
        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/" className="nav-link">
                <FiHome />
                <span>Home</span>
              </Link>

              <Link to="/shop" className="nav-link">
                <FiShoppingBag />
                <span>Shop</span>
              </Link>

              {isAdmin && (
                <Link to="/admin" className="nav-link">
                  <FiSettings />
                  <span>Admin</span>
                </Link>
              )}

              <div className="user-badge">
                <FiUser />
                <span>{user.name}</span>
                {isAdmin && <span className="admin-tag">Admin</span>}
              </div>

              <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <FiLogOut />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
