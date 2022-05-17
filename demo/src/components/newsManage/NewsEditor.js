import React, { useEffect, useState, Component } from 'react';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export const myBlockRenderer = (contentBlock) => {
    const type = contentBlock.getType();

    // 图片类型转换为mediaComponent
    if (type === 'atomic') {
        return {
            component: Media,
            editable: false,
            props: {
                foo: 'bar',
            },
        };
    }
};

class Media extends Component {
	render() {
		const { block, contentState } = this.props;
		const data = contentState.getEntity(block.getEntityAt(0)).getData();
		const emptyHtml = ' ';
		return (
			<div>
				{emptyHtml}
				<img
					src={data.src}
					alt={data.alt || ''}
					style={{ height: data.height || 'auto', width: data.width || 'auto' }}
				/>
			</div>
		);
	}
}


export default function NewsEditor(props) {
    const [editorState, setEditorState] = useState("");
    //用户更新数据时
    useEffect(() => {
        //html ===> draft
        const html = props.content;
        if (html === undefined) return;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)
        }
    }, [props.content])
    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState) => setEditorState(editorState)}
                customBlockRenderFunc={myBlockRenderer}
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