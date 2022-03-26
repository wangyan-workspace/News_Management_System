import { createStore, combineReducers } from 'redux';
import { CollapsedReducer } from './reducers/CollapsedReducer';

//combineReducers：将多个reducer进行合并
const reducer = combineReducers({
    CollapsedReducer,
})

const store = createStore(reducer);

export default store;

/*
 store.dispatch()

 store.subsribe()

*/