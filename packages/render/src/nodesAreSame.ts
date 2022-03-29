import { NodeTypes } from './render.types'

export default (a: HTMLElement, b: HTMLElement) => {
  if (a.id) return a.id === b.id
  if (a.tagName !== b.tagName) return false
  if (a.nodeType === NodeTypes.TEXT) return a.nodeValue === b.nodeValue

  return false
}
