import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios'
import * as Echarts from 'echarts'
import _ from 'lodash'

const { Meta } = Card;

// import axios from 'axios'
export default function Home() {
  //存储已经发布的用户最常浏览的新闻
  const [viewList, setViewList] = useState([]);
  // 存储已经发布的最受欢迎的新闻
  const [starList, setStarList] = useState([]);
  //存储已经发布的所有新闻
  const [allList, setAllList] = useState([]);
  //饼状图是否展示出来
  const [visible, setVisible] = useState(false);
  //对应饼状图 防止多次初始化
  const [pieChart, setPieChart] = useState(null);

  //柱状图
  const barRef = useRef();
  //饼状图
  const pieRef = useRef();

  //获取已经发布的用户最常浏览的新闻
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then(res => {
      // console.log(res.data)
      setViewList(res.data);
    })
  }, [])

  //获取已经发布的最受欢迎的新闻
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6").then(res => {
      // console.log(res.data)
      setStarList(res.data);
    })
  }, [])

  //获取已经发布的所有新闻
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then(res => {
      // console.log(res.data)

      //lodash.groupBy 处理数组对象按需分组
      renderBarView(_.groupBy(res.data, item => item.category.title));

      setAllList(res.data);
    })

    // 离开首页时，去掉onresize方法，防止影响到其他的页面
    return () => {
      window.onresize = null
    }
  }, [])

  const renderBarView = (obj) => {
    var myChart = Echarts.init(barRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      //x轴
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: "45",
          interval: 0
        }
      },
      // y轴
      yAxis: {
        minInterval: 1  //设置数量表示最小间距为1，防止1.5的情况
      },
      series: [{
        name: '数量',
        type: 'bar',
        data: Object.values(obj).map(item => item.length)
      }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);


    //处理柱状图响应式变化，随着窗口的大小，改变柱状图的大小
    window.onresize = () => {
      // console.log("resize")
      myChart.resize();
    }
  }

  const renderPieView = (obj) => {
    //数据处理工作
    var currentList = allList.filter(item => item.author === username);
    //lodash.groupBy 处理数组对象按需分组
    var groupObj = _.groupBy(currentList, item => item.category.title);
    var list = []
    for (var i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length
      })
    }
    var myChart;
    //pieChart的作用防止渲染多次
    if (!pieChart) {
      myChart = Echarts.init(pieRef.current);
      setPieChart(myChart)
    } else {
      myChart = pieChart
    }
    var option = {
      title: {
        text: '当前用户新闻分类图示',
        // subtext: '纯属虚构',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);

  }

  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem("token"))
  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              size="small"
              // bordered
              dataSource={viewList}
              renderItem={item => <List.Item>
                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              // bordered
              dataSource={starList}
              renderItem={item => <List.Item>
                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" onClick={() => {
                // 等到dom结构渲染才能渲染出饼状图，放在setTimeout里面处理
                setTimeout(() => {
                  setVisible(true)

                  // init初始化
                  renderPieView()
                }, 0)
              }} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
              title={username}
              description={
                <div>
                  <b>{region ? region : "全球"}</b>
                  <span style={{
                    paddingLeft: "30px"
                  }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <Drawer
        width="500px"
        title="个人新闻分类"
        placement="right"
        closable={true}
        onClose={() => {
          setVisible(false)
        }}
        visible={visible}
      >
        <div ref={pieRef} style={{
          width: '100%',
          height: "400px",
          marginTop: "30px"
        }}></div>
      </Drawer>


      <div ref={barRef} style={{
        width: '100%',
        height: "400px",
        marginTop: "30px"
      }}></div>
    </div>
  )
}
