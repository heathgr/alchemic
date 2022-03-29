import html from '@alchemic/html'
import copyNodeAttributes from './copyNodeAttributes'

describe('copyNodeAttributes', () => {
  it('Should update attribute values on the existingNode to match attribute values on the updateNode', () => {
    const updateNode = html`<button id="updatedId" aria-label="update"></button>`
    const existingNode = html`<button id="oldId" aria-label="abcdef"></button>`

    copyNodeAttributes(updateNode, existingNode)

    expect(existingNode.outerHTML).toBe('<button id="updatedId" aria-label="update"></button>')
  })

  it('Should update attribute namespace on the existingNode to match attribute namespaces on the updateNode', () => {
    const updateNode = html`<div></div>`
    const existingNode = html`<div></div>`

    updateNode.setAttributeNS('http://test.com/test', 'align', 'center')

    copyNodeAttributes(updateNode, existingNode)

    expect(existingNode.getAttributeNS('http://test.com/test', 'align')).toBe('center')
  })

  it('Should add attributes to the existingNode that are not on the existingNode and on the updateNode.', () => {
    const updateNode = html`<button id="shouldBeAddedToExisting" class="cool-button"></button>`
    const existingNode = html`<button></button>`

    copyNodeAttributes(updateNode, existingNode)

    expect(existingNode.outerHTML).toBe('<button class="cool-button" id="shouldBeAddedToExisting"></button>')
  })

  it('Should remove attributes from the existingNode that are on the existingNode and not on the updateNode.', () => {
    const updateNode = html`<button></button>`
    const existingNode = html`<button id="willBeRemoved" role="button"></button>`

    copyNodeAttributes(updateNode, existingNode)

    expect(existingNode.outerHTML).toBe('<button></button>')
  })

  it('Should update attribute namespace on the existingNode to match attribute namespaces on the updateNode', () => {
    const updateNode = html`<div></div>`
    const existingNode = html`<div></div>`

    existingNode.setAttributeNS('http://test.com/test', 'align', 'center')

    copyNodeAttributes(updateNode, existingNode)

    expect(existingNode.getAttributeNS('http://test.com/test', 'align')).toBe(null)
  })

  it('Should remove attributes from the existingNode that are on the updateNode and have a null or undefined value.', () => {
    const updateNode = html`<button id="null" role="undefined"></button>`
    const existingNode = html`<button id="willBeRemoved" role="button"></button>`

    copyNodeAttributes(updateNode, existingNode)

    expect(existingNode.outerHTML).toBe('<button></button>')
  })
})
