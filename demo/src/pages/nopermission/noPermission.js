import React from 'react';
import NotFound404 from './../../img/404.gif'
export default function NoPermission() {
  return (
    <div>
      <div style={{ color: "orange", fontSize: "28px" }}>页面找不到了！！！</div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <img src={NotFound404} style={{width:"700px"}}/>
      </div>
    </div>
  );
}
