/* eslint-disable import/no-extraneous-dependencies */
import html from './html'
import format from 'diffable-html'

describe('html', () => {
  const testCases = [
    {
      theFunction: 'Should parse simple html elements with no attributes.',
      actual: html`
      <div>
        <h1>Header</h1>
        <p>Blah blah blah</p>
        <p>More blah <span>blah</span></p>
      </div>`,
      expected: `
      <div>
        <h1>Header</h1>
        <p>Blah blah blah</p>
        <p>More blah <span>blah</span></p>
      </div>
      `,
    },

    {
      theFunction: 'Should parse a single element.',
      actual: html`<div></div>`,
      expected: '<div></div>',
    },

    {
      theFunction: 'Should parse an empty string.',
      actual: html``,
      expected: '',
    },

    {
      theFunction: 'Should parse number template expressions.',
      actual: html`
        <div>
          <h1>First Special Number!</h1>
          <p>Special Number ${6 * 7}</p>
          <h1>Second Special Number!</h1>
          <p>Special Number ${12 - 4}</p>
        </div>
      `,
      expected: `
        <div>
          <h1>First Special Number!</h1>
          <p>Special Number 42</p>
          <h1>Second Special Number!</h1>
          <p>Special Number 8</p>
        </div>
      `,
    },

    {
      theFunction: 'Should parse number template expressions.',
      actual: html`
        <div>
          <h1>First Special Number!</h1>
          <p>Special Number ${6 * 7}</p>
          <h1>Second Special Number!</h1>
          <p>Special Number ${12 - 4}</p>
        </div>
      `,
      expected: `
        <div>
          <h1>First Special Number!</h1>
          <p>Special Number 42</p>
          <h1>Second Special Number!</h1>
          <p>Special Number 8</p>
        </div>
      `,
    },

    {
      theFunction: 'Should parse tag attributes.',
      actual: html`
        <div class='test-class' id='my-id'>Test Content</div>
      `,
      expected: `
        <div class="test-class" id="my-id">Test Content</div>
      `,
    },

    {
      theFunction: 'Should parse tag attributes that have expressions.',
      actual: html`
        <div class='test-class' id=${'my-id'}>Test Content</div>
      `,
      expected: `
        <div class="test-class" id="my-id">Test Content</div>
      `,
    },
  ]
  
  testCases.forEach(
    ({ theFunction, actual, expected }) => {
      it(theFunction, () => {
        document.body.appendChild(actual)

        expect(format(document.body.innerHTML)).toBe(format(expected))
        document.body.innerHTML = ''
      })
    },
  )

  it('Should throw an error if closing and opening tags do not match.', () => {    
    expect(() => html`<div><h1></div></h1>`).toThrow()
  })
})
