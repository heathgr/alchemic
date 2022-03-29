import nodesAreSame from './nodesAreSame'
import walk from './walk'

export default (updateNode: HTMLElement, existingNode: HTMLElement) => {
  let loopOffset = 0

  for (let i = 0; ;i++) {
    const updateChild = updateNode.childNodes[i - loopOffset] as HTMLElement
    const existingChild = existingNode.childNodes[i] as HTMLElement

    if (!updateChild && !existingChild) break
    if (!updateChild) {
      existingNode.removeChild(existingChild)
      i--
      continue
    }
    if (!existingChild) {
      existingNode.appendChild(updateChild)
      loopOffset++
      continue
    }
    if (nodesAreSame(updateChild, existingChild)) {
      const mutated = walk(updateChild, existingChild)
      
      if (mutated !== existingChild) {
        existingNode.replaceChild(mutated as HTMLElement, existingChild)
        loopOffset++
      }
      continue
    }

    let existingMatch = null

    for (let j = i; j < existingNode.childNodes.length; j++) {
      if (nodesAreSame(existingNode.childNodes[j] as HTMLElement, updateChild)) {
        existingMatch = existingNode.childNodes[j]
        break
      }
    }

    if (existingMatch) {
      const mutated = walk(updateChild, existingMatch as HTMLElement)
      if (mutated !== existingMatch) loopOffset++
      existingNode.insertBefore(mutated as HTMLElement, existingChild)
      continue
    }

    if (!updateChild.id && !existingChild.id) {
      const mutated = walk(updateChild, existingChild)

      if (mutated !== existingChild) {
        existingNode.replaceChild(mutated as HTMLElement, existingChild)
        loopOffset++
      }
      continue
    }

    existingNode.insertBefore(updateChild, existingChild)
    loopOffset++
  }
}
