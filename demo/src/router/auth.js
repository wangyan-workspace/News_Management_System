import React from 'react';
import { HashRouter,Redirect,Route,Switch} from 'react-router-dom';
import Login from '../pages/login/Login';
import NewsSandBox from '../pages/sandbox/NewsSandBox';
export default function Auth() {
  return (
      <HashRouter>
          <Switch>
                <Route path="/login" component={Login}/>
                {/* <Route path="/" component={NewsSandBox}/> */}
                <Route path="/" render={()=>
                    localStorage.getItem("token")?
                    <NewsSandBox></NewsSandBox>:
                    <Redirect to="/login"/>
                }/>
          </Switch>
      </HashRouter>
  );
}

