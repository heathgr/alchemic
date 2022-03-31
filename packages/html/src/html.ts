import { isEvent, sanitizeHtmlExpression, EventType } from '@alchemic/utilities'
import { TemplateParser, TemplateTagMatcherGroups, TemplateExpression } from './html.types'

// TODO support comments
// TODO support null attribute values
// TODO support namespaced attributes
const html: TemplateParser = (templateStrings, ...templateExpressions) => {
  const elementStack: { element: HTMLElement, isClosed: boolean }[] = []
  let eventStack: { event: EventType, handler: (...args: any) => any }[] = []
  let activeString = ''
  let activeElement = -1

  const parseAttributes = (attributes: string) => {
    // TODO make attribute name matcher adhere to HTML5 standard
    // TODO better support for boolean attributes
    const attributeNameMatch = attributes.match(/(?<fullMatch>^ *(?<name>[-a-zA-z0-9:]+) *)/)
    const attributeValueMatch = attributes.match(/(?<fullMatch> *= *(?<opening>['"])(?<value>[^=]*)\k<opening>)/)
    const name = attributeNameMatch?.groups?.name
    const value = attributeValueMatch?.groups?.value
  
    if (name) elementStack[activeElement].element.setAttribute(name, value || name)
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
            elementStack[activeElement].element.appendChild(document.createTextNode(activeString))
            activeString = ''
          }
          elementStack[elementStack.length - 1].element.appendChild(expression)
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
            eventStack.push({ event, handler: expression })
            activeString = activeString.substring(0, eventHandlerMatch.index)
          }
        }

        return
      }
      default: return
    }
  }

  const handleClosingTag = () => {
    elementStack[activeElement].isClosed = true
    
    for (let i = 0; i < eventStack.length; i++) {
      elementStack[activeElement].element[eventStack[i].event] = eventStack[i].handler
    }

    eventStack = []

    if (activeElement && !elementStack[activeElement - 1].isClosed) {
      elementStack[activeElement - 1].element.appendChild(elementStack[activeElement].element)
      elementStack.pop()
      activeElement = elementStack.length - 1
    }
  }

  const parseElements = () => {
    const tagMatch = activeString.match(/(?<fullMatch><(?<closing>\/?) *(?<tagName>\w*) *(?<attributes>[/:;.()a-zA-Z0-9 ="'-]*) *\/?>)/)
    
    if (tagMatch) {
      const { fullMatch, tagName, closing, attributes } = tagMatch.groups as TemplateTagMatcherGroups
      const matchIndex = tagMatch.index || 0
      const preMatchString = activeString.substring(0, matchIndex).trim()
      const postMatchString = activeString.substring(matchIndex + fullMatch.length)
      
      if (preMatchString) elementStack[activeElement].element.appendChild(document.createTextNode(preMatchString))
      
      if (closing) {
        if (tagName?.toLowerCase() !== elementStack[activeElement]?.element?.tagName?.toLowerCase())
          throw new Error('Invalid HTML: There is a mismatch between opening and closing tags.')
        handleClosingTag()
      } else {
        elementStack.push({ element: document.createElement(tagName as keyof HTMLElementTagNameMap), isClosed: false })
        activeElement = elementStack.length - 1
  
        if (attributes) parseAttributes(attributes)
        if (fullMatch.match(/\/>$/)) {  //TODO see if self closing tag can be captured in regex capture group
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
  // TODO write better error message
  if (elementStack.length !== 1) throw new Error('It is broke!!')
  return elementStack[0].element
}

export default html
