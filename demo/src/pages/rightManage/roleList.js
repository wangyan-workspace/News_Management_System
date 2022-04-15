import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Tree } from 'antd';
import axios from 'axios';
import {
  DeleteOutlined,
  UnorderedListOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { confirm } = Modal;

export default function RoleList() {
  //表格中的每一列数据
  const [dataSource, setDataSource] = useState([]);
  // 权限列表(所有的权限)
  const [rightList, setRightList] = useState([]);
  // 当前的角色的权限（当前角色所拥有的权限）
  const [currentRights, setCurrentRights] = useState([]);
  // 当前角色的ID
  const [currentId, setCurrentId] = useState(0);
  // 是否展示弹窗
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 获取角色列表
  useEffect((item) => {
    axios.get("/roles").then(res => {
      console.log("roleList", res.data);
      setDataSource(res.data);
    })
  }, [])
  //获取权限列表
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {
      console.log("rightList", res.data);
      setRightList(res.data);
    })
  }, [])
  // 表格中的表头数据
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button
            danger
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => { confirmMethod(item) }}
          ></Button>
          <Button
            type='primary'
            shape="circle"
            icon={<UnorderedListOutlined />}
            onClick={() => {
              console.log(item);
              setIsModalVisible(true);
              console.log("currentRights", item.rights);
              setCurrentRights(item.rights);
              setCurrentId(item.id);
            }}
          ></Button>
        </div>
      }
    }
  ]
  //是否要删除的确认弹窗
  const confirmMethod = (item) => {
    confirm({
      title: '你确定要删除吗?',
      okText: "确定",
      cancelText: "取消",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethod(item);
      },
      onCancel() {
        console.log("cancel");
      }
    })
  }
  // 删除对应的角色
  const deleteMethod = (item) => {
    setDataSource(dataSource.filter(data => data.id !== item.id));
    //同步后端数据
    axios.delete(`/roles/${item.id}`);
  }
  // 弹窗确认的回调
  const handleOk = () => {
    console.log(currentRights, currentId);
    setIsModalVisible(false);
    const newDataSource = dataSource.map(item => {
      //当前项的数据进行更新
      if (item.id === currentId) {
        return {
          ...item,
          rights: currentRights
        }
      }
      return item;
    })
    // console.log(newDataSource);
    setDataSource(newDataSource);
    // 更新同步到后端的数据 patch
    axios.patch(`/roles/${currentId}`, {
      rights: currentRights
    })
  }
  // 弹窗中取消的回调
  const handleCancel = () => {
    setIsModalVisible(false);
  }
  // 点击复选框触发
  const onCheck = (checkedKeys) => {
    console.log(checkedKeys);
    setCurrentRights(checkedKeys.checked)
  }
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        // table组件中自带的key属性需要进行遍历
        // 当后端返回的数据中没有key时，前端可以通过
        // rowKey这个属性取每一项的唯一值作为key值
        rowKey={(item) => item.id}
      ></Table>
      <Modal
        title="权限分配"
        visible={isModalVisible}
        okText="确定"
        cancelText="取消"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {/* 树形控件 */}
        <Tree
          //选项可选 节点前添加 Checkbox 复选框
          checkable
          //使组件成为一个受控的组件
          // currentRights 可以将对应角色所拥有的权限被选中
          checkedKeys={currentRights}
          //点击复选框触发
          onCheck={onCheck}
          //checkable 状态下节点选择完全受控（父子节点选中状态不再关联
          checkStrictly={true}
          //将所有权限进行映射
          treeData={rightList}
        />
      </Modal>
    </div>
  );
}