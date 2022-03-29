import html from '@alchemic/html'
import mutateNode from './mutateNode'

describe('mutateNode', () => {
  it('Should copy node attributes', () => {
    const update = html`<div class='test' aria-labelledby='test-elem'></div>`
    const existing = html`<div />`

    mutateNode(update, existing)

    expect(existing.outerHTML).toBe('<div aria-labelledby="test-elem" class="test"></div>')
  })

  it('Should mutate comment nodes.', () => {
    const update = document.createComment('updated comment')
    const existing = document.createComment('not updated comment')

    mutateNode(
      update as unknown as HTMLElement,
      existing as unknown as HTMLElement,
    )

    expect(existing.data).toBe('updated comment')
  })

  it('Should not mutate comment nodes that are the same.', () => {
    const update = document.createComment('updated comment')
    const existing = document.createComment('updated comment')

    mutateNode(
      update as unknown as HTMLElement,
      existing as unknown as HTMLElement,
    )

    expect(existing.data).toBe('updated comment')
  })

  it('Should mutate text nodes.', () => {
    const update = document.createTextNode('updated')
    const existing = document.createTextNode('not updated')

    mutateNode(
      update as unknown as HTMLElement,
      existing as unknown as HTMLElement,
    )

    expect(existing.data).toBe('updated')
  })

  it('Should not mutate text nodes that are the same.', () => {
    const update = document.createTextNode('updated')
    const existing = document.createTextNode('updated')

    mutateNode(
      update as unknown as HTMLElement,
      existing as unknown as HTMLElement,
    )

    expect(existing.data).toBe('updated')
  })

  it('Should mutate input nodes.', () => {
    const update = html`<input value="updated" />`
    const existing = html`<input value="not updated" />`

    mutateNode(update, existing)

    expect(existing.outerHTML).toBe('<input value="updated">')
  })

  it('Should mutate option nodes.', () => {
    const update = html`<option value="updated" />`
    const existing = html`<option value="not updated" />`

    mutateNode(update, existing)

    expect(existing.outerHTML).toBe('<option value="updated"></option>')
  })

  it('Should text area nodes.', () => {
    const update = html`<textarea>updated</textarea>`
    const existing = html`<textarea>not updated</textarea>`

    mutateNode(update, existing)

    expect(existing.outerHTML).toBe('<textarea>updated</textarea>')
  })

  it('Should copy events.', () => {
    const clickHandler = jest.fn()
    const update = html`<button onclick=${clickHandler}></button>`
    const existing = html`<button></button>`

    mutateNode(update, existing)

    existing.click()

    expect(clickHandler).toBeCalledTimes(1)
  })
})
