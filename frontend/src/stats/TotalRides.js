import { QueryRenderer } from "@cubejs-client/react";
import { Card } from "antd";

const TotalRides = ({
    cubejsApi,
    dateRange
}) => {
    const formattedDateRange = dateRange ? dateRange.map((dayjsObj) => dayjsObj.format('YYYY-MM-DD')) : [];
    return (
        <Card
            title="Total Rides"
        >
            <QueryRenderer
            query={{
                measures: ['Rides.rideCount'],
                timeDimensions: [
                {
                    dimension: 'Rides.datetime',
                    granularity: 'day',
                    dateRange: formattedDateRange,
                },
                ],
            }}
            cubejsApi={cubejsApi}
            render={({ resultSet }) => {
                if (!resultSet) {
                return <p>Loading...</p>;
                }
        
                const totalRides = resultSet.seriesNames().map((series) => resultSet.totalRow()[series.key])[0];
        
                return (
                <div>
                    {totalRides}
                </div>
                );
            }}
            />
        </Card>
    );
}

export default TotalRides;