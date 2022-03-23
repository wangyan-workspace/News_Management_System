import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from '../pages/home/Home';
import NoPermission from '../pages/noPermission/NoPermission';
import RightList from '../pages/rightManage/rightList';
import RoleList from '../pages/rightManage/roleList';
import UserList from '../pages/userManage/userList';
import NewsAdd from '../pages/newsManage/NewsAdd';
import NewsDraft from '../pages/newsManage/NewsDraft';
import NewsCategory from '../pages/newsManage/NewsCategory';
import Audit from '../pages/auditManage/Audit';
import AuditList from '../pages/auditManage/AuditList';
import Unpublished from '../pages/publishManage/Unpublished';
import Published from '../pages/publishManage/Published';
import Sunset from '../pages/publishManage/Sunset';
import NewsPreview from '../pages/newsManage/NewsPreview';
import NewsUpdate from '../pages/newsManage/NewsUpdate';
import axios from 'axios';

//动态映射路由
const LocalRouterMap = {
    "/home": Home,
    "/user-manage/list": UserList,
    "/right-manage/role/list": RoleList,
    "/right-manage/right/list": RightList,
    "/news-manage/add": NewsAdd,
    "/news-manage/draft": NewsDraft,
    "/news-manage/category": NewsCategory,
    "/news-manage/preview/:id": NewsPreview,
    "/news-manage/update/:id": NewsUpdate,
    "/audit-manage/audit": Audit,
    "/audit-manage/list": AuditList,
    "/publish-manage/unpublished": Unpublished,
    "/publish-manage/published": Published,
    "/publish-manage/sunset": Sunset
}
export default function NewsRouter() {
    // 存储后端返回的路由信息
    const [backRouteList, setBackRouteList] = useState([]);

    const { role: { rights } } = JSON.parse(localStorage.getItem("token"));

    useEffect(() => {
        Promise.all([
            axios.get("/rights"),
            axios.get("/children"),
        ]).then(res => {
            console.log("获取路由信息", res);
            setBackRouteList([...res[0].data, ...res[1].data]);
        })
    }, [])
    //有权限且路由匹配
    const checkRoute = (item) => {
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }
    // 匹配获取对应的权限页面
    const checkUserPermission = (item) => {
        return rights.includes(item.key);
    }
    return (
        <Switch>
            {
                backRouteList.map(item => {
                    if (checkRoute(item) && checkUserPermission(item)) {
                        return <Route
                            path={item.key}
                            key={item.key}
                            component={LocalRouterMap[item.key]}
                            exact
                        />
                    }
                    return null;
                })
            }

            {/* 重定向 */}
            <Redirect from="/" to="/home" exact />
            {/* 模糊匹配，匹配不到对应的路由，进入未授权页面 */}
            {
                //防止首页面初次加载出现未授权的字样，闪一下效果不太好
                backRouteList.length > 0 && <Route path="*" component={NoPermission} />
            }
        </Switch>
    )
}