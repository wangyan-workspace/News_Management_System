import React, { useState } from 'react';
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsEditor(props) {
    const [editorState, setEditorState] = useState("");
    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState) => setEditorState(editorState)}

                onBlur={() => {
                    // 通过编辑状态获取编辑区的内容，将编辑区的内容转换为HTML的代码结构
                    // draftToHtml(convertToRaw(editorState.getCurrentContent()))
                    //调用父组件传递的函数将编译器中的数据传递给父组件
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                }}
            />
        </div>
    )
}