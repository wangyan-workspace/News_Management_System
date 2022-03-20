import React, { forwardRef, useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';

const { Option } = Select;

const UserForm = forwardRef((props, ref) => {
    //区域配置是否禁用
    const [isDisabled, setIsDisabled] = useState(false);

    //通过父组件传递过来的isUpdateDisabled，来影响区域是否禁用
    useEffect(() => {
        setIsDisabled(props.isUpdateDisabled);
    }, [props.isUpdateDisabled])

    const { roleId, region } = JSON.parse(localStorage.getItem("token"));
    const roleObj = {
        "1": "superAdmin",
        "2": "admin",
        "3": "editor"
    }
    const checkRegionDisabled = (item) => {
        console.log(item);
        if (props.isUpdate) {
            if (roleObj[roleId] === "superAdmin") {
                return false;
            } else {
                return true;
            }
        } else {
            if (roleObj[roleId] === "superAdmin") {
                return false;
            } else {
                return item.value !== region;
            }
        }
    }
    const checkRoleDisabled = (item) => {
        console.log(item);
        if (props.isUpdate) {
            if (roleObj[roleId] === "superAdmin") {
                return false;
            } else {
                return true;
            }
        } else {
            if (roleObj[roleId] === "superAdmin") {
                return false;
            } else {
                return roleObj[item.id] !== "editor";
            }
        }
    }
    return (
        <Form
            layout='vertical'
            //父组件传递的ref
            ref={ref}
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[{
                    required: true,
                    message: "此项为必填项"
                }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: "此项为必填项" }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={isDisabled ? [] : [{ required: true, message: "此项为必填项" }]}
            >
                <Select disabled={isDisabled}>
                    {
                        props.regionList.map(item =>
                            <Option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>{item.title}</Option>
                        )
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[{ required: true, message: "此项为必填项" }]}
            >
                <Select
                    onChange={(value) => {
                        if (value === 1) {
                            //如果角色为超级管理员，区域选择设置为禁用
                            setIsDisabled(true);
                            // 设置表单域中区域为空字符串
                            // ref.current当前form的表单
                            // setFieldsValue 设置表单某一项值的方法
                            ref.current.setFieldsValue({
                                region: ""
                            })
                        } else {
                            setIsDisabled(false);
                        }
                    }}
                >
                    {
                        props.roleList.map(item =>
                            <Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</Option>
                        )
                    }
                </Select>
            </Form.Item>
        </Form>
    )

})

export default UserForm;
