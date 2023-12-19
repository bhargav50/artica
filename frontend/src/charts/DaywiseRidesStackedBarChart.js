import { QueryRenderer } from '@cubejs-client/react';
import { Spin } from 'antd';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useDeepCompareMemo } from 'use-deep-compare';
import { Card } from 'antd';

const COLORS_SERIES = [
    '#5b8ff9',
    '#5ad8a6',
    '#5e7092',
    '#f6bd18',
    '#6f5efa',
    '#6ec8ec',
    '#945fb9',
    '#ff9845',
    '#299796',
    '#fe99c3',
];

const commonOptions = {
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxRotation: 0,
          padding: 12,
          minRotation: 0,
        },
      },
    },
};

const DaywiseRidesBarChartRenderer = ({
    resultSet,
    pivotConfig,
    overrideOptions = { scales: { x: {}, y: {} } },
    ...rest
  }) => {
    const datasets = useDeepCompareMemo(
      () => {
        // Extract unique vehicle types
        const finalDatasets = [
          {
            label: 'Express',
            data: [],
            backgroundColor: COLORS_SERIES[0],
          },
          {
            label: 'Premium',
            data: [],
            backgroundColor: COLORS_SERIES[1],
          },
          {
            label: 'Standard',
            data: [],
            backgroundColor: COLORS_SERIES[2],
          },
        ];
        resultSet.chartPivot().forEach(element => {
          const expressCount = element['Express,Rides.rideCount'];
          const premiumCount = element['Premium,Rides.rideCount'];
          const standardCount = element['Standard,Rides.rideCount'];
          finalDatasets[0].data.push(expressCount);
          finalDatasets[1].data.push(premiumCount);
          finalDatasets[2].data.push(standardCount);
        });
    
        return finalDatasets;
      },
      [resultSet, pivotConfig]
    );
  
    const data = {
      labels: resultSet.categories().map((c) => c.x),
      datasets,
    };
  
    const options = {
      ...commonOptions,
      scales: {
        x: { ...commonOptions.scales.x, ...overrideOptions.scales.x, stacked: true },
        y: { ...commonOptions.scales.y, ...overrideOptions.scales.y, stacked: true },
      },
    };
    return (
      <Bar
        type="bar"
        data={data}
        options={options}
        {...rest}
      />
    );
  };

const renderChart = ({
    resultSet,
    error,
    ...rest
  }) => {
    if (error) {
      return <div>{error.toString()}</div>;
    }
  
    if (!resultSet) {
      return <Spin />;
    }
  
    return (
      <DaywiseRidesBarChartRenderer
        resultSet={resultSet}
        {...rest}
      />
    );
  };
  
  
const DaywiseRidesStackedBarChart = ({
    cubejsApi,
    dateRange
}) => {
  const formattedDateRange = dateRange ? dateRange.map((dayjsObj) => dayjsObj.format('YYYY-MM-DD')) : [];
  return (
    <Card
      title="Rides per Day"
      style={{
        width: 800,
        height: 600
      }}
    >
      <QueryRenderer
        query={{
          "order": {
            "Rides.datetime": "asc"
          },
          "measures": [
            "Rides.rideCount"
          ],
          "dimensions": [
            "Rides.vehicleType"
          ],
          "timeDimensions": [
            {
              "dimension": "Rides.datetime",
              "granularity": "day",
              "dateRange": formattedDateRange
            }
          ]
        }}
        cubejsApi={cubejsApi}
        resetResultSetOnChange={false}
        render={(props) => renderChart({
          ...props,
          chartType: 'line',
          pivotConfig: {
            "x": [
              "Rides.datetime.day"
            ],
            "y": [
              "measures"
            ],
            "fillMissingDates": true,
            "joinDateRange": false
          },
          height: 500
        })}
      />
    </Card>
  );
};

export default DaywiseRidesStackedBarChart;
