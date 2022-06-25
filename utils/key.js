module.exports = {
  getKeys: function (details) {
    // details数组有多项，每一项为一个检测类别，details.label为类别
    console.log(details)
    let key = []
    let label = []
    return new Promise((resolve) => {
      details.forEach((item) => {
        // 缓存类别
        label.push(switchLabel(item.label))
        // 缓存关键词
        if (item.contexts) {
          item.contexts.forEach((ctx) => {
            key.push(ctx.context)
          })
        }
      })
      resolve({ key, label })
    })
  },
}
const switchLabel = (v) => {
  switch (v) {
    case 'politics':
      return '政治'
      break;
    case 'porn':
      return '色情'
      break;
    case 'spam':
      return '垃圾信息'
      break;
    case 'ad':
      return '广告'
      break;
    case 'terrorism':
      return '暴恐'
      break;
    case 'abuse':
      return '辱骂'
      break;
    case 'flood':
      return '灌水'
      break;
    case 'abuse':
      return '辱骂'
      break;
    case 'contraband':
      return '违禁词'
      break;
    case 'customized':
      return '易错词'
      break;
    default:
      break;
  }
}
