const Koa = require("koa");
const logger = require("koa-logger");
const bodyParser = require("koa-bodyparser");
const { init: initDB } = require("./db");
const cors = require('koa2-cors')
const index = require('./routes/index')
const scan = require('./routes/scan')
const app = new Koa();
app
  .use(logger())
  .use(bodyParser())

//配置 cors 的中间件 
app.use(
  cors({
    origin: function (ctx) { //设置允许来自指定域名请求
      const whiteList = ['http://sites.qnz.com.cn', 'https://sites.qnz.com.cn', 'http://cms.qnz.com.cn', 'http://localhost:8000']; //可跨域白名单

      let url
      if (ctx.header.referer) {
        url = ctx.header?.referer.substr(0, ctx.header.referer.length - 1);
        console.log(url)
      }
      if (whiteList.includes(url)) {
        return url // 注意，这里域名末尾不能带/，否则不成功，所以在之前我把/通过substr干掉了
      }
      return 'http://localhost:8000'; //只允许http://localhost:8080这个域名的请求
    },
    maxAge: 5, //指定本次预检请求的有效期，单位为秒。
    credentials: true, //是否允许发送Cookie
    allowMethods: ['GET', 'POST', 'OPTIONS'], //设置所允许的HTTP请求方法
  })
)

app.use(index.routes(), index.allowedMethods())
app.use(scan.routes(), scan.allowedMethods())
const port = process.env.PORT || 80;
async function bootstrap() {
  // await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}
bootstrap();
