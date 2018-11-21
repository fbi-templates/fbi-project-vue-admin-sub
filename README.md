# fbi-project-vue-admin-sub

Template of subsystem for vue-admin

该模板专为管理系统子系统设计，适合接入已存在系统的场景。

支持 GraphQL API 和 RESTFul API

## 依赖

- [fbi](https://github.com/AlloyTeam/fbi) `v3.2+`
- [node](https://nodejs.org/en/) `v8.2+`

## 说明

### 初始化项目

```bash
fbi init vue-admin-sub -o
```

### 配置

**appName**: `fbi/options.js` L12

**publicPath**: `fbi/options.js` L27

### 全局对象

**`$ajax`**

**`$vrm`**

**`$apollo`**

**`$appName`**

1. 路由 name 必须加上 `APP_NAME` 前缀, 参考: `src/routes.js`
1. 路由跳转使用 name, 且加上前缀, 参考: `src/views/list.vue` L23
1. 组件中获取 `appName`, `this.$appName`, 参考：`src/views/list.vue` L23

## 基础用法请参考 [README](https://github.com/fbi-templates/fbi-project-vue-admin/blob/master/README.md)
