import mutateNode from './mutateNode'
import walkChildren from './walkChildren'

export default (updateNode?: HTMLElement, existingNode?: HTMLElement) => {
  if (!existingNode) return updateNode
  if (!updateNode) return null
  // TODO add custom mechanism for comparing nodes (see nanomorph version of walk)
  if (existingNode.tagName !== updateNode.tagName) return updateNode

  mutateNode(updateNode, existingNode)
  walkChildren(updateNode, existingNode)
  return existingNode
}
