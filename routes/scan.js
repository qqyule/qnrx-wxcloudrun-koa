const router = require("koa-router")();
router.prefix('/v1')
// 生成id插件
var { v1: uuidV1 } = require('uuid')
const { accessKeyId, accessKeySecret } = process.env;

// 阿里云文本检测sdk
var greenNodejs = require('../utils/green-nodejs-invoker.js')
const { getKeys } = require('../utils/key.js')

const greenVersion = '2017-01-12'
let hostname = 'green.cn-hangzhou.aliyuncs.com'
let path = '/green/text/scan'

let clientInfo = {
  ip: '127.0.0.1',
}

router.post('/scanText', async (ctx) => {
  ctx.set('Content-Type', 'application/json')

  const { content } = ctx.request.body

  const scanRes = await query(content)
  if (Object.prototype.toString.call(scanRes) != '[object Object]') {
    ctx.body = {
      code: 300,
      msg: '返回格式错误',
    }
  } else {
    try {
      const res = await find(scanRes.data)
      res['copyright'] = '黔南热线'
      res['version'] = '1.0'
      ctx.body = res
    } catch (error) {
      let res = {
        error
      }
      res['copyright'] = '黔南热线'
      res['version'] = '1.0'
      ctx.body = res
    }


  }
})

// 文本结果筛选
async function find(scanRes) {
  let results = {}
  if (scanRes.length > 0) {
    results = scanRes[0].results[0]
    console.log(results)
  }
  let result = {}

  let code, msg

  // 检测通过
  if (results.suggestion === 'pass') {
    result = {
      code: 200,
      msg: '内容验证通过',
    }
  } else if (
    results.suggestion === 'block' ||
    results.suggestion === 'review'
  ) {
    const { key, label } = await getKeys(results.details)
    // 涉政
    if (results.label === 'politics') {
      code = 201
      msg = '内容涉政'
    }
    // 含垃圾信息
    if (results.label === 'spam') {
      code = 203
      msg = '含垃圾信息'
    }
    // 暴恐
    if (results.label === 'terrorism') {
      code = 204
      msg = '含暴恐信息'
    }
    // 辱骂
    if (results.label === 'abuse') {
      code = 205
      msg = '含辱骂信息'
    }
    // 色情
    if (results.label === 'porn') {
      code = 206
      msg = '含色情信息'
    }
    // 广告
    if (results.label === 'ad') {
      code = 207
      msg = '含广告信息'
    }
    // 灌水
    if (results.label === 'flood') {
      code = 203
      msg = '含灌水信息'
    }
    // 违禁
    if (results.label === 'contraband') {
      code = 208
      msg = '含违禁信息'
    }
    // 自定义关键词
    if (results.label === 'customized') {
      code = 209
      msg = '含易错词'
    }
    result = {
      code,
      msg,
      key,
      label,
    }
  }

  return new Promise((resolve) => {
    resolve(result)
  })
}

// 请求接口
async function query(content) {
  let requestBody = JSON.stringify({
    bizType: 'qnrx',
    scenes: ['antispam'],
    tasks: [
      {
        dataId: uuidV1(),
        content: content,
      },
    ],
  })

  let bizCfg = {
    accessKeyId: accessKeyId,
    accessKeySecret: accessKeySecret,
    path: path,
    clientInfo: clientInfo,
    requestBody: requestBody,
    hostname: hostname,
    greenVersion: greenVersion,
  }

  return new Promise((resolve, reject) => {
    greenNodejs(bizCfg).then((res) => {
      resolve(res)
    })
  })
}


module.exports = router;
