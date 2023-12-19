import { QueryRenderer } from '@cubejs-client/react';
import { Card, Spin } from 'antd';

import Heatmap from '../components/Heatmap';

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hourLabels = [
  "12am",
  "1am",
  "2am",
  "3am",
  "4am",
  "5am",
  "6am",
  "7am",
  "8am",
  "9am",
  "10am",
  "11am",
  "12pm",
  "1pm",
  "2pm",
  "3pm",
  "4pm",
  "5pm",
  "6pm",
  "7pm",
  "8pm",
  "9pm",
  "10pm",
  "11pm"
];

const HeatmapChart = ({
    cubejsApi,
    dateRange
}) => {
    const formattedDateRange = dateRange ? dateRange.map((dayjsObj) => dayjsObj.format('YYYY-MM-DD')) : [];
    return (
        <Card
        title="Hourly Ride Density Heatmap"
        style={{
            width: 800
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
                    "limit": 5000,
                    "timeDimensions": [
                    {
                        "dimension": "Rides.datetime",
                        "granularity": "hour",
                        "dateRange": formattedDateRange
                    }
                    ]
                }}
                cubejsApi={cubejsApi}
                render={({ resultSet }) => {
                    console.log('res: ', resultSet)
                    if (!resultSet) {
                        return <Spin />;
                    }

                    const localData = resultSet.chartPivot().map(record => ({
                        ...record,
                        y: record['Rides.rideCount']
                    }));

                    return (
                        <div>
                            <Heatmap
                                orientation="vertical"
                                data={localData}
                                xAxisLabels={dayLabels}
                                yAxisLabels={hourLabels}
                            />
                        </div>
                    );
                }}
            />
        </Card>
    )
};

export default HeatmapChart;