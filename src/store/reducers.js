import { combineReducers } from 'redux'
import rootReducer from './root'
import locationReducer from './location'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    root: rootReducer,
    location: locationReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
