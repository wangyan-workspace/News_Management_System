// import { useEffect } from 'react';
// import axios from 'axios';
import Auth from './router/auth'
import './App.css';

function App() {
  // []相当于生命周期的componentDidMount 只加载一次
  // useEffect(() => {
  //   axios.get("/api/mmdb/movie/v3/list/hot.json?ct=%E9%B9%A4%E5%B2%97&ci=170&channelId=4").then(res => {
  //     console.log(res);
  //   })
  // },[])
  return (
      <Auth></Auth>
  );
}

export default App;
