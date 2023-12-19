import cubejs from '@cubejs-client/core';
import React, { Fragment, useState } from 'react';
import dayjs from 'dayjs';
import { Space, DatePicker } from 'antd';
import HeatmapChart from './charts/HeatMapChart';
import DaywiseRidesStackedBarChart from './charts/DaywiseRidesStackedBarChart';
import TotalRides from './stats/TotalRides';
import VehicleTypeWisePieChart from './charts/VehicleTypeWisePieChart';


const cubejsApi = cubejs(
  'SECRET',
  { apiUrl: 'http://localhost:4000/cubejs-api/v1' }
);

const { RangePicker } = DatePicker;

const App = () => {
  const [dateRange, setDateRange] = useState([
    dayjs('2014-05-01', 'YYYY-MM-DD'),
    dayjs('2014-05-07', 'YYYY-MM-DD'),
  ]);

  console.log('date: ', dateRange[1].diff(dateRange[0], 'days'));

  return (
    <Space
      direction='vertical'
      style={{ padding: 20 }}
    >
      <RangePicker
        value={dateRange}
        onChange={setDateRange}
      />
      {
        dateRange
        && (
          <Fragment>
            <Space
              direction='horizontal'
            >
              <TotalRides
                cubejsApi={cubejsApi}
                dateRange={dateRange}
              />
            </Space>
            <Space
              direction='horizontal'
            >
              <DaywiseRidesStackedBarChart
                cubejsApi={cubejsApi}
                dateRange={dateRange}
              />
              <VehicleTypeWisePieChart
                cubejsApi={cubejsApi}
                dateRange={dateRange}
              />
            </Space>
            <HeatmapChart
              cubejsApi={cubejsApi}
              dateRange={dateRange}
            />
          </Fragment>
        )
      }
    </Space>
  )
}

export default App;
