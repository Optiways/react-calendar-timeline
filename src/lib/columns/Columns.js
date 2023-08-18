import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { iterateTimes } from '../utility/calendar'
import { TimelineStateConsumer } from '../timeline/TimelineStateContext'

const passThroughPropTypes = {
  canvasTimeStart: PropTypes.number.isRequired,
  canvasTimeEnd: PropTypes.number.isRequired,
  canvasWidth: PropTypes.number.isRequired,
  lineCount: PropTypes.number.isRequired,
  minUnit: PropTypes.string.isRequired,
  timeSteps: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  verticalLineClassNamesForTime: PropTypes.func
}

class Columns extends Component {
  static propTypes = {
    ...passThroughPropTypes,
    getLeftOffsetFromDate: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return !(
      nextProps.canvasTimeStart === this.props.canvasTimeStart &&
      nextProps.canvasTimeEnd === this.props.canvasTimeEnd &&
      nextProps.canvasWidth === this.props.canvasWidth &&
      nextProps.lineCount === this.props.lineCount &&
      nextProps.minUnit === this.props.minUnit &&
      nextProps.timeSteps === this.props.timeSteps &&
      nextProps.height === this.props.height &&
      nextProps.verticalLineClassNamesForTime ===
        this.props.verticalLineClassNamesForTime
    )
  }

  render() {
    const {
      canvasTimeStart,
      canvasTimeEnd,
      canvasWidth,
      minUnit,
      timeSteps,
      height,
      verticalLineClassNamesForTime,
      getLeftOffsetFromDate
    } = this.props
    const ratio = canvasWidth / (canvasTimeEnd - canvasTimeStart)

    let lines = []

    iterateTimes(
      canvasTimeStart,
      canvasTimeEnd,
      minUnit,
      timeSteps,
      (time, nextTime) => {
        let minUnitValue = 0;
        switch (minUnit){
          case 'year':
            minUnitValue = time.getFullYear(); break;
          case 'month':
            minUnitValue = time.getMonth(); break;
          case 'week':
            // ???
          case 'day':
            minUnitValue = time.getDate(); break;
          case 'hour':
            minUnitValue = time.getHours(); break;
          case 'minute':
            minUnitValue = time.getMinutes(); break;
          case 'seconds':
            minUnitValue = time.getSeconds(); break;
        };
        const firstOfType = minUnitValue === (minUnit === 'day' ? 1 : 0)

        let classNamesForTime = []
        if (verticalLineClassNamesForTime) {
          classNamesForTime = verticalLineClassNamesForTime(
            time, 
            nextTime - 1
          )
        }

        // TODO: rename or remove class that has reference to vertical-line
        const classNames =
          'rct-vl' +
          (firstOfType ? ' rct-vl-first' : '') +
          (minUnit === 'day' || minUnit === 'hour' || minUnit === 'minute'
            ? ` rct-day-${time.getDate()} `
            : ' ') +
          classNamesForTime.join(' ')

        const left = getLeftOffsetFromDate(time.valueOf())
        const right = getLeftOffsetFromDate(nextTime.valueOf())
        lines.push(
          <div
            key={`line-${time.valueOf()}`}
            className={classNames}
            style={{
              pointerEvents: 'none',
              top: '0px',
              left: `${left}px`,
              width: `${right - left}px`,
              height: `${height}px`
            }}
          />
        )
      }
    )

    return <div className="rct-vertical-lines">{lines}</div>
  }
}

const ColumnsWrapper = ({ ...props }) => {
  return (
    <TimelineStateConsumer>
      {({ getLeftOffsetFromDate }) => (
        <Columns getLeftOffsetFromDate={getLeftOffsetFromDate} {...props} />
      )}
    </TimelineStateConsumer>
  )
}

ColumnsWrapper.defaultProps = {
  ...passThroughPropTypes
}

export default ColumnsWrapper
