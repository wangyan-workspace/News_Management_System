import React, { useState, useEffect, useRef } from 'react';
import { Button, Table, Modal, Switch } from 'antd';
import UserForm from '../../components/userManage/userForm';
import axios from 'axios';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { confirm } = Modal;

export default function UserList() {
  //表单中的数据
  const [dataSource, setDataSource] = useState([]);
  //添加用户表单是否显示出来
  const [isAddVisible, setIsAddVisible] = useState(false);
  //角色配置列表
  const [roleList, setRoleList] = useState([]);
  //区域配置列表
  const [regionList, setRegionList] = useState([]);
  // 更新用户信息的表单是否展示出来
  const [isUpdateVisible, setIsUpdateVisible] = useState(false);
  // 更新用户数据时，数据回显，当角色是超级管理员，区域选择应该禁用
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);
  // 保存当前的数据
  const [current, setCurrent] = useState(null);

  // 创建“添加用户”的ref,在父组件中可以拿取子组件中的Dom节点
  const addForm = useRef(null);
  // 创建“更新用户信息”的ref,在父组件中可以拿取子组件中的Dom节点
  const updateForm = useRef(null);

  //请求用户的相关数据
  useEffect(() => {
    axios.get("http://localhost:5000/users?_expand=role").then(res => {
      const userList = res.data;
      console.log("userList", userList);
      setDataSource(userList);
    })
  }, []);

  //请求获取区域数据
  useEffect(() => {
    axios.get("http://localhost:5000/regions").then(res => {
      const regionList = res.data;
      console.log("regionList", regionList);
      setRegionList(regionList);
    })
  }, [])

  //请求获取角色数据
  useEffect(() => {
    axios.get("http://localhost:5000/roles").then(res => {
      const roleList = res.data;
      console.log("roleList", roleList);
      setRoleList(roleList);
    })
  }, [])

  //表头数据对应匹配
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item => ({
          text: item.title,
          value: item.value
        })),
        {
          text: "全球",
          value: "全球"
        }
      ],
      onFilter: (value, item) => {
        if (value === "全球") {
          return item.region === ""
        }
        return item.region === value
      },
      render: (region) => {
        return <b>{region === "" ? "全球" : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        // 安全链式调用
        return role?.roleName;
      }
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch
          checked={roleState}
          disabled={item.default}
          onChange={() => handleChange(item)}
        ></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button
            danger
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => confirmMethod(item)}
            disabled={item.default}
          />
          <Button
            type='primary'
            shape="circle"
            icon={<EditOutlined />}
            disabled={item.default}
            onClick={() => handleUpdate(item)}
          />
        </div>
      }
    },
  ]

  //删除用户的确认框弹出回调
  const confirmMethod = (item) => {
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethod(item);
      },
      onCancel() {
        console.log("cancel");
      }
    })
  }
  // 删除用户
  const deleteMethod = (item) => {
    console.log(item);
    //当前页面同步+后端同步
    setDataSource(dataSource.filter(data => data.id !== item.id));
    axios.delete(`http://localhost:5000/users/${item.id}`);

  }

  // 添加用户点击确定时的回调函数
  const addFormOk = () => {
    // validateFields触发表单验证
    addForm.current.validateFields().then(value => {
      // value指的是表单项
      // console.log(value);
      setIsAddVisible(false);

      //post到后端，生成id，在设置dataSource,方便后面的删除和更新
      axios.post("http://localhost:5000/users", {
        ...value,
        "roleState": true,
        "default": false
      }).then(res => {
        // res.data添加后的数据
        // console.log(res.data);
        setDataSource([...dataSource, {
          ...res.data,
          role: roleList.filter(item => item.id === value.roleId)[0]
        }]);
      }).catch(err => {
        console.log(err);
      })

    })
  }
  //用户状态切换开关
  const handleChange = (item) => {
    console.log(item);
    //同步本地数据+后端服务
    item.roleState = !item.roleState;
    setDataSource([...dataSource]);

    axios.patch(`http://localhost:5000/users/${item.id}`, {
      roleState: item.roleState
    })
  }
  //
  const handleUpdate = (item) => {
    //将异步操作放到setTimeout中可实现同步效果
    setTimeout(() => {
      setIsUpdateVisible(true);
      if (item.roleId === 1) {
        //区域选择禁用
        setIsUpdateDisabled(true);
      } else {
        //区域可选择，取消禁用
        setIsUpdateDisabled(false);
      }
      //setFieldsValue动态改变表单值，将对应的数据回显到表单中
      updateForm.current.setFieldsValue(item)
    }, 0)

    //保存当前数据，方便更新数据时使用
    setCurrent(item);
  }
  const updateFormOK = () => {
    console.log(updateForm.current);
    updateForm.current.validateFields().then(value => {
      console.log(value);
      setIsUpdateVisible(false);
      setDataSource(dataSource.map(item => {
        if (item.id === current.id) {
          return {
            ...item,
            ...value,
            role: roleList.filter(data => data.id === value.roleId)[0]
          }
        }
        return item
      }))
      //如果操作为超级管理员，isUpdateDisabled为true,禁用状态
      //要将禁用的标识置返，否则会影响下一条数据的修改
      setIsUpdateDisabled(!isUpdateDisabled);

      //更新后端数据
      axios.patch(`http://localhost:5000/users/${current.id}`, value);
    })
  }
  return (
    <div>
      <Button type="primary" onClick={() => {
        setIsAddVisible(true);
      }}>添加用户</Button>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5
        }}
        rowKey={item => item.id}
      />
      <Modal
        visible={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setIsAddVisible(false);
        }}
        onOk={() => addFormOk()}
      >
        <UserForm
          regionList={regionList}
          roleList={roleList}
          ref={addForm}
        />
      </Modal>
      <Modal
        visible={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setIsUpdateVisible(false);
          setIsUpdateDisabled(!isUpdateDisabled);
        }}
        onOk={() => updateFormOK()}
      >
        <UserForm
          regionList={regionList}
          roleList={roleList}
          ref={updateForm}
          isUpdateDisabled={isUpdateDisabled}
        />
      </Modal>
    </div>
  );
}