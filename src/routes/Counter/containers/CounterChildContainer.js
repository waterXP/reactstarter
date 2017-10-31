import { connect } from 'react-redux'
import CounterChild from '../components/CounterChild'

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
}

const CounterChildContainer = connect(mapStateToProps, mapDispatchToProps)(CounterChild)

export default (store) => ({
  path: 'child',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      cb(null, connect(mapStateToProps, mapDispatchToProps)(CounterChild))
    }, 'child')
  }
})
