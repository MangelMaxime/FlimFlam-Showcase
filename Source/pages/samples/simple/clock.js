import R from 'ramda'
import flyd from 'flyd'
import flyd_every from 'flyd/module/every'
import h from 'snabbdom/h'
import moment from 'moment'

const init = _ => {
  const every_second$ = flyd_every(1000)

  const currentDate$ = flyd.stream()

  flyd.on((date) => {
    currentDate$(date)
  }, every_second$)

  return { currentDate$ }
}

const view = state => {
  return h('div.columns', [
    h('div.column', [
      h('div.content.is-medium.has-text-centered', [
        h('h2', moment().format('dddd, MMMM Do YYYY, h:mm:ss A'))
      ])
    ])
  ])
}

module.exports = { init, view }
