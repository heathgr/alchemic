export default (updateNode: HTMLTextAreaElement, existingNode: HTMLTextAreaElement) => {
  if (updateNode.value !== existingNode.value) {
    existingNode.value = updateNode.value
  }

  if (existingNode.firstChild && existingNode.firstChild.nodeValue !== updateNode.value) {
    // Needed for IE. Apparently IE sets the placeholder as the
    // node value and vise versa. This ignores an empty update.
    if (updateNode.value === '' && existingNode.firstChild.nodeValue === existingNode.placeholder) {
      return
    }

    existingNode.firstChild.nodeValue = updateNode.value
  }
}
