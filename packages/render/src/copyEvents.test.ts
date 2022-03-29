import '@alchemic/html'
import html from '@alchemic/html'

import copyEvents from './copyEvents'

describe('copyEvents', () => {
  it('Should copy events from the update node to the existing node.', () => {
    const clickHandler = jest.fn()
    const update = html`<button onclick=${clickHandler}>click me</button>`
    const existing = html`<button>click me</button>`

    copyEvents(update, existing)

    existing.click()

    expect(clickHandler).toBeCalledTimes(1)
  })

  it('Should remove events from the existing node that are not on the update node.', () => {
    const clickHandler = jest.fn()
    const update = html`<button>click me</button>`
    const existing = html`<button onclick=${clickHandler}>click me</button>`

    copyEvents(update, existing)

    existing.click()

    expect(clickHandler).toBeCalledTimes(0)
  })
})
