import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Modal } from 'antd';
import axios from 'axios';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from '@ant-design/icons'

const { confirm } = Modal;

export default function RightList() {
  //存储获取的权限列表
  const [dataSource,setdataSourse] = useState([]);

  //获取权限列表
  useEffect(() => {
    axios.get("http://localhost:5000/rights?_embed=children").then(res => {
      const list = res.data;
      //首页没有二级菜单，首先要先置为空，表格的树形结构会根据children属性自动生成
      list.forEach(item => {
        if(item.children.length === 0) {
          item.children = "";
        }
      })
      setdataSourse(list);
    })
  },[])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title'
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color="orange">{key}</Tag>
      }
    },
    {
      title: "操作",
      render: (item) => {
        //当前行数据
        // console.log(item);
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)}></Button>
          <Button type="primary" shape="circle" icon={<EditOutlined />}></Button>
        </div>
      }
    }
  ]

  const confirmMethod = (item) => {
    confirm({
      title: '你确定要删除吗？',
      icon: <ExclamationCircleOutlined/>,
      onOk() {
        deleteMethod(item);
      },
      onCancel() {

      }
    })
  }
  //删除没有权限（当前没有权限不能展示）的页面
  const deleteMethod = (item) => {
    // 当前页面同步状态+后端同步
    if(item.grade === 1) {
      //同步更新一级页面信息
      setdataSourse(dataSource.filter(data => data.id !== item.id));
      //侧边菜单栏的状态也要同步更新
      axios.delete(`http://localhost:5000/rights/${item.id}`);
    } else {
      console.log(dataSource);
      //当删除二级页面信息时，先找出对应的一级路标的数组，在删除二级路标对应某一条的数据
      let list = dataSource.filter(data => data.id === item.rightId);
      // console.log(list);
      list[0].children = list[0].children.filter(data => data.id !== item.id);
      //filter是浅拷贝，二级页面信息发生改变时，dataSource会受到影响，要重新赋予dataSource新的值，并且必须要使用解构赋值的方式
      setdataSourse([...dataSource]);
      //侧边菜单栏的状态也要同步更新
      axios.delete(`http://localhost:5000/children/${item.id}`);
    }
  }

  return (
    <div>
        <Table 
          dataSource={dataSource} 
          columns={columns} 
          pagination={{
            pageSize: 5
          }}
        />
    </div>
  );
}