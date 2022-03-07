export type FunctionExpression = (...args: unknown[]) => unknown

export type TemplateExpression = string | number | HTMLElement | undefined | FunctionExpression | TemplateExpression[]

export type HTMLParsingElement = HTMLElement | DocumentFragment

export type HTMLParser = (templateStrings: TemplateStringsArray, ...templateExpressions: TemplateExpression[]) => HTMLParsingElement

export type HTMLParserMathGroups = { fullMatch: string, tagName?: string, closing?: string, attributes?: string }

export interface HTMLParserContext {
  elementStack: HTMLElement[],
  templateString: string,
}
