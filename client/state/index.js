import { createStore } from 'redux'
import reducer from './reducer'

/**
 * Create store
 */
const store = createStore(reducer)
export default store
