export type FunctionExpression = (...args: unknown[]) => unknown
export type TemplateExpression = string | number | HTMLElement | DocumentFragment | undefined | boolean | FunctionExpression | TemplateExpression[]
export type TemplateParser = (templateStrings: TemplateStringsArray, ...templateExpressions: TemplateExpression[]) => HTMLElement | DocumentFragment
export type TemplateTagMatcherGroups = { fullMatch: string, tagName?: string, closing?: string, attributes?: string, isSelfClosing?: string }
