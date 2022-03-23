import React, { useEffect, useState } from 'react';
import { PageHeader, Descriptions } from 'antd';
import moment from 'moment';
import axios from 'axios';

export default function NewsPreview(props) {
    //新闻详情
    const [newsInfo, setNewsInfo] = useState(null);

    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            console.log("新闻详情", res.data);
            setNewsInfo(res.data);
        })
    }, [props.match.params.id])

    const auditList = ["未审核", "审核中", "已通过", "未通过"];
    const publishList = ["未发布", "待发布", "已上线", "已下线"];


    return (
        <div>
            {
                newsInfo && <div>
                    <PageHeader
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={newsInfo.category.title}
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">{
                                newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss") : "-"
                            }</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="审核状态" ><span style={{ color: "red" }}>{auditList[newsInfo.auditState]}</span></Descriptions.Item>
                            <Descriptions.Item label="发布状态" ><span style={{ color: "red" }}>{publishList[newsInfo.publishState]}</span></Descriptions.Item>
                            <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                            <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                            <Descriptions.Item label="评论数量">0</Descriptions.Item>
                        </Descriptions>
                    </PageHeader>

                    {/* content为dom结构的字符串，直接渲染的话会出现标签 
                        dangerouslySetInnerHTML是react中的自带属性，
                        可以将dom字符串转化为dom节点
                    */}
                    <div dangerouslySetInnerHTML={{
                        __html: newsInfo.content
                    }} style={{
                        margin: "0 24px",
                        border: "1px solid gray"
                    }}>
                    </div>
                </div>
            }
        </div>
    )
}