import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const CustomBarChart = ({
  data,
  bars = [],
  xAxisKey = 'name',
  height = 300,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  stacked = false,
  barSize = 30,
  yAxisLabel,
  xAxisLabel,
  tooltipFormatter,
  onBarClick,
}) => {
  const formatTooltip = (value, name, props) => {
    if (tooltipFormatter) {
      return tooltipFormatter(value, name, props);
    }
    return [value, name];
  };

  const handleBarClick = (data, index) => {
    if (onBarClick) {
      onBarClick(data, index);
    }
  };

  return (
    <div className="chart-container" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data}>
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
          
          {bars.map((bar, index) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name}
              fill={bar.color || colors[index % colors.length]}
              barSize={barSize}
              stackId={stacked ? 'stack' : undefined}
              onClick={(data, index) => handleBarClick(data, index)}
            >
              {bar.customColors && data.map((entry, barIndex) => (
                <Cell
                  key={`cell-${barIndex}`}
                  fill={bar.customColors[barIndex % bar.customColors.length]}
                />
              ))}
            </Bar>
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;