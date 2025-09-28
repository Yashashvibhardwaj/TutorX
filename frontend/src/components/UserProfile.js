import React, { useEffect, useState, useRef } from "react";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoading(true);
      setError(null);
      fetch("http://localhost:8000/me", {
        headers: { "Authorization": "Bearer " + token }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to fetch user data');
          }
          return res.json();
        })
        .then((userData) => {
          if (userData && userData.username) {
            setUser(userData);
          } else {
            throw new Error('Invalid user data received');
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching user profile:', err);
          setUser(null);
          setError(err.message);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getRoleColor = (role) => {
    if (!role) return "#778ca3";
    
    const colors = {
      admin: "#ff6b6b",
      user: "#4ecdc4",
      moderator: "#45b7d1",
      editor: "#96ceb4",
      premium: "#f39c12"
    };
    return colors[role.toLowerCase()] || "#778ca3";
  };

  const getInitials = (username) => {
    if (!username || typeof username !== 'string') {
      return "U";
    }
    return username.charAt(0).toUpperCase();
  };

  const getDisplayRole = (role) => {
    if (!role) return "user";
    return role;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (isLoading) {
    return (
      <div style={styles.compactLoading}>
        <div style={styles.smallSpinner}></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div style={styles.errorBadge}>
        <span style={styles.errorText}>⚠️</span>
      </div>
    );
  }

  return (
    <div style={styles.container} ref={dropdownRef}>
      {/* Compact Profile Trigger */}
      <div 
        style={styles.profileTrigger}
        onClick={handleProfileClick}
        className="profile-trigger"
      >
        <div style={styles.avatarCompact}>
          {getInitials(user.username)}
        </div>
        <div style={styles.triggerInfo}>
          <span style={styles.triggerUsername}>{user.username}</span>
          <div style={styles.roleDot(getRoleColor(user.role))}></div>
        </div>
        <div style={styles.dropdownArrow}>
          {isDropdownOpen ? '▲' : '▼'}
        </div>
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div style={styles.dropdownMenu}>
          {/* Profile Header in Dropdown */}
          <div style={styles.dropdownHeader}>
            <div style={styles.dropdownAvatar}>
              {getInitials(user.username)}
            </div>
            <div style={styles.dropdownUserInfo}>
              <div style={styles.dropdownUsername}>{user.username}</div>
              <div style={styles.dropdownRole(getRoleColor(user.role))}>
                {getDisplayRole(user.role)}
              </div>
            </div>
          </div>

          <div style={styles.dropdownDivider}></div>

          {/* Menu Items */}
          <div style={styles.menuItem}>
            <span style={styles.menuIcon}>👤</span>
            <span>My Profile</span>
          </div>
          
          <div style={styles.menuItem}>
            <span style={styles.menuIcon}>⚙️</span>
            <span>Settings</span>
          </div>
          
          <div style={styles.menuItem}>
            <span style={styles.menuIcon}>🛡️</span>
            <span>Privacy</span>
          </div>

          <div style={styles.dropdownDivider}></div>

          {/* Status Section */}
          <div style={styles.statusSection}>
            <div style={styles.statusItem}>
              <div style={styles.statusIndicator}>
                <div style={styles.statusDot}></div>
                <span>Online</span>
              </div>
            </div>
          </div>

          <div style={styles.dropdownDivider}></div>

          {/* Logout */}
          <div style={styles.menuItem} onClick={handleLogout}>
            <span style={styles.menuIcon}>🚪</span>
            <span style={styles.logoutText}>Logout</span>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  
  // Compact Profile Trigger
  profileTrigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '25px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: 'auto',
    maxWidth: '200px'
  },
  avatarCompact: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.3)'
  },
  triggerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 1,
    minWidth: 0
  },
  triggerUsername: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '80px'
  },
  roleDot: (color) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: color,
    flexShrink: 0
  }),
  dropdownArrow: {
    color: 'white',
    fontSize: '10px',
    transition: 'transform 0.3s ease',
    flexShrink: 0
  },

  // Dropdown Menu
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '8px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    minWidth: '220px',
    zIndex: 1000,
    overflow: 'hidden',
    animation: 'slideDown 0.2s ease-out'
  },
  dropdownHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white'
  },
  dropdownAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    border: '2px solid rgba(255, 255, 255, 0.3)'
  },
  dropdownUserInfo: {
    flex: 1
  },
  dropdownUsername: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '2px'
  },
  dropdownRole: (color) => ({
    background: color,
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '10px',
    fontWeight: '600',
    textTransform: 'uppercase',
    display: 'inline-block'
  }),
  dropdownDivider: {
    height: '1px',
    background: 'rgba(0, 0, 0, 0.1)',
    margin: '4px 0'
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    fontSize: '14px',
    color: '#333'
  },
  menuIcon: {
    fontSize: '14px',
    width: '16px',
    textAlign: 'center'
  },
  logoutText: {
    color: '#ff6b6b',
    fontWeight: '600'
  },

  // Status Section
  statusSection: {
    padding: '8px 16px'
  },
  statusItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#666'
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#4cd137',
    animation: 'pulse 2s infinite'
  },

  // Loading and Error States
  compactLoading: {
    padding: '8px 12px'
  },
  smallSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  errorBadge: {
    padding: '8px 12px',
    background: 'rgba(255, 107, 107, 0.1)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 107, 107, 0.3)'
  },
  errorText: {
    fontSize: '14px'
  }
};

// Add to your global CSS
const globalStyles = `
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-trigger:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

.menu-item:hover {
  background: rgba(102, 126, 234, 0.1);
}
`;

export default UserProfile;