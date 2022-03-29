type UpdateAttributeSignatures = {
  (updateNode: HTMLInputElement, existingNode: HTMLInputElement, name: 'checked' | 'disabled'): void
  (updateNode: HTMLOptionElement, existingNode: HTMLOptionElement, name: 'selected'): void
}

const updateAttribute: UpdateAttributeSignatures = (updateNode: any, existingNode: any, name: any) => {
  if (updateNode[name] !== existingNode[name]) {
    existingNode[name] = updateNode[name]
    if (updateNode[name]) {
      existingNode.setAttribute(name, '')
    } else {
      existingNode.removeAttribute(name)
    }
  }
}

export default updateAttribute
