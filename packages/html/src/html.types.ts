export type FunctionExpression = (...args: unknown[]) => unknown

export type TemplateExpression = string | number | HTMLElement | DocumentFragment | undefined | boolean | FunctionExpression | TemplateExpression[]

// TODO swap html terminology for template terminology
export type HTMLParser = (templateStrings: TemplateStringsArray, ...templateExpressions: TemplateExpression[]) => HTMLElement | DocumentFragment

export type HTMLParserMathGroups = { fullMatch: string, tagName?: string, closing?: string, attributes?: string, isSelfClosing?: string }
