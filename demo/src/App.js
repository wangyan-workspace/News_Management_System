import Auth from './router/auth';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import './App.css';

function App() {
  // []相当于生命周期的componentDidMount 只加载一次
  // useEffect(() => {
  //   axios.get("/api/mmdb/movie/v3/list/hot.json?ct=%E9%B9%A4%E5%B2%97&ci=170&channelId=4").then(res => {
  //     console.log(res);
  //   })
  // },[])
  return (
    <Provider store={store}>
      {/* 数据持久化 */}
      <PersistGate loading={null} persistor={persistor}>
        <Auth></Auth>
      </PersistGate>
    </Provider>
  );
}

export default App;
