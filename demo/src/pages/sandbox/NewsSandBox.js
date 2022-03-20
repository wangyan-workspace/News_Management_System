import React, { useEffect } from 'react';
import NProgress from 'nprogress';
//过渡动画css
import 'nprogress/nprogress.css'

//引入组件
import SideMenu from '../../components/sideMenu';
import TopHeader from '../../components/topHeader';
import NewsRouter from '../../components/NewsRouter';

//引入样式文件
import './NewsSandBox.css';
//引入antd
import { Layout } from 'antd';
const { Content } = Layout;

export default function NewsSandBox() {
  NProgress.start()
  useEffect(() => {
    NProgress.done()
  })
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
            overflow: "auto"
          }}
        >
          <NewsRouter></NewsRouter>
        </Content>
      </Layout>
    </Layout>
  );
}
