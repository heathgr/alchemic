import html from '@alchemic/html'

import walkChildren from './walkChildren'
import * as walk from './walk'

describe('walkChildren', () => {
  it('Should remove child nodes from the existing node if needed.', () => {
    const update = html`<main></main>`
    const existing = html`<main><h1>header</h1><p>paragraph</p></main>`

    walkChildren(update, existing)

    expect(existing.outerHTML).toEqual('<main></main>')
  })

  it('Should append child nodes of the update node to the existing node if needed.', () => {
    const update = html`<main><h1>header</h1><p>paragraph</p></main>`
    const existing = html`<main></main>`

    walkChildren(update, existing)

    expect(existing.outerHTML).toEqual('<main><h1>header</h1><p>paragraph</p></main>')
  })

  it('Should walk nodes that are the same.', () => {
    const childA = html`<div id="test" />`
    const childB = html`<div id="test" />`
    const update = html`<main>${childA}</main>`
    const existing = html`<main>${childB}</main>`
    const walkSpy = jest.spyOn(walk, 'default')

    walkChildren(update, existing)

    expect(walkSpy).toHaveBeenCalledWith(childA, childB)
  })

  it('Should replace mutated nodes that are different than the existing child node.', () => {
    const update = html`<main><p>hello world</p></main>`
    const existing = html`<main><div>hello world</div></main>`
    
    walkChildren(update, existing)

    expect(existing.outerHTML).toBe('<main><p>hello world</p></main>')
  })

  it('Should reorder existing child nodes to match the update node.', () => {
    const update = html`<main><div id="a">a</div><div id="b">b</div><div id="c">c</div></main>`
    const existing = html`<main><div id="c">c</div><div id="a">a</div><div id="b">b</div></main>`
    
    walkChildren(update, existing)

    expect(existing.outerHTML).toBe('<main><div id="a">a</div><div id="b">b</div><div id="c">c</div></main>')
  })

  it('Should insert new nodes before existing child node.', () => {
    const update = html`<main><div id="a">a</div><div id="b">b</div><div id="c">c</div></main>`
    const existing = html`<main><div id="c">c</div><div id="b">b</div></main>`
    
    walkChildren(update, existing)

    expect(existing.outerHTML).toBe('<main><div id="a">a</div><div id="b">b</div><div id="c">c</div></main>')
  })
})
