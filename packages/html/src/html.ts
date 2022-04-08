import { isEvent, EventType } from '@alchemic/utilities'
import sanitizeHtmlExpression from './sanitizeHtmlExpression'
import { TemplateParser, TemplateExpression } from './html.types'

// TODO figure out support for namespaced attributes and elements
const html: TemplateParser = (templateStrings, ...templateExpressions) => {
  const elementStack: { element: HTMLElement, isClosed: boolean }[] = []
  let eventStack: { event: EventType, handler: (...args: any) => any }[] = []
  let evaluationString = ''
  let activeElement = -1
  let isEvaluatingTagFragment: RegExpMatchArray | null = null

  const parseAttributes = (attributes: string[]) => {
    for (let i = 0; i < attributes.length; i++) {
      const [name, rawValue] = attributes[i].split(/=/)
      const value = rawValue?.replace(/(^["'])|(["']$)/g, '') || ''

      elementStack[activeElement].element.setAttribute(name, value || '')
    }
  }

  const handleFalsyAttributeExpression = (expression: any) => {
    if (isEvaluatingTagFragment && !expression) evaluationString = evaluationString.replace(/ [^\s]*$/, '')
  }

  const parseExpression = (expression: TemplateExpression) => {
    switch (typeof expression) {
      case 'string': {
        evaluationString += sanitizeHtmlExpression(expression)
        return
      }
      case 'number': {
        evaluationString += expression
        return
      }
      case 'object': {
        if (expression instanceof HTMLElement) {
          if (evaluationString) {
            elementStack[activeElement].element.appendChild(document.createTextNode(evaluationString))
            evaluationString = ''
          }
          elementStack[elementStack.length - 1].element.appendChild(expression)
          return
        }

        if (Array.isArray(expression)) {
          for (let i = 0; i < expression.length; i++) {
            parseExpression(expression[i])
          }
          return
        }

        handleFalsyAttributeExpression(expression)
  
        return
      }
      case 'function': {
        const eventHandlerMatch = evaluationString.match(/(?<event>on[a-z]+) *= *$/)
        
        if (eventHandlerMatch) {
          const event = eventHandlerMatch.groups?.event as EventType
          
          if (isEvent(event)) {
            eventStack.push({ event, handler: expression })
            evaluationString = evaluationString.substring(0, eventHandlerMatch.index)
            return
          }
        }

        evaluationString = evaluationString.replace(/\s[^\s]*$/, '')
        return
      }
      case 'boolean': {
        handleFalsyAttributeExpression(expression)
        return
      }
      default: {
        handleFalsyAttributeExpression(expression)
        return
      }
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
    const tagMatch = evaluationString.match(/(?<fullMatch><\s*(?<isClosing>\/?)\s*(?<tagName>[\w:-]*)\s*(?<rawAttributes>((?!(\/>)|[<>])[\s\S])*)\s*(?<isSelfClosing>\/?)>)/)
    
    // TODO support comments
    if (tagMatch) {
      const { fullMatch, tagName, rawAttributes, isClosing, isSelfClosing } = tagMatch.groups as any
      const matchIndex = tagMatch.index || 0
      const preMatchString = evaluationString.substring(0, matchIndex).trim()
      const postMatchString = evaluationString.substring(matchIndex + (fullMatch?.length || 0))

      if (preMatchString) elementStack[activeElement].element.appendChild(document.createTextNode(preMatchString))

      const attributes = rawAttributes.match(/[^"'=\s<>/]+(\s*=\s*(?<quote>["'])((?:\\\k<quote>|(?:(?!\k<quote>)).)*)(\k<quote>))?/g) || []
      
      if (!tagName) throw new Error(`Error evaluating tag: ${fullMatch}.  There is no tag name.`)

      if (!isClosing) {
        const element = document.createElement(tagName) as HTMLElement

        elementStack.push({ element, isClosed: false })
        activeElement = elementStack.length - 1
        if (attributes.length > 0) parseAttributes(attributes)
        if (isSelfClosing) handleClosingTag()
      } else {
        if (tagName?.toLocaleLowerCase() !== elementStack[activeElement]?.element?.tagName?.toLowerCase())
          throw new Error(`Error evaluating tag: ${fullMatch}.  Closing tag does not match the open tag.`)
        handleClosingTag()
      }

      evaluationString = postMatchString
      parseElements()
    }
    isEvaluatingTagFragment = evaluationString.match(/<[^>]*$/)

    return
  }

  for (let i = 0; i < templateStrings.length; i++) {
    evaluationString += templateStrings[i]
    parseElements()
    parseExpression(templateExpressions[i])
  }

  // TODO handle templates with no root element
  if (elementStack.length !== 1) throw new Error('The template should have a single root node.')
  return elementStack[0].element
}

export default html
