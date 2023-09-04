import React from 'react'
import PropTypes from 'prop-types'
import { TimelineStateConsumer } from '../timeline/TimelineStateContext'
import CustomHeader from './CustomHeader'
import { getNextUnit } from '../utility/calendar'
import { defaultHeaderFormats } from '../default-config'
import memoize from 'memoize-one'
import { CustomDateHeader } from './CustomDateHeader'
import { intlFormat } from 'date-fns'

class DateHeader extends React.Component {
  static propTypes = {
    unit: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    timelineUnit: PropTypes.string,
    labelFormat: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
      PropTypes.string
    ]).isRequired,
    intervalRenderer: PropTypes.func,
    headerData: PropTypes.object,
    height: PropTypes.number
  }

  getHeaderUnit = () => {
    if (this.props.unit === 'primaryHeader') {
      return getNextUnit(this.props.timelineUnit)
    } else if (this.props.unit) {
      return this.props.unit
    }
    return this.props.timelineUnit
  }

  getRootStyle = memoize(style => {
    return {
      height: 30,
      ...style
    }
  })

  getLabelFormat = (interval, unit, labelWidth) => {
    const { labelFormat } = this.props
    const startTime = interval[0];
    if (typeof labelFormat === 'string') {
      return intlFormat(startTime, {locale: labelFormat});
    } else if (typeof labelFormat === "object") {
      return intlFormat(startTime, labelFormat);
    }
    else if (typeof labelFormat === 'function') {
      return labelFormat(interval, unit, labelWidth)
    } else {
      throw new Error('labelFormat should be function or string')
    }
  }

  getHeaderData = memoize(
    (
      intervalRenderer,
      style,
      className,
      getLabelFormat,
      unitProp,
      headerData
    ) => {
      return {
        intervalRenderer,
        style,
        className,
        getLabelFormat,
        unitProp,
        headerData
      }
    }
  )

  render() {
    const unit = this.getHeaderUnit()
    const { headerData, height } = this.props
    return (
      <CustomHeader
        unit={unit}
        height={height}
        headerData={this.getHeaderData(
          this.props.intervalRenderer,
          this.getRootStyle(this.props.style),
          this.props.className,
          this.getLabelFormat,
          this.props.unit,
          this.props.headerData
        )}
        children={CustomDateHeader}
      />
    )
  }
}

const DateHeaderWrapper = ({
  unit,
  labelFormat,
  style,
  className,
  intervalRenderer,
  headerData,
  height
}) => (
  <TimelineStateConsumer>
    {({ getTimelineState }) => {
      const timelineState = getTimelineState()
      return (
        <DateHeader
          timelineUnit={timelineState.timelineUnit}
          unit={unit}
          labelFormat={labelFormat}
          style={style}
          className={className}
          intervalRenderer={intervalRenderer}
          headerData={headerData}
          height={height}
        />
      )
    }}
  </TimelineStateConsumer>
)

DateHeaderWrapper.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  unit: PropTypes.string,
  labelFormat: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
    PropTypes.string
  ]),
  intervalRenderer: PropTypes.func,
  headerData: PropTypes.object,
  height: PropTypes.number
}

DateHeaderWrapper.defaultProps = {
  labelFormat: formatLabel
}

function formatLabel(
  [timeStart, timeEnd],
  unit,
  labelWidth,
  formatOptions = defaultHeaderFormats
) {
  const format = {
    year: 'numeric',
    month: 'long',
    weekday: 'long',
    day: 'numeric'
  }
  return intlFormat(timeStart, format)
}

export default DateHeaderWrapper
