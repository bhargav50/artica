import { QueryRenderer } from "@cubejs-client/react";
import { Card, Spin } from "antd";
import { Pie } from "react-chartjs-2";

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

const VehicleTypeWisePieChart = ({
    cubejsApi,
    dateRange
}) => {
    const formattedDateRange = dateRange ? dateRange.map((dayjsObj) => dayjsObj.format('YYYY-MM-DD')) : [];
    return (
        <Card
            title="Distribution of Bookings by Vehicle Type"
            style={{
                width: 400
            }}
        >
        <QueryRenderer
            query={{
            "order": {
                "Rides.rideCount": "desc"
            },
            "measures": [
                "Rides.rideCount"
            ],
            "limit": 5000,
            "timeDimensions": [
                {
                "dimension": "Rides.datetime",
                "dateRange": formattedDateRange
                }
            ],
            "dimensions": [
                "Rides.vehicleType"
            ]
            }}
            cubejsApi={cubejsApi}
            render={({
                resultSet,
                error
            }) => {
                if (error) {
                    return <div>{error.toString()}</div>;
                }
                
                if (!resultSet) {
                    return <Spin />;
                }
                const pivotConfig = {
                    "x": [
                      "Rides.vehicleType"
                    ],
                    "y": [
                      "measures"
                    ],
                    "fillMissingDates": true,
                    "joinDateRange": false
                };
                const data = {
                    labels: resultSet.categories(pivotConfig).map((c) => c.x),
                    datasets: resultSet.series(pivotConfig).map((s) => ({
                      label: s.title,
                      data: s.series.map((r) => r.value),
                      yValues: [s.key],
                      backgroundColor: COLORS_SERIES,
                      hoverBackgroundColor: COLORS_SERIES,
                    })),
                };
                return (
                    <Pie
                        type="pie"
                        data={data}
                    />
                )
            }}
        />
        </Card>
    );
};

export default VehicleTypeWisePieChart;
