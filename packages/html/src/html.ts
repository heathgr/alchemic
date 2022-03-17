import { isEvent, sanitizeHtmlExpression, EventType } from '@alchemic/utilities'
import { HTMLParser, HTMLParserMathGroups, TemplateExpression } from './html.types'

const html: HTMLParser = (templateStrings, ...templateExpressions) => {
  const elementStack: HTMLElement[] = []
  let activeString = ''
  let activeElement = -1

  const parseAttributes = (attributes: string) => {
    // TODO make attribute name matcher adhere to HTML5 standard
    const attributeNameMatch = attributes.match(/(?<fullMatch>^ *(?<name>[-a-zA-z0-9]+) *)/)
    const attributeValueMatch = attributes.match(/(?<fullMatch> *= *(?<opening>['"])(?<value>[^=]*)\k<opening>)/)
    const name = attributeNameMatch?.groups?.name
    const value = attributeValueMatch?.groups?.value
  
    if (name) elementStack[activeElement].setAttribute(name, value || name)
    else return
  
    const theRest = attributes.substring(
      (attributeNameMatch?.groups?.fullMatch?.length || 0) + (attributeValueMatch?.groups?.fullMatch?.length || 0),
    )
    
    parseAttributes(theRest)
  }

  const parseExpression = (expression: TemplateExpression) => {
    switch (typeof expression) {
      case 'string': {
        activeString += sanitizeHtmlExpression(expression)
        return
      }
      case 'number': {
        activeString += expression
        return
      }
      case 'object': {
        if (expression instanceof HTMLElement) {
          if (activeString) {
            elementStack[activeElement].appendChild(document.createTextNode(activeString))
            activeString = ''
          }
          elementStack[elementStack.length - 1].appendChild(expression)
        }

        if (Array.isArray(expression)) {
          for (let i = 0; i < expression.length; i++) {
            parseExpression(expression[i])
          }
        }
  
        return
      }
      case 'function': {
        const eventHandlerMatch = activeString.match(/(?<event>on[a-z]+) *= *$/)

        if (eventHandlerMatch) {
          const event = eventHandlerMatch.groups?.event as EventType
          
          if (isEvent(event)) {
            elementStack[activeElement][event] = expression
            activeString = activeString.substring(0, eventHandlerMatch.index)
          }
        }

        return
      }
      default: return
    }
  }

  const handleClosingTag = () => {
    if (activeElement) {
      elementStack[activeElement - 1].appendChild(elementStack[activeElement])
      elementStack.pop()
      activeElement --
    }
  }

  const parseElements = () => {
    const tagMatch = activeString.match(/(?<fullMatch><(?<closing>\/?) *(?<tagName>\w*) *(?<attributes>[()a-zA-Z0-9 ="'-]*) *(?<isSelfClosing>\/?)>)/)
    
    if (tagMatch) {
      const { fullMatch, tagName, closing, attributes, isSelfClosing } = tagMatch.groups as HTMLParserMathGroups
      const matchIndex = tagMatch.index || 0
      const preMatchString = activeString.substring(0, matchIndex).trim()
      const postMatchString = activeString.substring(matchIndex + fullMatch.length)
  
      if (preMatchString) elementStack[activeElement].appendChild(document.createTextNode(preMatchString))
      
      if (closing) {
        if (tagName?.toLowerCase() !== elementStack[activeElement].tagName.toLowerCase())
          throw new Error(`Invalid HTML: opening tag ${elementStack[activeElement].tagName.toLocaleLowerCase()} does not match closing tag ${tagName?.toLocaleLowerCase()}`)
        handleClosingTag()
      } else {
        elementStack.push(document.createElement(tagName as keyof HTMLElementTagNameMap))
        activeElement ++
  
        if (attributes) parseAttributes(attributes)
        if (isSelfClosing) {
          handleClosingTag()
        }
      }
      
      activeString = postMatchString
      parseElements()
    }
  
    return
  }

  for (let i = 0; i < templateStrings.length; i++) {
    activeString += templateStrings[i]
    parseElements()
    parseExpression(templateExpressions[i])
  }

  // TODO handle templates with no root element
  return elementStack[0] || document.createDocumentFragment()
}

export default html
