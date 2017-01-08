import Enum from 'es6-enum'
import { PageEnum } from './const'
import R from 'ramda'
import about from './pages/about'
import clock from './pages/samples/simple/clock'
import counter from './pages/samples/simple/counter'
import flyd from 'flyd'
import h from 'snabbdom/h'
import home from './pages/home'
import menu from './menu'
import navbar from './navbar'
import nestedCounter from './pages/samples/medium/nested_counter'
import render from 'ff-core/render'
import sClass from 'snabbdom/modules/class'
import sEventlisteners from 'snabbdom/modules/eventlisteners'
import sProps from 'snabbdom/modules/props'
import sStyle from 'snabbdom/modules/style'
import snabbdom from 'snabbdom'

const init = startPage => {

  const navbarState = navbar.init()
  const menuState = menu.init(startPage)
  const counterState = counter.init()
  const nestedCounterState = nestedCounter.init()
  const clockState = 0 //clock.init()
  const activePage$ = flyd.stream(startPage)

  flyd.on((page) => {
    activePage$(page)
  }, menuState.ActiveMenu)

  flyd.on((page) => {
    activePage$(page)
    menuState.ActiveMenu(page)
  }, navbarState.changePage$)

  return {
    navbarState, menuState, activePage$, counterState, clockState, nestedCounterState
  }
}

const chooseActivePage = state => {

  switch (state.activePage$()) {
    case PageEnum.Home:
      return home.view()
    case PageEnum.About:
      return about.view()
    case PageEnum.Counter:
      return counter.view(state.counterState)
    case PageEnum.Clock:
      return clock.view(state.clockState)
    case PageEnum.NestedCounter:
      return nestedCounter.view(state.nestedCounterState)
    default:
      console.log(`${state.activePage$().toString()} is unknown.`)
      return h('div', '404')
  }
}

const view = state =>
  h('div', [
    h('div.container', [
      navbar.view(state.navbarState),
    ]),
    h('section.hero.is-primary.body-header', [
      h('div.hero-body', [
        h('div.container', [
          h('div.columns.is-vcentered', [
            h('div.column', [
              h('p.title', 'Showcase'),
              h('p.subtitle', {
                props: {
                  innerHTML: 'Just a simple experimentation around <strong>FlimFlamJS</strong> pattern.'
                }
              })
            ])
          ])
        ])
      ])
    ]),
    h('div.container', [
      h('div.columns', [
        h('div.column.is-3', [
          menu.view(state.menuState)
        ]),
        h('div.column', [
          chooseActivePage(state)
        ])
      ])
    ])
  ])

const patch = snabbdom.init([
  sClass, sProps, sStyle, sEventlisteners
])


document.addEventListener("DOMContentLoaded", ev => {
  render({ view, patch, container: document.body, state: init(PageEnum.Home) })
});
