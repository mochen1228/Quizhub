import * as React from 'react'
import { Rectangle } from 'react-roughjs'
import {
  Tooltip, BarSeries,
  ChartProvider, XAxis, YAxis,
} from 'rough-charts'

/*
// example data input
const data = [
  { name: 'A', value: 30},
  { name: 'B', value: 90 },
  { name: 'C', value: 50 },
  { name: 'D', value: 40 },
]
*/

const colors = ['red', 'orange', 'blue', 'green']
const RankingBar = (props) => {
  const [activeIndex, setIndex] = React.useState(-1)
  return (
    <ChartProvider
      data={props.data}
      {...props}
    >
      <YAxis />
      <XAxis dataKey="name" />
      <BarSeries
        dataKey="value"
      >
        {
          (item, itemProps, index) => (
            <Rectangle
              key={index}
              {...itemProps}
              onMouseOver={() => {
                setIndex(index)
              }}
              options={{
                ...itemProps.options,
                fillStyle: activeIndex === index ? 'solid' : undefined,
                fill: colors[index % colors.length]
              }}
              onMouseOut={() => setIndex(-1)}
            />
          )
        }
      </BarSeries>
      <Tooltip />
    </ChartProvider>
  )
}

export default RankingBar
