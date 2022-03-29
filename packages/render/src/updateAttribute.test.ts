import html from '@alchemic/html'
import updateAttribute from './updateAttribute'

describe('updateAttribute', () => {
  it('Should update attributes on the existing node to match the update node.', () => {
    const existingNode = html`<input type="checkbox">` as HTMLInputElement
    const updateNode = html`<input type="checkbox" checked>` as HTMLInputElement

    updateAttribute(updateNode, existingNode, 'checked')

    expect(existingNode.hasAttribute('checked')).toBe(true)
  })

  it('Should remove attributes on the existing node that are not on the update node.', () => {
    const existingNode = html`<input type="checkbox" disabled>` as HTMLInputElement
    const updateNode = html`<input type="checkbox">` as HTMLInputElement

    updateAttribute(updateNode, existingNode, 'disabled')

    expect(existingNode.hasAttribute('disabled')).toBe(false)
  })

  it('Should not update values of attributes that are equal on the update and existing nodes', () => {
    const existingNode = html`<input type="checkbox" disabled>` as HTMLInputElement
    const updateNode = html`<input type="checkbox" disabled>` as HTMLInputElement

    updateAttribute(updateNode, existingNode, 'disabled')

    expect(existingNode.disabled).toBe(updateNode.disabled)
  })
})
