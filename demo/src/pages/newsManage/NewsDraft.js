import React, { useState, useEffect } from 'react'
import { Button, Table, Modal, notification } from 'antd';
import axios from 'axios';
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    UploadOutlined
} from '@ant-design/icons';
const { confirm } = Modal;
export default function NewsDraft(props) {
    //存储用户的草稿数据
    const [dataSource, setDataSource] = useState([]);

    const { username } = JSON.parse(localStorage.getItem("token"));

    useEffect(() => {
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
            const list = res.data;
            console.log("草稿箱里面的数据", list);
            setDataSource(list);
        })
    }, [username])

    const columns = [
        {
            title: "ID",
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: "新闻标题",
            dataIndex: 'title',
            render: (title, item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: "作者",
            dataIndex: 'author'
        },
        {
            title: "分类",
            dataIndex: 'category',
            render: (category) => {
                return category.title
            }
        },
        {
            title: "操作",
            render: (item) => {
                return <div>
                    <Button
                        danger
                        shape='circle'
                        icon={<DeleteOutlined />}
                        onClick={() => confirmMethod(item)}
                    />
                    <Button
                        shape='circle'
                        icon={<EditOutlined />}
                        onClick={() => {
                            props.history.push(`/news-manage/update/${item.id}`)
                        }}
                    />
                    <Button
                        type='primary'
                        shape='circle'
                        icon={<UploadOutlined />}
                        onClick={() => {
                            handleCheck(item.id)
                        }}
                    />
                </div>
            }
        }
    ]
    //删除草稿箱里数据确认弹窗
    const confirmMethod = (item) => {
        confirm({
            title: "你确定要删除吗?",
            okText: "确定",
            cancelText: "取消",
            icon: <ExclamationCircleOutlined />,
            onOk() {
                deleteMethod(item);
            },
            onCancel() {
                console.log('Cancel');
            },
        })
    }
    //删除数据
    const deleteMethod = (item) => {
        setDataSource(dataSource.filter(data => data.id !== item.id));
        axios.delete(`/news/${item.id}`);
    }
    //提交新闻进入审核列表
    const handleCheck = (id) => {
        axios.patch(`/news/${id}`, {
            auditState: 1
        }).then(res => {
            props.history.push('/audit-manage/list')

            notification.info({
                message: `通知`,
                description:
                    "您可以到审核列表中查看您的新闻",
                placement: "topRight"
            });
        })
    }
    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={{ pageSize: 5 }}
                rowKey={item => item.id}
            />
        </div>
    )
}