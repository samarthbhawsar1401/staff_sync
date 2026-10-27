import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'primary', subtext, trend }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
      <div className="card-body p-3 p-md-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span className="text-secondary fw-semibold small text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.6px' }}>
            {title}
          </span>
          <div className={`p-2 rounded-3 bg-${color}-subtle text-${color}`}>
            {Icon && <Icon size={20} />}
          </div>
        </div>
        <div className="d-flex align-items-baseline gap-2 mb-1">
          <h2 className="fw-bolder mb-0 text-dark">{value}</h2>
          {trend && (
            <span className={`small fw-bold text-${trend.isPositive ? 'success' : 'danger'}`}>
              {trend.value}
            </span>
          )}
        </div>
        {subtext && <small className="text-muted d-block">{subtext}</small>}
      </div>
    </div>
  );
};

export default StatCard;
