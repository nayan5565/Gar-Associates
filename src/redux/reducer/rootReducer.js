import { combineReducers } from 'redux'
import apiReducer from './apiReduce'
const rootReducer = combineReducers({
    csvData: apiReducer,

})
export default rootReducer