import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const CustomLineChart = ({
  data,
  lines = [],
  xAxisKey = 'name',
  height = 300,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  stacked = false,
  yAxisLabel,
  xAxisLabel,
  tooltipFormatter,
}) => {
  const formatTooltip = (value, name, props) => {
    if (tooltipFormatter) {
      return tooltipFormatter(value, name, props);
    }
    return [value, name];
  };

  return (
    <div className="chart-container" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
          
          <XAxis 
            dataKey={xAxisKey} 
            stroke="#6b7280"
            label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : null}
          />
          
          <YAxis 
            stroke="#6b7280"
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : null}
          />
          
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
          
          {showLegend && <Legend />}
          
          {lines.map((line, index) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color || colors[index % colors.length]}
              strokeWidth={2}
              dot={{ strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls
              isAnimationActive={true}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;