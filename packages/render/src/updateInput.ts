import updateAttribute from './updateAttribute'

export default (updateNode: HTMLInputElement, existingNode: HTMLInputElement) => {
  const updateValue = updateNode.value
  const existingValue = existingNode.value

  // Persist file value since file inputs can't be changed programmatically
  if (existingNode.type === 'file') return

  updateAttribute(updateNode, existingNode, 'checked')
  updateAttribute(updateNode, existingNode, 'disabled')

  // The "indeterminate" property can not be set using an HTML attribute.
  // See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
  if (updateNode.indeterminate !== existingNode.indeterminate) {
    existingNode.indeterminate = updateNode.indeterminate
  }

  if (updateValue !== existingValue) {
    existingNode.setAttribute('value', updateValue)
    existingNode.value = updateValue
  }

  if (updateValue === 'null') {
    existingNode.value = ''
    existingNode.removeAttribute('value')
  }

  if (!updateNode.hasAttributeNS(null, 'value')) {
    existingNode.removeAttribute('value')
  } else if (existingNode.type === 'range') {
    // this is so elements like slider update their UI
    existingNode.value = updateValue
  }
}
