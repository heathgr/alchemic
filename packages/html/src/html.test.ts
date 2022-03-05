/* eslint-disable import/no-extraneous-dependencies */
import html from './html'
import format from 'diffable-html'

describe('html', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('Should parse simple html elements with no attributes.', () => {
    const actual = html`
    <div>
      <h1>Header</h1>
      <p>Blah blah blah</p>
      <p>More blah <span>blah</span></p>
    </div>
    `
    const expected = `
      <div>
        <h1>Header</h1>
        <p>Blah blah blah</p>
        <p>More blah <span>blah</span></p>
      </div>
    `
    document.body.appendChild(actual)
    
    expect(format(document.body.innerHTML)).toBe(format(expected))
  })

  it('Should parse a single element.', () => {
    const actual = html`
    <div></div>
    `
    const expected = `
      <div></div>
    `
    document.body.appendChild(actual)
    
    expect(format(document.body.innerHTML)).toBe(format(expected))
  })

  it('Should parse an empty string.', () => {
    const actual = html``
    const expected = ''
    document.body.appendChild(actual)
    
    expect(format(document.body.innerHTML)).toBe(format(expected))
  })

  it('Should correctly handle number template expressions.', () => {
    const actual = html`
      <div>
        <h1>First Special Number!</h1>
        <p>Special Number ${6 * 7}</p>
        <h1>Second Special Number!</h1>
        <p>Special Number ${12 - 4}</p>
      </div>
    `
    const expected = `
      <div>
        <h1>First Special Number!</h1>
        <p>Special Number 42</p>
        <h1>Second Special Number!</h1>
        <p>Special Number 8</p>
      </div>
    `

    document.body.appendChild(actual)
    
    expect(format(document.body.innerHTML)).toBe(format(expected))
  })

  it('Should throw an error if closing and opening tags do not match.', () => {    
    expect(() => html`<div><h1></div></h1>`).toThrow()
  })
})
