import NewsPublish from "../../components/publishManage/NewsPublish";
import usePublish from "../../components/publishManage/usePublish";
import { Button } from 'antd';

export default function Published() {
    // 2=== 已发布的
    const { dataSource, handleSunset } = usePublish(2);

    return (
        <div>
            <NewsPublish
                dataSource={dataSource}
                button={(id) => <Button
                    danger
                    onClick={() => handleSunset(id)}
                >下线</Button>}
            />

        </div>
    )
}