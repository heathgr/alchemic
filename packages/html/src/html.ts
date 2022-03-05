import { HTMLParser, HTMLParserContext } from './html.types'

const tagMatcher = /(?<fullMatch><(?<closing>\/?) *(?<tagName>\w*) *>)/

const findTag = ({ elementStack, templateString }: HTMLParserContext): HTMLParserContext => {
  const match = templateString.match(tagMatcher)

  if (match) {
    const { fullMatch, tagName, closing  } = match.groups as { fullMatch: string, tagName: string, closing: string }
    const matchIndex = match.index || 0
    const preMatchString = templateString.substring(0, matchIndex).trim()
    const postMatchString = templateString.substring(matchIndex + fullMatch.length).trim()
    const activeElement = elementStack[elementStack.length - 1]

    if (preMatchString) activeElement.appendChild(document.createTextNode(preMatchString))
    
    if (closing) {
      if (elementStack.length > 1) {
        elementStack[elementStack.length - 2].appendChild(activeElement)
        elementStack.pop()
      }
      if (tagName.toLowerCase() !== activeElement.tagName.toLowerCase()) throw new Error(`Invalid HTML: opening tag ${activeElement.tagName} closing tag ${tagName}`)
    } else {
      elementStack.push(document.createElement(tagName))
    }
  
    return findTag({ elementStack, templateString: postMatchString })
  }

  return { elementStack, templateString }
}

const html: HTMLParser = (templateStrings, ...templateExpressions) => {
  let parsingContext: HTMLParserContext = {
    elementStack: [],
    templateString: '',
  }

  for (let i = 0; i < templateStrings.length; i++) {
    parsingContext = findTag({
      ...parsingContext,
      templateString: parsingContext.templateString + templateStrings[i] + (templateExpressions[i] || ''),
    })
  }

  return parsingContext.elementStack[0] || document.createDocumentFragment()
}

export default html
