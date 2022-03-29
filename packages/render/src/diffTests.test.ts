import html from '@alchemic/html'
import render from './render'

describe('Diff tests.', () => {
  xit('Should replace a node.', () => {
    const a = html`<p>hello world</p>`
    const b = html`<div>hello world</div>`

    render(a, b)

    expect(b.outerHTML).toBe('<div>hello world</div>')
  })

  xit('Should replace a component.', () => {})

  it('Should morph a node.', async () => {
    const a = html`<p>hello world!</p>`
    const b = html`<p>hello you</p>`

    render(a, b)

    expect(b.outerHTML).toBe('<p>hello you</p>')
  })

  xit('should morph a node with namespaced attribute', () => {})
})
