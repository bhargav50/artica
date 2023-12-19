import { QueryRenderer } from '@cubejs-client/react';
import { Card } from 'antd';

const ChartRenderer = ({
    title,
    style={},
    query,
    cubejsApi,
    render
}) => {
    return (
      <Card
        title={{title}}
        style={style}
      >
        <QueryRenderer
          query={query}
          cubejsApi={cubejsApi}
          resetResultSetOnChange={false}
          render={({ resultSet }) => {
            if (!resultSet) {
              return <div className="loader" />;
            }
 
            return render(resultSet);
          }}
        />
      </Card>
    );
};

export default ChartRenderer;
