import Enum from 'es6-enum'
import { PageEnum } from './const'
import R from 'ramda'
import about from './pages/about'
import flyd from 'flyd'
import h from 'snabbdom/h'
import home from './pages/home'
import menu from './menu'
import navbar from './navbar'
import render from 'ff-core/render'
import sClass from 'snabbdom/modules/class'
import sEventlisteners from 'snabbdom/modules/eventlisteners'
import sProps from 'snabbdom/modules/props'
import sStyle from 'snabbdom/modules/style'
import snabbdom from 'snabbdom'

const init = startPage => {

  const navbar$ = navbar.init()
  const menu$ = menu.init(startPage)
  const activePage$ = flyd.scan((oldPage, newPage) => {
    return newPage;
  }, startPage, menu$.ActiveMenu)

  return {
    navbar$, menu$, activePage$
  }
}

const chooseActivePage = state => {
  if (state.activePage$() === PageEnum.Home) {
    return home.view()
  } else if (state.activePage$() === PageEnum.About) {
    return about.view()
  } else {
    // No page defined yet
    console.log(`${state.activePage$().toString()} is unknown.`)
    return h('div', '404')
  }
}

const view = state =>
  h('div', [
    h('div.container', [
      navbar.view(state.navbar$),
    ]),
    h('section.hero.is-primary.body-header', [
      h('div.hero-body', [
        h('div.container', [
          h('div.columns.is-vcentered', [
            h('div.column', [
              h('p.title', 'Documentation'),
              h('p.subtitle', {
                props: {
                  innerHTML: 'Everything you need to create a website using <strong>FlimFlamJS</strong> pattern.'
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
          menu.view(state.menu$)
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
