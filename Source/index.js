import R from 'ramda'
import flyd from 'flyd'
import h from 'snabbdom/h'
import menu from './menu'
import navbar from './navbar'
import render from 'ff-core/render'
import sClass from 'snabbdom/modules/class'
import sEventlisteners from 'snabbdom/modules/eventlisteners'
import sProps from 'snabbdom/modules/props'
import sStyle from 'snabbdom/modules/style'
import snabbdom from 'snabbdom'

const init = _ => {
  return {
    add$: flyd.stream(),
    reset$: flyd.stream(),
    navbar$: navbar.init(),
    menu$: menu.init()
  }
}

const view = state =>
  h('div.container', [
    navbar.view(state.navbar$),
    menu.view(state.menu$)
  ])

const patch = snabbdom.init([
  sClass, sProps, sStyle, sEventlisteners
])

render({ view, patch, container: document.body, state: init()})
