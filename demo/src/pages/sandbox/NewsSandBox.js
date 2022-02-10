import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

//引入组件
import SideMenu from '../../components/sideMenu';
import TopHeader from '../../components/topHeader';
import Home from '../home/home';
import NoPermission from '../nopermission/noPermission';
import RightList from '../rightManage/rightList';
import RoleList from '../rightManage/roleList';
import UserList from '../userManage/userList';
//引入样式文件
import './NewsSandBox.css';
//引入antd
import { Layout } from 'antd';
const { Content } = Layout;

export default function NewsSandBox() {
  return (
    <Layout>
        <SideMenu></SideMenu>
        <Layout className="site-layout">
          <TopHeader></TopHeader>
          <Content
            className="site-layout-background"
            style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                overflow:"auto"
            }}
          >
            <Switch>
              <Route path="/home" component={Home}/>
              <Route path="/user-manage/list" component={UserList}/>
              <Route path="/right-manage/role/list" component={RoleList}/>
              <Route path="/right-manage/right/list" component={RightList}/>

              {/* 重定向 */}
              <Redirect from="/" to="/home" exact/>
              {/* 模糊匹配，匹配不到对应的路由，进入未授权页面 */}
              <Route path="*" component={NoPermission}/>
            </Switch>
          </Content>
        </Layout>
        

        
    </Layout>
  );
}
