### 项目简介

此项目是基于 `React`、`antd-mobile` 、`ci`  开发的网页版流程设计器。

### 文件地址

仓库 地址: https://gitlab.jiahubao.net/wuzhenyu/h5-cloud-hospital.git

接口 文档: https://devapi.jiahubao.net/

React 地址: https://react.docschina.org/

React Router 地址: https://reactrouter.com/en/main

redux 地址: https://cn.redux.js.org

redux-toolkit 地址: https://cn.redux-toolkit.js.org

antd-mobile 地址: https://mobile.ant.design/zh

dayjs 地址: https://dayjs.fenxianglu.cn/

redux-persist 地址: https://github.com/rt2zz/redux-persist

原型 流程 https://lanhuapp.com/docs/#/d/d63ad58146be1b420e7806f05?s=0

产品 流程 https://lanhuapp.com/web/#/item/project/product?tid=20e9a80a-1d61-4602-a03c-755c8c8cac6d&pid=cb72576f-e567-4ec3-b442-d6766e8bc660&versionId=d9000c16-66e1-457a-b1b5-7b926be7d989&docId=b6ab6720-d8b4-4813-8458-fee85505562b&docType=axure&pageId=d2a50c937b3c40c6a9d4666783d82776&image_id=b6ab6720-d8b4-4813-8458-fee85505562b&parentId=848c92b0b4014dfdb7a081717c314581

UI 设计 https://lanhuapp.com/web/#/item/project/stage?tid=20e9a80a-1d61-4602-a03c-755c8c8cac6d&pid=cb72576f-e567-4ec3-b442-d6766e8bc660

进度 管控 no-body

### 代码管理

    主分支：master 为 主分支 每个版本 发布生产 从 master 构建

    测试分支：test 为 测试分支，每个版本 从 master 切出来。 发布测试环境，测试ok后推到 master

    开发分支：dev 为 开发分支， dev 每个版本 从 master 切出来。 这个分支不发布,需要提测的时候 推到 test分支

    开发分支： 每个人 从 master 切 自己的 分支 用自己的名字命名 如果是迭代的 名字后面 加 迭代版本号。完成当天的工作或者每个功能 推到dev开发分支，所有人都一样

### 注意事项

    文件夹 关系: pages api routes 里面的文件夹关系 尽量一一对应 pages 是用户的 staff 是工作端的 both 是用户和工作端 共有的

    项目内嵌 app 内: 有些全局的 api 是 安卓 和 ios 提供的 ，在 utils 里面封装一下

    备注: 多写备注 div 尽量写 start 和 end

    行内样式： postcss-px-to-viewport 无法处理行内样式 尽量用 classname 方式

    有别的注意细节 可以在这里补充

### 使用方式

`安装`: npm install 或者 yarn
`运行`: npm run dev 或者 yarn dev
