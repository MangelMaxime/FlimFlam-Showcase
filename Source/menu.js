import Enum from 'es6-enum'
import R from 'ramda'
import flyd from 'flyd'
import h from 'snabbdom/h'

const MenuType = Enum("Home", "About", "Simple", "Counter", "Clock", "Medium", "NestedCounter")

const MenuState = Enum("Open", "Closed")

const init = _ => {
  const ActiveMenu = flyd.stream(MenuType.Home)
  const ChangeMenu = menu => ActiveMenu(menu)

  const SimpleMenuState = flyd.stream(MenuState.Closed)
  const ChangeSimpleMenuState = newState => SimpleMenuState(newState)

  const MediumMenuState = flyd.stream(MenuState.Closed)
  const ChangeMediumMenuState = newState => MediumMenuState(newState)

  const ToggleMenuState = menuType => {
    if (menuType === MenuType.Simple) {
      InternalToggleMenuState(SimpleMenuState, ChangeSimpleMenuState)
    } else if (menuType === MenuType.Medium) {
      InternalToggleMenuState(MediumMenuState, ChangeMediumMenuState)
    } else {
      console.log(`${menuType} can't be fold.`)
    }
  }

  const GetMenuState = menuType => {
    if (menuType === MenuType.Simple) {
      return SimpleMenuState()
    } else if (menuType === MenuType.Medium) {
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
      h(`a.${isActive(menuType)}`,
        {
          on: {
            click: _ => {
              state.ChangeMenu(menuType)
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
          menuType: MenuType.Home
        },
        {
          label: 'About',
          menuType: MenuType.About
        }
      ]
    ),
    menuLabel(state, 'Examples'),
    subMenus(
      state,
      'Simple',
      MenuType.Simple,
      [
        {
          label: 'Counter',
          type: MenuType.Counter
        },
        {
          label: 'Clock',
          type: MenuType.Clock
        }
      ]
    ),
    subMenus(
      state,
      'Medium',
      MenuType.Medium,
      [
        {
          label: 'Nested counter',
          type: MenuType.NestedCounter
        }

      ]
    )
  ])
}

module.exports = { init, view }
