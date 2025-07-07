import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

const LineChart = ({ historicalData }) => {
  const [data, setData] = useState([['Date', 'Price']]);

  useEffect(() => {
    if (historicalData && historicalData.prices && historicalData.prices.length > 0) {
      const dataCopy = [['Date', 'Price']];
      historicalData.prices.forEach((item) => {
        const date = new Date(item[0]).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        dataCopy.push([date, item[1]]);
      });
      setData(dataCopy);
      console.log('Chart data:', dataCopy); // Debug
    }
  }, [historicalData]);

  return (
    <div className="chart-container">
      {data.length > 1 ? (
        <Chart
          chartType="LineChart"
          data={data}
          width="100%"
          height="400px"
          options={{
            title: 'Price History (Past 10 Days)',
            hAxis: {
              title: 'Date',
              titleTextStyle: { color: '#333', fontSize: 14 },
              textStyle: { fontSize: 12 },
            },
            vAxis: {
              title: `Price (${historicalData.currency || 'USD'})`,
              titleTextStyle: { color: '#333', fontSize: 14 },
              textStyle: { fontSize: 12 },
            },
            legend: { position: 'top', textStyle: { fontSize: 14 } },
            chartArea: { width: '80%', height: '70%' },
            colors: ['#007bff'],
            curveType: 'function',
            pointSize: 5,
            backgroundColor: '#ffffff', // Set chart background to white
          }}
        />
      ) : (
        <p>No chart data available</p>
      )}
    </div>
  );
};

export default LineChart;