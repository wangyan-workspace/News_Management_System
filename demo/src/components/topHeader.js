import React from 'react';
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const { Header } = Layout;

function TopHeader(props) {
  // const [collapsed, setCollapsed] = useState(false);
  //改变折叠状态
  const changeCollapsed = () => {
    // setCollapsed(!collapsed);
    props.changeCollapsed()
  }

  const { role: { roleName }, username } = JSON.parse(localStorage.getItem("token"));
  //下拉的依赖菜单
  const menu = (
    <Menu>
      <Menu.Item>
        {roleName}
      </Menu.Item>
      <Menu.Item
        danger={true}
        onClick={() => {
          //清除token
          localStorage.removeItem("token");
          // 跳转到登录页面
          props.history.replace("/login")
        }}
      >
        退出
      </Menu.Item>
    </Menu>
  )
  return (
    <Header className="site-layout-background" style={{ padding: "0 16px" }}>
      {
        props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
      }

      <div style={{ float: "right" }}>
        <span>欢迎<span style={{ color: "#1890ff" }}>{username}</span>回来</span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
}

/*
 connect(
  // mapStateToProps  
  // mapDispatchToProps
 )(被包装的组件)
*/

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
  return {
    isCollapsed
  }
}

const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: "change_collapsed"
      //payload
    } //action
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(TopHeader));