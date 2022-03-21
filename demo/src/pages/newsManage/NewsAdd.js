import React, { useState, useEffect, useRef } from 'react';
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd';
import NewsEditor from '../../components/newsManage/NewsEditor';
import style from './News.module.css';
import axios from 'axios';
const { Step } = Steps;
const { Option } = Select;

export default function NewsAdd(props) {
    // 步骤条
    const [current, setCurrent] = useState(0);
    // 新闻分类列表
    const [categoryList, setCategoryList] = useState([]);
    //存储表单的数据
    const [formInfo, setFormIInfo] = useState({});
    //存储编辑区域的数据内容
    const [content, setContent] = useState("");

    //创建ref接收表单的数据
    const NewsForm = useRef(null);

    //在本地localStorage获取用户信息
    const User = JSON.parse(localStorage.getItem("token"));

    useEffect(() => {
        axios.get('/categories').then(res => {
            setCategoryList(res.data);
        })
    }, [])

    const handleNext = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                // console.log(res);
                setFormIInfo(res);
                setCurrent(current + 1);
            }).catch(error => {
                console.log(error);
            })
        } else {
            if (content === "" || content.trim() === "<p></p>") {
                message.error("新闻内容不能为空！");
            } else {
                setCurrent(current + 1);
            }
        }
    }

    const handlePrevious = () => {
        setCurrent(current - 1);
    }
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    }
    const handleSave = (auditState) => {
        console.log(auditState);
        axios.post('/news', {
            ...formInfo,
            "content": content,
            "region": User.region ? User.region : "全球",
            "author": User.username,
            "roleId": User.roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            // "publishTime": 0
        }).then(res => {
            props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')

            notification.info({
                message: `通知`,
                description:
                    `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
                placement: "topRight",
            });
        })
    }
    return (
        <div>
            <PageHeader title="撰写新闻" />
            <Steps current={current}>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主体内容" />
                <Step title="新闻提交" description="保存草稿或者提交审核" />
            </Steps>

            <div style={{ marginTop: "50px" }}>
                <div className={current === 0 ? '' : style.active}>
                    <Form
                        {...layout}
                        ref={NewsForm}
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[{ required: true, message: '请输入新闻标题！' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[{ required: true, message: '请选择新闻分类！' }]}
                        >
                            <Select>
                                {
                                    categoryList.map(item => <Option value={item.id} key={item.id}>{item.title}</Option>)
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>

                <div className={current === 1 ? "" : style.active}>
                    <NewsEditor getContent={(value) => {
                        // console.log(value);
                        setContent(value);
                    }} />
                </div>
            </div>



            <div style={{ marginTop: "50px" }}>
                {
                    current === 2 && <span>
                        <Button type="primary" onClick={() => handleSave(0)}>保存草稿箱</Button>
                        <Button danger onClick={() => handleSave(1)}>提交审核</Button>
                    </span>
                }
                {
                    current < 2 && <Button type="primary" onClick={handleNext}>下一步</Button>
                }
                {
                    current > 0 && <Button onClick={handlePrevious}>上一步</Button>
                }
            </div>
        </div>
    )
}