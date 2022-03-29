import html from '@alchemic/html'
import updateOption from './updateOption'

describe('updateOption', () => {
  it('Should update the selected attribute of option inputs.', () => {
    const update = html`<option value="a" selected/>` as HTMLOptionElement
    const existing = html`<option value="1" />` as HTMLOptionElement

    updateOption(update, existing)

    expect(existing.hasAttribute('selected')).toBe(true)
  })
})
