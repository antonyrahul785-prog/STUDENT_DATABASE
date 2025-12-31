import React from 'react';

const KPICard = ({ title, value, icon, color, trend, subtitle }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  };

  const trendColor = trend?.startsWith('+') ? 'text-green-600' : 'text-red-600';

  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <div className={`kpi-icon ${colorClasses[color] || colorClasses.blue}`}>
          {icon}
        </div>
        {trend && (
          <span className={`trend-badge ${trendColor}`}>
            {trend}
          </span>
        )}
      </div>
      
      <div className="kpi-content">
        <h3 className="kpi-value">{value}</h3>
        <p className="kpi-title">{title}</p>
        {subtitle && (
          <p className="kpi-subtitle">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default KPICard;