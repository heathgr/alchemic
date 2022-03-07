import { HTMLParser, HTMLParserContext, HTMLParserMathGroups } from './html.types'

const tagMatcher = /(?<fullMatch><(?<closing>\/?) *(?<tagName>\w*) *(?<attributes>[a-zA-Z ="'-]*) *>)/

const parseElements = ({ elementStack, templateString }: HTMLParserContext): HTMLParserContext => {
  const match = templateString.match(tagMatcher)

  if (match) {
    const { fullMatch, tagName, closing, attributes } = match.groups as HTMLParserMathGroups
    const matchIndex = match.index || 0
    const preMatchString = templateString.substring(0, matchIndex).trim()
    const postMatchString = templateString.substring(matchIndex + fullMatch.length).trim()
    let activeElement = elementStack[elementStack.length - 1]

    if (preMatchString) activeElement.appendChild(document.createTextNode(preMatchString))
    
    if (closing) {
      if (elementStack.length > 1) {
        elementStack[elementStack.length - 2].appendChild(activeElement)
        elementStack.pop()
      }
      if (tagName?.toLowerCase() !== activeElement.tagName.toLowerCase()) throw new Error(`Invalid HTML: opening tag ${activeElement.tagName} closing tag ${tagName}`)
    } else {
      elementStack.push(document.createElement(tagName as keyof HTMLElementTagNameMap))
      activeElement = elementStack[elementStack.length - 1]

      if (attributes) {
        attributes.split(' ').forEach(a => {
          const [rawAttribute, rawValue] = a.split('=')
          const attribute = rawAttribute.trim()
          const value = rawValue.replace(/['"]/g, '')

          activeElement.setAttribute(attribute, value)
        })
      }
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
    parsingContext = parseElements({
      ...parsingContext,
      templateString: parsingContext.templateString + templateStrings[i] + (templateExpressions[i] || ''),
    })
  }

  return parsingContext.elementStack[0] || document.createDocumentFragment()
}

export default html
