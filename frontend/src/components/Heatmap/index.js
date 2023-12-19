import { useRef } from "react";
import { format } from "date-fns";
import styles from "./styles.module.css";
import useLegend from "./useLegend";

const DAY_INDEXES = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat"
};

function formatDayAndHour(chartData) {
  return chartData.reduce((dates, record) => {
    const date = new Date(record.x);
    const day = DAY_INDEXES[date.getDay()];
    const hour = format(date, "haaa");

    for(let i = 0; i < record.y; i++)
        (dates[day] = dates[day] || []).push(hour);

    return dates;
  }, {});
}

function mapRange(value, fromMin, fromMax, toMin, toMax) {
    // Ensure the value is within the source range
    const clampedValue = Math.min(Math.max(value, fromMin), fromMax);
  
    // Map the clamped value to the target range
    const mappedValue = ((clampedValue - fromMin) / (fromMax - fromMin)) * (toMax - toMin) + toMin;
  
    return mappedValue;
}

const generateBackgroundColor = (count, rawMin, rawMax) => {
    const adjustedCount = mapRange(count, rawMin, rawMax, 1, 15);
    return `hsl(196deg 36% ${adjustedCount > 0 ? 95 - adjustedCount * 5 : 95}%)`;
};

const Heatmap = ({
  data = [],
  xAxisLabels = [],
  yAxisLabels = [],
  orientation = "vertical"
}) => {
  const minMaxCount = useRef([]);
  const formattedData = formatDayAndHour(data);

  const gridCells = xAxisLabels.reduce((days, dayLabel) => {
    const dayAndHour = yAxisLabels.reduce((hours, hourLabel) => {
      const count = formattedData[dayLabel]?.reduce((total, hour) => {
        return hour === hourLabel ? total + 1 : total;
      }, 0);

      minMaxCount.current = [...minMaxCount.current, count];

      return [
        ...hours,
        {
          dayHour: `${dayLabel} ${hourLabel}`,
          count
        }
      ];
    }, []);

    return {
      ...days,
      [dayLabel]: {
        hours: dayAndHour
      }
    };
  }, {});

    const {
        legend,
        minValue,
        maxValue
    } = useLegend(data, generateBackgroundColor, styles);

    return (
      <div className={styles.container}>
        <div className={`${styles.heatmap} ${styles[orientation]}`}>
          {Object.keys(gridCells).map((day) => (
            <div key={day} className={`${styles.cells} ${styles.col}`}>
              {gridCells[day].hours.map(({ dayHour, count }) => (
                <div
                  key={dayHour}
                  className={styles.cell}
                  style={{ backgroundColor: generateBackgroundColor(count, minValue, maxValue) }}
                >
                  <div className={styles.tooltip} role="tooltip">
                    <span className={styles.count}>{count}</span>
                    <span>{dayHour}</span>
                  </div>
                </div>
              ))}
              <span className={styles.label}>{day}</span>
            </div>
          ))}
          <div className={styles.col}>
            {yAxisLabels.map((label, index) => (
              // Only render every other label text
              <span key={label} className={styles.label}>
                {index % 2 === 0 ? label : null}
              </span>
            ))}
          </div>
        </div>
        {legend}
      </div>
    );
    

    // return (
    //     <div className="container">
    //     <div className={`${styles.heatmap} ${styles[orientation]}`}>
    //         {Object.keys(gridCells).map((day) => (
    //         <div key={day} className={`${styles.cells} ${styles.col}`}>
    //             {gridCells[day].hours.map(({ dayHour, count }) => (
    //             <div
    //                 key={dayHour}
    //                 className="cell"
    //                 style={{ backgroundColor: generateBackgroundColor(count, minValue, maxValue) }}
    //             >
    //                 <div className="tooltip" role="tooltip">
    //                 <span className="count">{count}</span>
    //                 <span>{dayHour}</span>
    //                 </div>
    //             </div>
    //             ))}
    //             <span className="label">{day}</span>
    //         </div>
    //         ))}
    //         <div className="col">
    //         {yAxisLabels.map((label, index) => (
    //             // Only render every other label text
    //             <span key={label} className="label">
    //             {index % 2 === 0 ? label : null}
    //             </span>
    //         ))}
    //         </div>
    //     </div>
    //     {legend}
    //     </div>
    // );
};

export default Heatmap;
