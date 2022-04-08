const sanitizeHtmlExpression = (expression: string) => expression
  .replace(/</g, '&#60;')
  .replace(/>/g, '&#62;')
  .replace(/\(/g, '&#40;')
  .replace(/\)/g, '&#41;')
  .replace(/{/g, '&#123;')
  .replace(/}/g, '&#125;')
  .replace(/=/g, '&#61;')

export default sanitizeHtmlExpression
