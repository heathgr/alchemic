import { isEvent, EventType } from '@alchemic/utilities'
import sanitizeHtmlExpression from './sanitizeHtmlExpression'
import { TemplateParser, TemplateExpression } from './html.types'

enum EvaluationMode {
  TAG,
  ATTRIBUTE_NAME,
  ATTRIBUTE_VALUE,
  ATTRIBUTE_VALUE_FROM_QUOTED_STRING,
}

// TODO figure out support for namespaced attributes and elements
// TODO support comments
// TODO only match regex on valid characters for tag names, attributes names, etc.
const html: TemplateParser = (templateStrings, ...templateExpressions) => {
  const elements: { element: HTMLElement, isClosed: boolean }[] = []
  let evaluatingElement = -1
  let templateSegment = ''
  let newAttributeName = ''
  let newAttributeValue = ''
  let newAttributeQuote = ''
  let mode = EvaluationMode.TAG

  const splitTemplateSegmentOnMatch  = (match: RegExpMatchArray | null): [string, string] => {
    const splitIndex = (match?.index || 0)
    const pre = templateSegment.substring(0, splitIndex)
    const post = templateSegment.substring(splitIndex + match[0].length).trimStart()

    templateSegment = post
    return [pre, post]
  }

  const resetNewAttributeValues = () => {
    newAttributeName = ''
    newAttributeValue = ''
    newAttributeQuote = ''
  }

  const handleClosingTag = () => {
    elements[evaluatingElement].isClosed = true
    const parent = elements[evaluatingElement - 1]
    if (evaluatingElement && parent && !parent.isClosed) {
      parent.element.appendChild(elements[evaluatingElement].element)
      elements.pop()
      evaluatingElement = elements.length - 1
    }
  }

  const evaluateExpression = (expression: TemplateExpression) => {
    switch (typeof expression) {
      case 'boolean': {
        if ( mode === EvaluationMode.ATTRIBUTE_VALUE && !expression) {
          findAttributeName()
        }
        return
      }
      case 'string': {
        templateSegment += sanitizeHtmlExpression(expression)
        return
      }
      case 'number': {
        templateSegment += expression
        return
      }
      case 'object': {
        if (mode === EvaluationMode.TAG && Array.isArray(expression)) {
          for (let i = 0; i < expression.length; i++) {
            evaluateExpression(expression[i])
          }
          return
        }
        if (mode === EvaluationMode.TAG && expression instanceof HTMLElement) {
          if (templateSegment) {
            elements[evaluatingElement].element.appendChild(document.createTextNode(templateSegment))
            templateSegment = ''
          }
          elements[evaluatingElement].element.appendChild(expression)
          return
        }
        if (mode === EvaluationMode.ATTRIBUTE_VALUE && !expression) {
          findAttributeName()
        }
        return
      }
      case 'function': {
        if (mode === EvaluationMode.ATTRIBUTE_VALUE && isEvent(newAttributeName as EventType)) {
          elements[evaluatingElement].element[newAttributeName as EventType] = expression
          findAttributeName()
          return
        }
        resetNewAttributeValues()
        findAttributeName()
        
        return
      }
      case 'undefined': {
        if (mode === EvaluationMode.ATTRIBUTE_VALUE) {
          findAttributeName()
        }
        return
      }
    }
  }

  const findAttributeValue = () => {
    mode = EvaluationMode.ATTRIBUTE_VALUE

    const valueMatch = templateSegment.match(/([^\s>]*)([\s/>])/)

    if (!valueMatch) return

    newAttributeValue += valueMatch[1]
    splitTemplateSegmentOnMatch(valueMatch)
    
    elements[evaluatingElement].element.setAttribute(newAttributeName, newAttributeValue)
    findAttributeName()
  }

  const findAttributeValueFromQuotedString = () => {
    mode = EvaluationMode.ATTRIBUTE_VALUE_FROM_QUOTED_STRING

    const valueMatcher = new RegExp(`((?:\\\\${newAttributeQuote}|(?:(?!\\${newAttributeQuote})).)*)(\\${newAttributeQuote})`, '')
    const valueMatch = templateSegment.match(valueMatcher)

    if (!valueMatch) return
    
    newAttributeValue += valueMatch[1]
    splitTemplateSegmentOnMatch(valueMatch)

    elements[evaluatingElement].element.setAttribute(newAttributeName, newAttributeValue)
    findAttributeName()
  }

  const findAttributeName = () => {
    if (mode !== EvaluationMode.ATTRIBUTE_NAME) resetNewAttributeValues()
    mode = EvaluationMode.ATTRIBUTE_NAME

    const attributeNameMatch = templateSegment.match(/([^\s=/>]*)\s*(=?)\s*(['"]?)/)

    if (attributeNameMatch && attributeNameMatch[1]) {
      newAttributeName += attributeNameMatch[1]
      splitTemplateSegmentOnMatch(attributeNameMatch)

      if (attributeNameMatch[2] && attributeNameMatch[3]) {
        newAttributeQuote = attributeNameMatch[3]
        findAttributeValueFromQuotedString()
        return
      }

      if (attributeNameMatch[2] ) {
        findAttributeValue()
        return
      }

      if (templateSegment.length === 0) {
        return
      }

      elements[evaluatingElement].element.toggleAttribute(newAttributeName)
      findAttributeName()

      return
    }

    const closeBracketMatch = templateSegment.match(/(\/?)>/)

    if (closeBracketMatch) {
      if (closeBracketMatch[1]) handleClosingTag()

      splitTemplateSegmentOnMatch(closeBracketMatch)
      findTag()
    }
  }

  const findTag = () => {
    mode = EvaluationMode.TAG

    // match to an opening html tag
    const tagMatch = templateSegment.match(/<(\/?)\s*([^\s/>]*)/)

    // no tag was found continue iterating over template strings and expressions
    if (!tagMatch) return 

    const [_, isClosingTag, tagName] = tagMatch

    if (!tagName) return

    const [ preTagText ] = splitTemplateSegmentOnMatch(tagMatch)
    
    if (preTagText) {
      const newText = preTagText.trim()

      if (newText) {
        elements[evaluatingElement].element.appendChild(document.createTextNode(preTagText as string))
      }
    }

    if (!isClosingTag && tagName) {
      // create a new element
      elements.push({
        element: document.createElement(tagName),
        isClosed: false,
      })
      evaluatingElement = elements.length - 1
      findAttributeName()
      return
    }

    if (isClosingTag && (tagName.toLocaleLowerCase() !== elements[evaluatingElement]?.element?.tagName.toLocaleLowerCase())) {
      throw new Error(`Error evaluating closing tag: ${tagMatch[0]}.  Closing tag does not match the open tag.`)
    }

    handleClosingTag()
    splitTemplateSegmentOnMatch(templateSegment.match(/^[^<>]*>/))
    findTag()
    return
  }

  const evaluateTemplateString = () => {
    switch (mode) {
      case EvaluationMode.TAG: {
        findTag()
        return
      }
      case EvaluationMode.ATTRIBUTE_NAME: {
        findAttributeName()
        return
      }
      case EvaluationMode.ATTRIBUTE_VALUE: {
        findAttributeValue()
        return
      }
      case EvaluationMode.ATTRIBUTE_VALUE_FROM_QUOTED_STRING: {
        findAttributeValueFromQuotedString()
        return
      }
    }
  }

  //iterate over template string and expressions
  for (let i = 0; i < templateStrings.length; i++) {
    templateSegment += templateStrings[i]
    evaluateTemplateString()
    evaluateExpression(templateExpressions[i])
  }

  if (elements.length === 0) throw new Error('No new nodes where generated.')

  return elements[0].element
}

export default html
