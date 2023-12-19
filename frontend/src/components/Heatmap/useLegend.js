import React, { useEffect, useState } from 'react';

function useLegend(data, generateBackgroundColor, styles) {
  const [legend, setLegend] = useState(null);
  const [minValue, setMinValue] = useState(null);
  const [maxValue, setMaxValue] = useState(null);

  useEffect(() => {
    if (data && data.length > 0) {
      const deduped = [...new Set(data.map(({ y }) => y))];
      const minValue = Math.min(...deduped);
      const maxValue = Math.max(...deduped);
      const minColor = generateBackgroundColor(minValue, minValue, maxValue);
      const maxColor = generateBackgroundColor(maxValue, minValue, maxValue);

      const legendComponent = (
        <div className={styles.legend}>
          <div
            className={styles.cell}
            style={{
              background: `linear-gradient(90deg, ${minColor} 0%, ${maxColor} 100%)`
            }}
          />
          <div className={styles.labels}>
            <span className={styles.label}>{minValue}</span>
            <span className={styles.label}>{maxValue}</span>
          </div>
        </div>
      );

      setMinValue(minValue);
      setMaxValue(maxValue);
      setLegend(legendComponent);
    }
  }, [
    data,
    generateBackgroundColor,
    styles
  ]);

  return { legend, minValue, maxValue };
}

export default useLegend;
