import { createStore, combineReducers } from 'redux';
import { CollapsedReducer } from './reducers/CollapsedReducer';
import { LoadingReducer } from './reducers/LoadingReducer';

// 数据持久化
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
    key: 'lucky',
    storage,
    //配置黑名单，存放不需要缓存reducer
    blacklist: ['LoadingReducer']
}

//combineReducers：将多个reducer进行合并
const reducer = combineReducers({
    CollapsedReducer,
    LoadingReducer
})

const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer);
let persistor = persistStore(store)

export { store, persistor };

/*
 store.dispatch()

 store.subsribe()

*/