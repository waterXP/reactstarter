import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DatePicker } from 'antd';

class CounterChild extends Component {
  render () {
    return <DatePicker />
  }
}

export default CounterChild
