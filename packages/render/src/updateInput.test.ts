import html from '@alchemic/html'
import updateInput from './updateInput'

describe('updateInput', () => {
  it('Should do nothing for file inputs.', () => {
    const updateNode = html`<input type='file' value='test' />` as HTMLInputElement
    const existingNode = html`<input type='file' />` as HTMLInputElement

    updateInput(updateNode, existingNode)

    expect(existingNode.value).toBe('')
  })

  it('Should update the checked attribute', () => {
    const updateNode = html`<input type='checkbox' checked />` as HTMLInputElement
    const existingNode = html`<input type='checkbox' />` as HTMLInputElement

    updateInput(updateNode, existingNode)

    expect(existingNode.hasAttribute('checked')).toBe(true)
  })

  it('Should update the checked attribute', () => {
    const updateNode = html`<input type='checkbox' disabled />` as HTMLInputElement
    const existingNode = html`<input type='checkbox' />` as HTMLInputElement

    updateInput(updateNode, existingNode)

    expect(existingNode.hasAttribute('disabled')).toBe(true)
  })

  it('Should update the indeterminate attribute', () => {
    const updateNode = html`<input type='checkbox' />` as HTMLInputElement
    const existingNode = html`<input type='checkbox' />` as HTMLInputElement

    updateNode.indeterminate = true
    updateInput(updateNode, existingNode)

    expect(existingNode.indeterminate).toBe(true)
  })

  it('Should update the input value', () => {
    const updateNode = html`<input type='text' value="updated" />` as HTMLInputElement
    const existingNode = html`<input type='text' value="old and stale." />` as HTMLInputElement

    updateNode.indeterminate = true
    updateInput(updateNode, existingNode)

    expect(existingNode.value).toBe('updated')
  })

  it('Should remove the input value', () => {
    const updateNode = html`<input type='text' value="null" />` as HTMLInputElement
    const existingNode = html`<input type='text' value="old and stale." />` as HTMLInputElement

    updateNode.indeterminate = true
    updateInput(updateNode, existingNode)

    expect(existingNode.value).toBe('')
  })

  it('Should update range input value', () => {
    const updateNode = html`<input type='range' value="9" />` as HTMLInputElement
    const existingNode = html`<input type='range' value="0" />` as HTMLInputElement

    updateInput(updateNode, existingNode)

    expect(existingNode.value).toBe('9')
  })
})
