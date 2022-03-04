import { HTMLParser, HTMLParserContext } from './html.types'

const tagMatcher = /(?<fullMatch><(?<closing>\/?) *(?<tagName>\w*) *>)/

const findTag = ({ elementStack, templateString }: HTMLParserContext): HTMLParserContext => {
  const match = templateString.match(tagMatcher)

  if (match) {
    const { fullMatch, tagName, closing  } = match.groups as { fullMatch: string, tagName: string, closing: string }
    const matchIndex = match.index || 0
    const preMatchString = templateString.substring(0, matchIndex).trim()
    const postMatchString = templateString.substring(matchIndex + fullMatch.length).trim()

    if (preMatchString) elementStack[elementStack.length - 1].appendChild(document.createTextNode(preMatchString))
    
    if (closing) {
      // TODO make sure there are enough elements to the array to perform the closing operation
      // TODO make sure opening and closing tagNames match
      elementStack[elementStack.length - 2].appendChild(elementStack[elementStack.length - 1])
      elementStack.pop()
    } else {
      elementStack.push(document.createElement(tagName))
    }
  
    return findTag({ elementStack, templateString: postMatchString })
  }

  console.log('no match: ', templateString)
  return { elementStack, templateString }
}

const html: HTMLParser = (templateStrings, ...templateExpressions) => {
  let parsingContext: HTMLParserContext = {
    elementStack: [document.createDocumentFragment()],
    templateString: '',
  }

  for (let i = 0; i < templateStrings.length; i++) {
    parsingContext = findTag({ ...parsingContext, templateString: templateStrings[i] })
  }

  return parsingContext.elementStack[0] || document.createElement('div')
}

export default html
