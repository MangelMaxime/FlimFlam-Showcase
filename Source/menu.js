import Enum from 'es6-enum'
import { PageEnum } from './const'
import R from 'ramda'
import flyd from 'flyd'
import h from 'snabbdom/h'

const MenuState = Enum("Open", "Closed")

const init = startPage => {
  const ActiveMenu = flyd.stream(startPage)
  const ChangeMenu = menu => ActiveMenu(menu)

  const SimpleMenuState = flyd.stream(MenuState.Closed)
  const ChangeSimpleMenuState = newState => SimpleMenuState(newState)

  const MediumMenuState = flyd.stream(MenuState.Closed)
  const ChangeMediumMenuState = newState => MediumMenuState(newState)

  const ToggleMenuState = menuType => {
    if (menuType === PageEnum.Simple) {
      InternalToggleMenuState(SimpleMenuState, ChangeSimpleMenuState)
    } else if (menuType === PageEnum.Medium) {
      InternalToggleMenuState(MediumMenuState, ChangeMediumMenuState)
    } else {
      console.log(`${menuType} can't be fold.`)
    }
  }

  const GetMenuState = menuType => {
    if (menuType === PageEnum.Simple) {
      return SimpleMenuState()
    } else if (menuType === PageEnum.Medium) {
      return MediumMenuState()
    } else {
      console.log(`Can't resolve state for ${menuType}.`)
    }
  }

  const InternalToggleMenuState = (menuAccess, menuChange) => {
    if (menuAccess() === MenuState.Open)
      menuChange(MenuState.Closed)
    else
      menuChange(MenuState.Open)
  }

  return { ActiveMenu, ChangeMenu, SimpleMenuState, ChangeSimpleMenuState, MediumMenuState, ChangeMediumMenuState, ToggleMenuState, GetMenuState }
}

const menuLabel = (state, name) => h('p.menu-label', name)

const menuList = (state, menus) => {
  const isActive = menuType => state.ActiveMenu() === menuType ? 'is-active' : ''

  return h('ul.menu-list',
    R.map(menu => {
      const { label, menuType} = menu
      return h('li', [
        h(`a.${isActive(menuType)}`, {
          on: {
            click: _ => state.ChangeMenu(menuType)
          }
        }, label)
      ])

    }, menus)
  )
}

const subMenus = (state, label, menuType, menus) => {
  const isActive = menuType => state.ActiveMenu() === menuType ? 'is-active' : ''
  const subMenuState = state.GetMenuState(menuType) === MenuState.Open ? '' : 'is-hidden'

  return h('ul.menu-list', [
    h('li', [
      h(`a`,
        {
          on: {
            click: _ => {
              state.ToggleMenuState(menuType)
            }
          }
        }
        , label),
      h(`ul.${subMenuState}`,
        R.map(menu => {
          const { label, type } = menu
          return h('li', [
            h(`a.${isActive(type)}`,
              {
                on: {
                  click: _ => state.ChangeMenu(type)
                }
              },
              label)
          ])
        }
          , menus
        )
      )
    ])
  ])
}

const view = state => {
  return h('aside.menu', [
    menuLabel(state, 'General'),
    menuList(
      state,
      [
        {
          label: 'Home',
          menuType: PageEnum.Home
        },
        {
          label: 'About',
          menuType: PageEnum.About
        }
      ]
    ),
    menuLabel(state, 'Examples'),
    subMenus(
      state,
      'Simple',
      PageEnum.Simple,
      [
        {
          label: 'Counter',
          type: PageEnum.Counter
        },
        {
          label: 'Clock',
          type: PageEnum.Clock
        }
      ]
    ),
    subMenus(
      state,
      'Medium',
      PageEnum.Medium,
      [
        {
          label: 'Nested counter',
          type: PageEnum.NestedCounter
        }

      ]
    )
  ])
}

module.exports = { init, view }
