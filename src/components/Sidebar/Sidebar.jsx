import './Sidebar.css';

const navItems = [
  { icon: '⊞', label: 'Dashboard', active: false },
  { icon: '↕', label: 'Transactions', active: false },
  { icon: '📊', label: 'Tax Reports', active: false },
  { icon: '🌿', label: 'Tax Harvesting', active: true },
  { icon: '💼', label: 'Portfolio', active: false },
  { icon: '⚙', label: 'Settings', active: false },
];

export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Navigation">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon" aria-hidden="true">K</div>
        <span className="sidebar-logo-text">KoinX</span>
      </div>

      <nav className="sidebar-nav" aria-label="Main Navigation">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`nav-item${item.active ? ' active' : ''}`}
            aria-current={item.active ? 'page' : undefined}
            title={item.label}
          >
            <span className="nav-item-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar" aria-hidden="true">U</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">User</div>
            <div className="sidebar-user-role">Free Plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
