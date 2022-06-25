const Koa = require("koa");
const logger = require("koa-logger");
const bodyParser = require("koa-bodyparser");
const { init: initDB } = require("./db");

const index = require('./routes/index')
const scan = require('./routes/scan')
const app = new Koa();
app
  .use(logger())
  .use(bodyParser())

app.use(index.routes(), index.allowedMethods())
app.use(scan.routes(), scan.allowedMethods())
const port = process.env.PORT || 80;
async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}
bootstrap();
