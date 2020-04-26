import * as React from 'react'
import {
  Tooltip,
  ChartProvider,
  ArcSeries,
  Arc
} from 'rough-charts'

const colors = ['red', 'orange', 'blue', 'green']
const PieChart = (props) => {
    const [activeIndex, setIndex] = React.useState(-1)
    return (
      <ChartProvider
        height={400}
        data={props.data}
        margin={{ top: 30, left: 0 }}
        {...props}
      >
        <ArcSeries
          dataKey="value"
        >
          {
            (item, itemProps, index) => (
              <Arc
                {...itemProps}
                key={index}
                onMouseOver={() => {
                  setIndex(index)
                }}
                options={{
                  fillStyle: activeIndex === index ? 'solid' : undefined,
                  fill: colors[index % colors.length],
                }}
                onMouseOut={() => setIndex(-1)}
              />
            )
          }
        </ArcSeries>
        <Tooltip />
      </ChartProvider>
    )
}

    export default PieChart