const router = require("koa-router")();
const { Counter } = require("../db");

router.get("/ping", async (ctx, next) => {
  ctx.body = 'Tencent CloudBase + Koa'
});

router.post("/api/count", async (ctx) => {
  await Counter.create();

  ctx.body = {
    code: 0,
    data: await Counter.count(),
  };
});

module.exports = router;