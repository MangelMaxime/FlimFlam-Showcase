import Enum from 'es6-enum'
import R from 'ramda'
import flyd from 'flyd'
import h from 'snabbdom/h'

const init = _ => {
}

const view = _ => {
  return h('span', "about page")
}

module.exports = { init, view }
