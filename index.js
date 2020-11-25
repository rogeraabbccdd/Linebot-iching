require('dotenv').config()
const linebot = require('linebot')
const { handleNumbers, handleSearch, handleNumber } = require('./funcs.js')

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.listen('/', process.env.PORT)

bot.on('message', event => {
  if (event.message.type === 'text') {
    const message = event.message.text

    let reply = {}

    if (message === '幫助' || message === '教學' || message === '指令') {
      reply.type = 'text'
      reply.text =
        '歡迎使用易經機器人！\n' +
        '\n' +
        '機器人指令:\n' +
        '◆ 輸入三個數字，如 "111 222 333" ，進行數字卦占卜\n' +
        '◆ 輸入一個數字，如 "10" 依卦序查詢卦\n' +
        '◆ 輸入卦名或卦象名，如 "乾"，查詢卦象或卦\n' +
        '◆ 輸入 "指令"，查詢機器人指令\n' +
        '\n' +
        '相關連結:\n' +
        '◆ 易學網: https://www.eee-learning.com/\n' +
        '◆ 機器人原始碼: https://github.com/rogeraabbccdd/Linebot-iching\n'
    } else if (message.match(/\d{3}\s\d{3}\s\d{3}/g)) {
      // 數字卦
      reply = handleNumbers(message)
    } else if (message.match(/\d+/g)) {
      // 查第 N 卦
      const num = parseInt(message.match(/\d+/g)[0])
      if (num > 0 <= 64) {
        reply = handleNumber(num)
      }
    } else {
      // 查卦象、卦名
      reply = handleSearch(message)
    }

    event.reply(reply)
  }
})
