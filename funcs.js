const data = require('./assets/data.json')
const flexGua = require('./assets/flex/gua.json')
const flexHexagram = require('./assets/flex/hexagram.json')
const flexTrigram = require('./assets/flex/trigram.json')
const klona = require('klona/json').klona

const handleNumber = (number) => {
  const reply = {
    type: 'flex',
    altText: '查詢結果',
    contents: {
      type: 'carousel',
      contents: []
    }
  }

  // find gua
  const hexagram = data.hexagrams.find(hexagram => {
    return hexagram.number === number
  })

  const flex = klona(flexHexagram)

  flex.body.contents[0].text = hexagram.name + '卦'
  flex.body.contents[1].text = hexagram.text

  for (const text of hexagram.description.wenyan) {
    flex.body.contents[3].contents[0].contents.push({
      type: 'text',
      text: text,
      size: 'sm',
      color: '#111111',
      wrap: true
    })
  }

  for (const text of hexagram.description.text) {
    flex.body.contents[3].contents[1].contents.push({
      type: 'text',
      text: text,
      size: 'sm',
      color: '#111111',
      wrap: true
    })
  }

  flex.footer.contents[0].action.uri += hexagram.number

  reply.contents.contents.push(flex)

  return reply
}

const handleNumbers = (message) => {
  let reply = {}
  const numbers = message.split(' ')
  const bottom = numbers[0] % 8 === 0 ? 8 : numbers[0] % 8
  const top = numbers[1] % 8 === 0 ? 8 : numbers[1] % 8
  const change = numbers[2] % 6 === 0 ? 6 : numbers[2] % 6

  // find gua
  const gua = data.hexagrams.find(hex => {
    return hex.topTrigram === top && hex.bottomTrigram === bottom
  })

  if (gua) {
    const yao = gua.yao[change - 1]
    const bottomGua = data.trigrams.find(trigram => {
      return trigram.number === bottom
    })
    const topGua = data.trigrams.find(trigram => {
      return trigram.number === top
    })

    reply = klona(flexGua)

    reply.altText = '卜卦結果'
    reply.contents.contents[0].body.contents[1].text = gua.name + '卦'
    reply.contents.contents[0].body.contents[2].text = `上卦為${topGua.name}(${topGua.nature})，下卦為${bottomGua.name}(${bottomGua.nature})，變爻為 ${change}`

    reply.contents.contents[0].body.contents[4].contents[1].text = gua.text

    for (const text of gua.description.wenyan) {
      reply.contents.contents[0].body.contents[4].contents[2].contents.push({
        type: 'text',
        text: text,
        size: 'sm',
        color: '#111111',
        wrap: true
      })
    }

    for (const text of gua.description.text) {
      reply.contents.contents[0].body.contents[4].contents[3].contents.push({
        type: 'text',
        text: text,
        size: 'sm',
        color: '#111111',
        align: 'start',
        wrap: true
      })
    }

    reply.contents.contents[0].body.contents[5].contents[1].text = yao.name + '，' + yao.text

    for (const text of yao.description.wenyan) {
      reply.contents.contents[0].body.contents[5].contents[2].contents.push({
        type: 'text',
        text: text,
        size: 'sm',
        color: '#111111',
        wrap: true
      })
    }

    for (const text of yao.description.text) {
      reply.contents.contents[0].body.contents[5].contents[3].contents.push({
        type: 'text',
        text: text,
        size: 'sm',
        color: '#111111',
        align: 'start',
        wrap: true
      })
    }

    const num = gua.number < 10 ? '0' + gua.number : gua.number
    reply.contents.contents[0].footer.contents[0].action.uri += num
  } else {
    reply = { type: 'text', text: '發生錯誤' }
  }

  return reply
}

const handleSearch = (message) => {
  const reply = {
    type: 'flex',
    altText: '查詢結果',
    contents: {
      type: 'carousel',
      contents: []
    }
  }

  const trigram = data.trigrams.find(trigram => {
    return trigram.name === message || (message.includes(trigram.name) && message.includes('卦')) || (message.includes(trigram.name) && message.includes('卦象'))
  })

  const hexagram = data.hexagrams.find(hexagram => {
    return hexagram.name === message || (message.includes(hexagram.name) && message.includes('卦'))
  })

  if (trigram) {
    const flex = klona(flexTrigram)

    flex.body.contents[0].text = trigram.name
    flex.body.contents[2].contents[1].text = trigram.character
    flex.body.contents[3].contents[1].text = trigram.nature
    flex.body.contents[4].contents[1].text = trigram.temperament
    flex.body.contents[5].contents[1].text = trigram.family
    flex.body.contents[6].contents[1].text = trigram.season
    flex.body.contents[7].contents[1].text = trigram.position
    flex.body.contents[8].contents[1].text = trigram.society.join('，')
    flex.body.contents[9].contents[1].text = trigram.body
    flex.body.contents[10].contents[1].text = trigram.element
    flex.body.contents[11].contents[1].text = trigram.animal

    reply.contents.contents.push(flex)
  }

  if (hexagram) {
    const flex = klona(flexHexagram)

    flex.body.contents[0].text = hexagram.name + '卦'
    flex.body.contents[1].text = hexagram.text

    for (const text of hexagram.description.wenyan) {
      flex.body.contents[3].contents[0].contents.push({
        type: 'text',
        text: text,
        size: 'sm',
        color: '#111111',
        wrap: true
      })
    }

    for (const text of hexagram.description.text) {
      flex.body.contents[3].contents[1].contents.push({
        type: 'text',
        text: text,
        size: 'sm',
        color: '#111111',
        wrap: true
      })
    }

    flex.footer.contents[0].action.uri += hexagram.number

    reply.contents.contents.push(flex)
  }

  return reply
}

module.exports = {
  handleNumber,
  handleNumbers,
  handleSearch
}
