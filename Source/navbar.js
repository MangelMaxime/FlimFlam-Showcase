import R from 'ramda'
import flyd from 'flyd'
import h from 'snabbdom/h'

const init = _ => {

}

const iconLinks = (icon, text) =>
  h('a.button', [
    h('span.icon', [
      h(`i.fa.${icon}`)
    ]),
    h('span', text)
  ])


const flimflamDocumentation = _ =>
  h('div.nav-right.nav-menu', [
    h('a.nav-item',
      {
        props:
        { href: 'https://flimflamjs.github.io/' }
      }, 'Documentation')
  ])


const centerNav = _ =>
  h('div.nav-center', [
    h('a.nav-item', [
      h('span.icon', [
        h('i.fa.fa-home')
      ])
    ])
  ])

const view = state =>
  h('nav.nav', [
    h('div.nav-left', [
      h('h1.nav-item.is-brand.title.is-4', "FLIMFLAM")
    ]),
    centerNav(),
    flimflamDocumentation(),
    h('span.nav-item', [
      iconLinks("fa-twitter", "Twitter"),
      iconLinks("fa-github", "Github")
    ])
  ])

module.exports = { init, view }
