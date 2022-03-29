import copyEvents from './copyEvents'
import copyNodeAttributes from './copyNodeAttributes'
import { NodeTypes } from './render.types'
import updateInput from './updateInput'
import updateOption from './updateOption'
import updateTextArea from './updateTextArea'

export default (updateNode: HTMLElement, existingNode: HTMLElement) => {
  const updateNodeType = updateNode.nodeType
  const updateNodeName = updateNode.nodeName

  if (updateNodeType === NodeTypes.ELEMENT) {
    copyNodeAttributes(updateNode, existingNode)
  }

  if (updateNodeType === NodeTypes.TEXT || updateNodeType === NodeTypes.COMMENT) {
    if (existingNode.nodeValue !== updateNode.nodeValue) {
      console.log('wft: ', existingNode.nodeValue, ':', updateNode.nodeValue)
      const updateValue = updateNode.nodeValue
      
      console.log('uv: ', updateValue)
      existingNode.nodeValue = updateValue // updateNode.nodeValue
      console.log('changed: ', existingNode.nodeValue)
    }
  }

  // handle special case nodes
  switch (updateNodeName) {
    case 'INPUT': {
      updateInput(updateNode as HTMLInputElement, existingNode as HTMLInputElement)
      break
    }
    case 'OPTION': {
      updateOption(updateNode as HTMLOptionElement, existingNode as HTMLOptionElement)
      break
    }
    case 'TEXTAREA': {
      updateTextArea(updateNode as HTMLTextAreaElement, existingNode as HTMLTextAreaElement)
      break
    }
    default: {
      break
    }
  }

  copyEvents(updateNode, existingNode)
}
