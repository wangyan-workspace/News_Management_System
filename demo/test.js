import React from 'react';
import { Button } from 'antd';
// import axios from 'axios';

//链接json-webserver 使用的简单方法
export default function Test() {
  const ajax = () => {
    //取数据  get 查
    // axios.get("http://localhost:8000/posts").then(res => {
    //   console.log(res.data);
    // })

    //取某一条数据 get
    //返回一个对象
    // axios.get("http://localhost:8000/posts/2").then(res => {
    //   console.log(res.data);
    // })

    //返回一个数组，数组中包含着想要获取的对象
    // axios.get("http://localhost:8000/posts?id=3").then(res => {
    //   console.log(res.data);
    // })

    //增 post
    // axios.post("http://localhost:8000/posts",{
    //   title: "444",
    //   author: "huahua"
    // })

    //更新 put  覆盖式修改，不需要改动的属性如果没有一起写进数据里，将会被覆盖掉，操作危险
    // axios.put("http://localhost:8000/posts/1",{
    //   title: "11111111-修改"
    // })

    //更新patch 补丁式更新 将需要修改的属性添加到对应属性的对象中
    // axios.patch("http://localhost:8000/posts/1",{
    //   title: "1111-修改-11111",
    //   number: 0
    // })

    //删除 delete  除了删除对应的这一条数据，还会将相关联的数据一起删除掉
    // axios.delete("http://localhost:8000/posts/1")

    //表关联
    //_embed  向下关联  
    //在posts接口中的每一个对象下添加comments的数据，comments中存储着关联的关系，
    //两者之间的关系是通过posts下的对象id属性和comments下的对象postId属性相匹配确定的
    // axios.get("http://localhost:8000/posts?_embed=comments").then(res => {
    //   console.log(res.data);
    // })

    //_expand 向上关联
    //在comments接口中的每一个对象下添加post的数据，post中存储着关联的关系，
    //两者之间的关系是通过posts下的对象id属性和comments下的对象postId属性相匹配确定的
    //虽然是关联posts这个接口，但是_expand=post还是要这么写，不能加s，固定要求
    // axios.get("http://localhost:8000/comments?_expand=post").then(res => {
    //   console.log(res.data);
    // })

  }
  return (
    <div>
        <Button type="primary" onClick={ajax}>Button</Button>
    </div>
  );
}
