cube('Rides', {
    sql: `
      SELECT
        date as datetime,
        lat as latitude,
        lon as longitude,
        vehicletype,
        base
      FROM
        rides
    `,
  
    measures: {
      rideCount: {
        type: 'count',
        sql: 'datetime',
        title: 'Number of Rides',
      },
    },
  
    dimensions: {
      datetime: {
        sql: 'datetime',
        type: 'time',
        title: 'Date/Time',
      },
      location: {
        type: 'geo',
        latitude: {
            sql: `${CUBE}.latitude`,
        },
        longitude: {
            sql: `${CUBE}.longitude`,
        },
        title: 'Location',
      },
      vehicleType: {
        sql: 'vehicletype',
        type: 'string',
        title: 'Vehicle Type',
      },
      base: {
        sql: 'base',
        type: 'string',
        title: 'Base Company',
      },
    },
  
    preAggregations: {
      hourWiseCount: {
        measures: [
          Rides.rideCount
        ],
        timeDimension: Rides.datetime,
        granularity: `hour`
      },
      dayWiseCount: {
          measures: [
            Rides.rideCount
          ],
          timeDimension: Rides.datetime,
          granularity: `day`
      },
      dayAndVehicleTypeWiseCount: {
        measures: [
          Rides.rideCount
        ],
        dimensions: [
          Rides.vehicleType
        ],
        timeDimension: Rides.datetime,
        granularity: `day`
      }
    },
});
