// src/components/common/Charts/index.jsx
import React from 'react';

export const BarChart = ({ data }) => (
  <div>Bar Chart Component - Data: {JSON.stringify(data)}</div>
);

export const LineChart = ({ data }) => (
  <div>Line Chart Component - Data: {JSON.stringify(data)}</div>
);

export const PieChart = ({ data }) => (
  <div>Pie Chart Component - Data: {JSON.stringify(data)}</div>
);