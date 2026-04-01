# sb6657-bot

A Koishi-based QQ bot plugin for sb6657.cn

## 本地运行方法

### 1. 运行项目并打包

需要node24版本

`pnpm i`下载依赖，随后`pnpm build`打包

### 2. 安装至koishi

在你自己的koishi根目录下，`external`文件夹内（如果没有的话自己新建一个），建立`sb6657-bot`文件夹

然后把项目里打包出来的dist文件夹，以及`package.json`文件都丢进去

随后在你自己koishi根目录的终端里，输入`yarn add ./external/sb6657-bot` 本地安装上这个插件

最后找到你自己koishi项目的`koishi.yml` 文件，在 `plugins:`层级的下面加上`sb6657-bot: {}`直接硬启用插件

重启项目（比如说你是docker就重启镜像）

### 3. 启用插件

在koishi web管理端插件配置里，找到sb6657-bot插件，配置启用即可。

此处可配置两次指令的冷却间隔，以及一天能使用的次数
