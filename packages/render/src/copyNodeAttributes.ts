export default (updateNode: HTMLElement, existingNode: HTMLElement) => {
  const existingAttrs = existingNode.attributes
  const updateAttrs = updateNode.attributes

  for (let i = updateAttrs.length - 1; i >= 0; --i) {
    // TODO declare these variables outside of loop for performance?
    // see nanohtml implementation
    const attr = updateAttrs[i]
    const attrNamespaceURI = attr.namespaceURI
    const attrValue = attr.value
    let attrName = attr.name

    if (attrNamespaceURI) {
      attrName = attr.localName || attrName
      const fromValue = existingNode.getAttributeNS(attrNamespaceURI, attrName)
      if (fromValue !== attrValue) {
        existingNode.setAttributeNS(attrNamespaceURI, attrName, attrValue)
      }
    } else {
      if (!existingNode.hasAttribute(attrName)) {
        existingNode.setAttribute(attrName, attrValue)
      } else {
        const fromValue = existingNode.getAttribute(attrName)

        if (fromValue !== attrValue) {
          // values are always cast to strings
          if (attrValue === 'null' || attrValue === 'undefined') {
            existingNode.removeAttribute(attrName)
          } else {
            existingNode.setAttribute(attrName, attrValue)
          }
        }
      }
    }
  }

  for (let j = existingAttrs.length - 1; j >= 0; --j) {
    const attr = existingAttrs[j]

    if (attr.specified !== false) {
      let attrName = attr.name
      const attrNamespaceURI = attr.namespaceURI

      if (attrNamespaceURI) {
        attrName = attr.localName || attrName
        if (!updateNode.hasAttributeNS(attrNamespaceURI, attrName)) {
          existingNode.removeAttributeNS(attrNamespaceURI, attrName)
        }
      } else {
        if (!updateNode.hasAttributeNS(null, attrName)) {
          existingNode.removeAttribute(attrName)
        }
      }
    }
  }
}
