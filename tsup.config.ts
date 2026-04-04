import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'], // 入口文件
    format: ['cjs'], // Koishi 原生推荐 CommonJS 格式
    dts: true, // 自动生成 .d.ts 类型声明文件
    clean: true, // 每次打包前清空 dist 目录
    external: ['koishi'], // 外部依赖
    minify: true, // 打包产物压缩
});
