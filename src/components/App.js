import React from 'react'
import { hashHistory, Router } from 'react-router'
import { Provider, connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getConfig } from '@/store/root'

@connect((state) => ({}), { getConfig })
class App extends React.Component {
  static propTypes = {
    getConfig: PropTypes.func,
    store: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
  }

  componentDidMount () {
    const { getConfig } = this.props
    getConfig && getConfig()
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    return (
      <Provider store={this.props.store}>
        <div style={{ height: '100%' }}>
          <Router history={hashHistory} children={this.props.routes} />
        </div>
      </Provider>
    )
  }
}

export default App
