import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
//引入withRouter高阶组件，是当前组件随时随地的获取props上面的属性
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import {
  UserOutlined
} from '@ant-design/icons';
import './index.css';
const { Sider } = Layout;
const { SubMenu } = Menu;

//模拟数组结构
// const  menuList = [
//   {
//     key:"/home",
//     title:"首页",
//     icon:<UserOutlined />
//   },
//   {
//     key:"/user-manage",
//     title:"用户管理",
//     icon:<UserOutlined />,
//     children:[
//       {
//         key:"/user-manage/list",
//         title:"用户列表",
//         icon:<UserOutlined />
//       }
//     ]
//   },
//   {
//     key:"/right-manage",
//     title:"权限管理",
//     icon:<UserOutlined />,
//     children:[
//       {
//         key:"/right-manage/role/list",
//         title:"角色列表",
//         icon:<UserOutlined />
//       },
//       {
//         key:"/right-manage/right/list",
//         title:"权限列表",
//         icon:<UserOutlined />
//       }
//     ]
//   }
// ]

//侧边菜单栏的图标映射
const iconList = {
  "/home": <UserOutlined />,
  "/user-manage": <UserOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/right-manage": <UserOutlined />,
  "/right-manage/role/list": <UserOutlined />,
  "/right-manage/right/list": <UserOutlined />
  //.......
}

function SideMenu(props) {
  //获取路由导航完整路径
  const selectKeys = [props.location.pathname];
  //分割取出一级菜单
  const openKeys = ["/" + props.location.pathname.split("/")[1]];

  //存储菜单栏列表
  const [menu, setMenu] = useState([]);

  const {role:{rights}} = JSON.parse(localStorage.getItem("token"));
  //获取侧边菜单栏数据
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {
      console.log(res.data);
      setMenu(res.data);
    })
  }, [])

  //页面权限的回调函数
  const checkPagePermission = (item) => {
    //对应的用户角色展示对应的用户权限的页面
    return item.pagepermisson && rights.includes(item.key);
  }
  const renderMenu = (menuList) => {
    return menuList.map(item => {
      if (item.children?.length > 0 && checkPagePermission(item)) {
        return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
          {/* 递归调用 */}
          {renderMenu(item.children)}
        </SubMenu>
      }

      return checkPagePermission(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => {
        //  console.log(props)
        props.history.push(item.key)
      }}>{item.title}</Menu.Item>
    })
  }

  return (
    <Sider trigger={null} collapsible collapsed={false} >
      <div className='side'>
        <div className="logo">全球新闻发布管理系统</div>
        <div className='menu'>
          {/* defaultOpenKeys	初始展开的 SubMenu 菜单项 key 数组 */}
          {/* selectedKeys	当前选中的菜单项 key 数组 ==> 组件是受控组件*/}
          {/* defaultSelectedKeys	初始选中的菜单项 key 数组 ==> 将组件变成非受控组件 */}
          <Menu theme="dark" mode="inline" selectedKeys={selectKeys} defaultOpenKeys={openKeys}>
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  );
}

export default withRouter(SideMenu);
