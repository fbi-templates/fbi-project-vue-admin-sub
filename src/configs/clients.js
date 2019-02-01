export default [
  {
    //  name 为客户端名称，对应 vue-apollo 的 'client' 参数
    name: APP_NAME,
    // Graphql Server 绝对地址
    uri: GRAPHQL_ENDPOINT
  },
  {
    // 文件上传客户端
    name: `${APP_NAME}-upload`,
    uri: GRAPHQL_ENDPOINT,
    upload: true
  }
]
