# API Data Mock

## API 地址前缀

1.  `fbi/options.js`

    1. 在 `server.mock.prefix` 配置 Mock 服务前缀

    1. 在 `data.all.__SITE_TITLE__` 配置代码里使用的前缀别名(应
       与`server.mock.prefix`配置相同的值)

1.  `src/utils/ajax.js L5` 使用了`__SITE_TITLE__`这个别名

## 随机数据

```json
// 表名 required
"name": "users",

// 数据结构 required
// 随机数据生成语法参考: https://github.com/Marak/faker.js#api-methods
"schema": {
  "id": "{{random.uuid}}",
  "username": "{{internet.userName}}",
  ...
},

// 生成的数据条数 optional
"number": 100
```

`fbi s` 后可通过 http://localhost:8888/mock-api/users 访问

## 固定数据 (待实现)

直接在 `mock/db` 中新增 json 文件即可

如：`test.json`

```json
{
  "test": [
    {
      "name": "test"
    }
  ]
}
```

`fbi s` 后可通过 http://localhost:8888/mock-api/test 访问
