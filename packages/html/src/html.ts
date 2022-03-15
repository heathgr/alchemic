import { sanitizeHtmlExpression } from '@alchemic/utilities'
import { HTMLParser, HTMLParserContext, HTMLParserMathGroups, TemplateExpression } from './html.types'

// TODO refactor to put all functions in a context where the context does not need to be passed from function to function?
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

const parseExpression = ({ elementStack, templateString }: HTMLParserContext, expression: TemplateExpression): HTMLParserContext => {
  switch (typeof expression) {
    case 'string': return { elementStack, templateString: templateString + sanitizeHtmlExpression(expression) }
    case 'number': return { elementStack, templateString: templateString + expression }
    case 'object': {
      if (expression instanceof HTMLElement) {
        elementStack[elementStack.length - 1].appendChild(expression)
      }

      return { elementStack, templateString }
    }
    default: return { elementStack, templateString }
  }
}

const parseElements = ({ elementStack, templateString }: HTMLParserContext): HTMLParserContext => {
  const match = templateString.match(/(?<fullMatch><(?<closing>\/?) *(?<tagName>\w*) *(?<attributes>[()a-zA-Z0-9 ="'-]*) *(?<isSelfClosing>\/?)>)/)

  if (match) {
    const { fullMatch, tagName, closing, attributes, isSelfClosing } = match.groups as HTMLParserMathGroups
    const matchIndex = match.index || 0
    const preMatchString = templateString.substring(0, matchIndex).trim()
    const postMatchString = templateString.substring(matchIndex + fullMatch.length)
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
          elementStack[elementStack.length - 2].appendChild(activeElement)
          elementStack.pop()
          activeElement = elementStack[elementStack.length - 1]
        }
      }
    }
  
    return parseElements({ elementStack, templateString: postMatchString })
  }

  return { elementStack, templateString }
}

const html: HTMLParser = (templateStrings, ...templateExpressions) => {
  let parserContext: HTMLParserContext = {
    elementStack: [],
    templateString: '',
  }

  for (let i = 0; i < templateStrings.length; i++) {
    parserContext = parseElements({
      ...parserContext,
      templateString: parserContext.templateString + templateStrings[i],
    })

    parserContext = parseExpression(parserContext, templateExpressions[i])
  }

  // TODO handle templates with no root element
  return parserContext.elementStack[0] || document.createDocumentFragment()
}

export default html
