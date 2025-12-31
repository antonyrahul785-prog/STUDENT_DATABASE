import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const CustomPieChart = ({
  data,
  dataKey = 'value',
  nameKey = 'name',
  height = 300,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#8b5cf6', '#06b6d4', '#f97316'],
  innerRadius = 0,
  outerRadius = 80,
  showTooltip = true,
  showLegend = true,
  showLabel = false,
  tooltipFormatter,
  onSegmentClick,
}) => {
  const formatTooltip = (value, name, props) => {
    if (tooltipFormatter) {
      return tooltipFormatter(value, name, props);
    }
    
    const total = data.reduce((sum, item) => sum + item[dataKey], 0);
    const percentage = ((value / total) * 100).toFixed(1);
    
    return [`${value} (${percentage}%)`, name];
  };

  const handleSegmentClick = (data, index) => {
    if (onSegmentClick) {
      onSegmentClick(data, index);
    }
  };

  const total = data.reduce((sum, item) => sum + item[dataKey], 0);

  return (
    <div className="pie-chart-container">
      <div className="chart-wrapper" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey={dataKey}
              nameKey={nameKey}
              label={showLabel ? ({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                value,
                index,
              }) => {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                
                return (
                  <text
                    x={x}
                    y={y}
                    fill="white"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                  >
                    {data[index][nameKey]}
                  </text>
                );
              } : false}
              onClick={handleSegmentClick}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            
            {showTooltip && (
              <Tooltip 
                formatter={formatTooltip}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                }}
              />
            )}
            
            {showLegend && (
              <Legend 
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ paddingLeft: '20px' }}
              />
            )}
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="pie-chart-summary">
        <div className="summary-item">
          <span className="summary-label">Total</span>
          <span className="summary-value">{total}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Segments</span>
          <span className="summary-value">{data.length}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomPieChart;