import sanitizeHtmlExpression from './sanitizeHtmlExpression'

describe('sanitizeHtmlExpression', () => {
  it('Should replace all characters in the string with html entities that could be used to represent html tags or javascript.', () => {
    const actual = sanitizeHtmlExpression('<>()={}<>(){}=<>do not replace regular text')
    const expected = '&#60;&#62;&#40;&#41;&#61;&#123;&#125;&#60;&#62;&#40;&#41;&#123;&#125;&#61;&#60;&#62;do not replace regular text'

    expect(actual).toBe(expected)
  })
})
