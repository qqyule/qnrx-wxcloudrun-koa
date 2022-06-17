const router = require("koa-router")();
// const { init: initDB, Counter } = require("./db");

router.get("/ping", async (ctx, next) => {
  ctx.body = 'Tencent CloudBase + Koa'
});

// router.post("/api/count", async (ctx) => {
//   const { request } = ctx;
//   const { action } = request.body;
//   if (action === "inc") {
//     await Counter.create();
//   } else if (action === "clear") {
//     await Counter.destroy({
//       truncate: true,
//     });
//   }

//   ctx.body = {
//     code: 0,
//     data: await Counter.count(),
//   };
// });

module.exports = router;