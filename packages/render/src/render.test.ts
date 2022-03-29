import html from '@alchemic/html'
import render from './render'
import * as walk from './walk'

describe('render', () => {
  it('Should throw an error if HTML nodes are not passed to the render function.', () => {
    expect(() => render(
      {} as unknown as HTMLElement,
      {} as unknown as HTMLElement,
    )).toThrowError('The parameters updateNode and existingNode must be valid HTMLElements.')
  })

  it('Should not throw an error if HTML nodes are passed to the render function.', () => {
    expect(() => render(
      html`<h1></h1>`,
      html`<div></div>`,
    )).not.toThrow()
  })

  it('Should walk the submitted nodes.', () => {
    const walkSpy = jest.spyOn(walk, 'default')

    render(
      html`<h2></h2>`,
      html`<h2><span></span></h2>`,
    )

    expect(walkSpy).toHaveBeenCalled()
  })
})
