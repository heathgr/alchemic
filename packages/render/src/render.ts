import walk from './walk'

export default (updateNode: HTMLElement, existingNode: HTMLElement) => {
  if (!(updateNode instanceof HTMLElement) || !(existingNode instanceof HTMLElement)) {
    throw new Error('The parameters updateNode and existingNode must be valid HTMLElements.')
  }

  walk(updateNode, existingNode)
}
