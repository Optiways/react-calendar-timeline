import faker from 'faker'
import randomColor from 'randomcolor'
import moment from 'moment'

export default function (groupCount = 30, itemCount = 1000, daysInPast = 30) {
  let randomSeed = Math.floor(Math.random() * 1000)
  let groups = []
  for (let i = 0; i < groupCount; i++) {
    groups.push({
      id: `${i + 1}`,
      title: faker.name.firstName(),
      rightTitle: faker.name.lastName(),
      label: `Label ${faker.name.firstName()}`,
      bgColor: randomColor({ luminosity: 'light', seed: randomSeed + i }),
      shouldStackEnforceOrder: true
    })
  }

  let items = []
  for (let i = 0; i < itemCount; i++) {
    const startDate = new Date().valueOf() + i*1000*60*60 + (daysInPast * 0.3) * 86400 * 1000
    const startValue = Math.floor(moment(startDate).valueOf() / 10000000) * 10000000
    const endValue = moment(startDate + (i%3===0 ? 60 : 10) * 15 * 60 * 1000).valueOf()

    items.push({
      id: i + '',
      group: i < itemCount/2 ? 1 : 2 + '',
      title: '' + i,
      start: startValue,
      end: endValue,
      canMove: i % 3 !== 0,
      canResize: false,
      className: (moment(startDate).day() === 6 || moment(startDate).day() === 0) ? 'item-weekend' : '',
      bgColor: randomColor({ luminosity: 'light', seed: randomSeed + i, format:'rgba', alpha:0.6 }),
      selectedBgColor: randomColor({ luminosity: 'light', seed: randomSeed + i, format:'rgba', alpha:1 }),
      color: randomColor({ luminosity: 'dark', seed: randomSeed + i }),
      itemProps: {
        'data-tip': faker.hacker.phrase(),
      },
      isMaster: i % 3 === 0
    })
  }

  items = items.sort((a, b) => b - a)

  return { groups, items }
}
