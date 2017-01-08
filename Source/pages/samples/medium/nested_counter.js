import R from 'ramda'
import counter from './../simple/counter'
import flyd from 'flyd'
import h from 'snabbdom/h'

const init = _ => {
  const counters$ = flyd.stream([])
  const nextId$ = flyd.stream(0)

  const deleteCounter = id => {
    const newValue = R.filter(current => {
      return id !== current.id
    }, counters$())
    counters$(newValue)
  }

  const addCounter = _ => {
    counters$(R.append(
      {
        id: nextId$()
        , counterState: counter.init()
      }
      , counters$())
    )
    // Increment nextId value
    nextId$(nextId$() + 1)
  }

  flyd.on(test => console.log(test), counters$)

  const resetAll = _ => {
    R.map(current => current.counterState.reset(), counters$())
  }

  return { counters$, deleteCounter, addCounter, resetAll }
}

const simpleButton = (text, onClick) =>
  h('a.button', { on: { click: onClick } }, text)

const counterRow = (deleteFn, data) => {
  const { id, counterState } = data
  return h('div.columns', [
    h('div.column.is-narrow', [
      h('div.button.is-danger',
      {
        on: {
          click: _ => deleteFn(id)
        }
      }, [
        h('i.fa.fa-trash')
      ])
    ]),
    counter.view(counterState)
  ])
}

const view = state => {
  return h('div',
    R.prepend(
      h('div.columns', [
        simpleButton("Add a new counter", state.addCounter),
        simpleButton("Reset all the counters", state.resetAll)
      ])
      ,
      R.map(current => counterRow(state.deleteCounter, current), state.counters$())
    )
  )
}

module.exports = { init, view }
