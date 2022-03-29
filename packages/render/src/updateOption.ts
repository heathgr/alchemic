import updateAttribute from './updateAttribute'

export default (updateNode: HTMLOptionElement, existingNode: HTMLOptionElement) => {
  updateAttribute(updateNode, existingNode, 'selected')
}
