import NewsPublish from "../../components/publishManage/NewsPublish";
import usePublish from "../../components/publishManage/usePublish";
import { Button } from 'antd';

export default function Sunset() {
    // 3=== 已下线的
    const { dataSource, handleDelete } = usePublish(3);

    return (
        <div>
            <NewsPublish
                dataSource={dataSource}
                button={(id) => <Button
                    onClick={() => handleDelete(id)}
                >删除</Button>}
            />
        </div>
    )
}