import { sanitizeHtmlExpression } from '@alchemic/utilities'
import { HTMLParser, HTMLParserMathGroups, TemplateExpression } from './html.types'

const html: HTMLParser = (templateStrings, ...templateExpressions) => {
  const elementStack: HTMLElement[] = []
  let activeExpression: TemplateExpression = undefined
  let activeString = ''
  // TODO move active element pointer up here?

  const parseAttributes = (attributes: string, element: HTMLElement) => {
    // TODO make attributes name matcher adhere to HTML5 standard
    const attributeNameMatch = attributes.match(/(?<fullMatch>^ *(?<name>[a-zA-z0-9]+) *)/)
    const attributeValueMatch = attributes.match(/(?<fullMatch> *= *(?<opening>['"])(?<value>[^=]*)\k<opening>)/)
    const name = attributeNameMatch?.groups?.name
    const value = attributeValueMatch?.groups?.value
  
    if (name) element.setAttribute(name, value || name)
    else return
  
    const theRest = attributes.substring(
      (attributeNameMatch?.groups?.fullMatch?.length || 0) + (attributeValueMatch?.groups?.fullMatch?.length || 0),
    )
    
    parseAttributes(theRest, element)
  }

  const parseExpression = () => {
    switch (typeof activeExpression) {
      case 'string': {
        activeString = activeString + sanitizeHtmlExpression(activeExpression)
        return
      }
      case 'number': {
        activeString = activeString + activeExpression
        return
      }
      case 'object': {
        if (activeExpression instanceof HTMLElement) {
          elementStack[elementStack.length - 1].appendChild(activeExpression)
        }
  
        return
      }
      default: return
    }
  }

  const parseElements = () => {
    const tagMatch = activeString.match(/(?<fullMatch><(?<closing>\/?) *(?<tagName>\w*) *(?<attributes>[()a-zA-Z0-9 ="'-]*) *(?<isSelfClosing>\/?)>)/)
    
    if (tagMatch) {
      const { fullMatch, tagName, closing, attributes, isSelfClosing } = tagMatch.groups as HTMLParserMathGroups
      const matchIndex = tagMatch.index || 0
      const preMatchString = activeString.substring(0, matchIndex).trim()
      const postMatchString = activeString.substring(matchIndex + fullMatch.length)
      let activeElement = elementStack[elementStack.length - 1] // TODO use a pointer to handle active element?
  
      if (preMatchString) activeElement.appendChild(document.createTextNode(preMatchString))
      
      if (closing) {
        if (tagName?.toLowerCase() !== activeElement.tagName.toLowerCase())
          throw new Error(`Invalid HTML: opening tag ${activeElement.tagName.toLocaleLowerCase()} does not match closing tag ${tagName?.toLocaleLowerCase()}`)
        if (elementStack.length > 1) {
          elementStack[elementStack.length - 2].appendChild(activeElement)
          elementStack.pop()
          activeElement = elementStack[elementStack.length - 1]
        }
      } else {
        elementStack.push(document.createElement(tagName as keyof HTMLElementTagNameMap))
        activeElement = elementStack[elementStack.length - 1]
  
        if (attributes) parseAttributes(attributes, activeElement)
        if (isSelfClosing) {
          if (elementStack.length > 1) {
            // TODO this is duplicate logic clean it up
            elementStack[elementStack.length - 2].appendChild(activeElement)
            elementStack.pop()
            activeElement = elementStack[elementStack.length - 1]
          }
        }
      }
      
      activeString = postMatchString
      parseElements()
    }
  
    return
  }

  for (let i = 0; i < templateStrings.length; i++) {
    activeString += templateStrings[i]
    activeExpression = templateExpressions[i]
    parseElements()
    parseExpression()
  }

  // TODO handle templates with no root element
  return elementStack[0] || document.createDocumentFragment()
}

export default html
