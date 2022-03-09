import { sanitizeHtmlExpression } from '@alchemic/utilities'
import { HTMLParser, HTMLParserContext, HTMLParserMathGroups } from './html.types'

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

const parseElements = ({ elementStack, templateString }: HTMLParserContext): HTMLParserContext => {
  const match = templateString.match(/(?<fullMatch><(?<closing>\/?) *(?<tagName>\w*) *(?<attributes>[()a-zA-Z0-9 ="'-]*) *>)/)

  if (match) {
    const { fullMatch, tagName, closing, attributes } = match.groups as HTMLParserMathGroups
    const matchIndex = match.index || 0
    const preMatchString = templateString.substring(0, matchIndex).trim()
    const postMatchString = templateString.substring(matchIndex + fullMatch.length).trim()
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
    }
  
    return parseElements({ elementStack, templateString: postMatchString })
  }

  return { elementStack, templateString }
}

const html: HTMLParser = (templateStrings, ...templateExpressions) => {
  let parsingContext: HTMLParserContext = {
    elementStack: [],
    templateString: '',
  }

  for (let i = 0; i < templateStrings.length; i++) {
    const parsedExpression = templateExpressions[i] ? sanitizeHtmlExpression(String(templateExpressions[i])) : ''

    parsingContext = parseElements({
      ...parsingContext,
      templateString: parsingContext.templateString + templateStrings[i] + parsedExpression,
    })
  }

  // TODO handle templates with no root element
  return parsingContext.elementStack[0] || document.createDocumentFragment()
}

export default html
