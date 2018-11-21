export default [
  {
    //  name 为客户端名称，对应 vue-apollo 的 'client' 参数
    name: APP_NAME,
    // Graphql Server 绝对地址
    uri: PROJECTS_API
  },
  {
    // 文件上传客户端
    name: `${APP_NAME}-upload`,
    uri: PROJECTS_API,
    upload: true
  }
]
