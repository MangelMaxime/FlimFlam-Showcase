import R from 'ramda'
import flyd from 'flyd'
import h from 'snabbdom/h'

const init = _ => {
  /**
   * Counter current value
   * @return {Stream}
   */
  const value$ = flyd.stream(0)

  /**
   * Reset the counter value to 0
   */
  const reset = _ =>
    value$(0)

  /**
   * Add 1 to the counter value
   */
  const add = _ => {
    console.log("counter add");
    value$(value$() + 1);
  }

  /**
   * Substract 1 to the counter value
   */
  const sub = (_) =>
    value$(value$() - 1)

  return { value$, reset, add, sub }
}

/**
 * Return a simple button
 * @param {string} text Text to display in the button
 * @param {any} onClick Callback executed on click event
 * @return {VNode}
 */
const simpleButton = (text, onClick) =>
  h('div.column.is-narrow', [
    h('a.button', { on: { click: onClick } }, text)
  ])

const view = state => {
  return h('div.columns.is-vcentered', [
    h('div.column.is-narrow', { style: { width: '170px' } }, `Counter value: ${state.value$()}`),  // Inline style to force a space between the value and the actions
    simpleButton("+1", state.add),
    simpleButton("-1", state.sub),
    simpleButton("Reset", state.reset)
  ])
}

module.exports = { init, view }
