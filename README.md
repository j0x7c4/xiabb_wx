# Config
add following config to config/default.json

{
  "token": "",
  "port": 9130,
  "appId": "",
  "appSecret": "",
  "wxApiHost": "api.weixin.qq.com",
  "wxApiPort": 443,
  "mysql": {
    "host": "",
    "port": 3306,
    "database": "",
    "user": "",
    "password" : ""
  },
  "es": {
    "host": "",
    "port": ,
    "index": "blog_xiabb_post",
    "type": "post",
    "bulkSize": 1000,
    "log": "logs/es.log"
  },
  "menu" : {
    "button":
    [
      {
        "type": "click",
        "name": "开发指引",
        "key":  "mpGuide"
      },
      {
        "name": "公众平台",
        "sub_button":
        [
          {
            "type": "view",
            "name": "更新公告",
            "url": "http://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1418702138&token=&lang=zh_CN"
          },
          {
            "type": "view",
            "name": "接口权限说明",
            "url": "http://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1418702138&token=&lang=zh_CN"
          },
          {
            "type": "view",
            "name": "返回码说明",
            "url": "http://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1433747234&token=&lang=zh_CN"
          }
        ]
      },
      {
        "type": "media_id",
        "name": "旅行",
        "media_id": "z2zOokJvlzCXXNhSjF46gdx6rSghwX2xOD5GUV9nbX4"
      }
    ]
  }
}