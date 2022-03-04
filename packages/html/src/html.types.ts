export type FunctionExpression = (...args: unknown[]) => unknown

export type TemplateExpression = string | number | HTMLElement | undefined | FunctionExpression | TemplateExpression[]

export type HTMLParsingElement = HTMLElement | DocumentFragment

export type HTMLParser = (templateStrings: TemplateStringsArray, ...templateExpressions: TemplateExpression[]) => HTMLParsingElement

export interface HTMLParserContext {
  elementStack: HTMLParsingElement[],
  templateString: string,
}
