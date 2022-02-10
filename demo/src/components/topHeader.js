import React,{ useState } from 'react';
import { Layout, Dropdown,Menu ,Avatar } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import MenuItem from 'antd/lib/menu/MenuItem';

const { Header } = Layout;
export default function TopHeader() {
  const [collapsed, setCollapsed] = useState(false);
  //改变折叠状态
  const changeCollapsed = () => {
    setCollapsed(!collapsed);
  }
  //下拉的依赖菜单
  const menu = (
    <Menu>
      <MenuItem>
        超级管理员
      </MenuItem>
      <MenuItem danger>
        退出
      </MenuItem>
    </Menu>
  )
  return (
    <Header className="site-layout-background" style={{ padding: "0 16px" }}>
      {
        collapsed?<MenuUnfoldOutlined onClick={changeCollapsed}/>:<MenuFoldOutlined onClick={changeCollapsed}/>
      }

      <div style={{float: "right"}}>
        <span>欢迎admin回来</span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined/>}/>
        </Dropdown>
      </div>
    </Header>
  );
}
