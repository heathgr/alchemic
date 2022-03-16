/* eslint-disable import/no-extraneous-dependencies */
import html from './html'
import format from 'diffable-html'

describe('html', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

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
      theFunction: 'Should parse tags defined by expressions.',
      actual: html`
        <div>
          <${'h1'}>I am a header!!!</${'h1'}>
          <p>I am a paragraph.</p>
        </div>
      `,
      expected: `
        <div>
          <h1>I am a header!!!</h1>
          <p>I am a paragraph.</p>
        </div>
      `,
    },

    {
      theFunction: 'Should parse self closing tags.',
      actual: html`
        <div>
          <div/>
          <img/>
        </div>
      `,
      expected: `
        <div>
          <div></div>
          <img></img>
        </div>
      `,
    },

    {
      theFunction: 'Should parse only one self closing tag.',
      actual: html`
        <div />
      `,
      expected: `
        <div></div>
      `,
    },

    {
      theFunction: 'Should ignore elements that are part of a false conditional expressions.',
      actual: html`
        <div>
          ${ false && html`<h1>You will not see me!</h1>`}
        </div>
      `,
      expected: `
        <div></div>
      `,
    },

    {
      theFunction: 'Should not ignore elements that are part of a true conditional expressions.',
      actual: html`
        <div>
          ${ true && html`<h1>You will see me!</h1>`}
        </div>
      `,
      expected: `
        <div>
          <h1>You will see me!</h1>
        </div>
      `,
    },

    {
      theFunction: 'Should parse template expressions.',
      actual: html`
        <section>
          ${html`<h1>Nested Header!</h1>`}
          ${html`<p>Nested Paragraph!</p>`}
        </section>
      `,
      expected: `
        <section>
          <h1>Nested Header!</h1>
          <p>Nested Paragraph!</p>
        </section>
      `,
    },

    {
      theFunction: 'Should parse template expressions with malformed html.',
      actual: html`
        <main>
          <div class= "stuff" ${html`<p>test</p>`}
        </main>
      `,
      expected: `
        <main>
          &lt;div class= "stuff"
          <p>test</p>
        </main>
      `,
    },

    {
      theFunction: 'Should ignore invalid objects.',
      actual: html`
        <section>
          ${html`<h1>Some Header!</h1>`}
          ${{ obj: 'invalid' } as unknown as HTMLElement}
        </section>
      `,
      expected: `
        <section>
          <h1>Some Header!</h1>
        </section>
      `,
    },

    {
      theFunction: 'Should parse an array of template expressions.',
      actual: html`
        <ul>
          ${['one', 'two', 'three'].map(x => html`<li>${x}</li>`)}
        </ul>
      `,
      expected: `
        <ul>
          <li>one</li>
          <li>two</li>
          <li>three</li>
        </ul>
      `,
    },

    {
      theFunction: 'Should parse an array of string expressions.',
      actual: html`
        <p>
          ${['Hello ', 'there ', ':)']}
        </p>
      `,
      expected: `
        <p>
          Hello there :&amp;#41;
        </p>
      `,
    },

    {
      theFunction: 'Should parse an array of mixed type expressions.',
      actual: html`
        <div>
          ${['Hello ', ['there every ', 1], html`<p class="bold">I like turtles.</p>`]}
        </div>
      `,
      expected: `
        <div>
          Hello there every 1
          <p class="bold">I like turtles.</p>
        </div>
      `,
    },

    {
      theFunction: 'Should parse attributes.',
      actual: html`
        <div class='test-class' id='my-id'>Test Content</div>
      `,
      expected: `
        <div class="test-class" id="my-id">Test Content</div>
      `,
    },

    {
      theFunction: 'Should parse attributes that have expressions.',
      actual: html`
        <div class='some-class-${2 + 10}' id="${'my-id-from-expression'}">Test Content</div>
      `,
      expected: `
        <div class="some-class-12" id="my-id-from-expression">Test Content</div>
      `,
    },

    {
      theFunction: 'Should sanitize template expressions to prevent html injection.',
      actual: html`
        <div>
          <h1>Do Not Get Hacked!!!</h1>
          ${'<img src="x" onerror="alert(\'XSS Attack\')"></img>'}
        </div>
      `,
      expected: `
      <div>
        <h1>Do Not Get Hacked!!!</h1>
        &amp;#60;img src&amp;#61;"x" onerror&amp;#61;"alert&amp;#40;'XSS Attack'&amp;#41;"&amp;#62;&amp;#60;/img&amp;#62;
      </div>
      `,
    },
  ]
  
  testCases.forEach(
    ({ theFunction, actual, expected }) => {
      it(theFunction, () => {
        document.body.appendChild(actual)

        expect(format(document.body.innerHTML)).toBe(format(expected))
      })
    },
  )

  // event handlers

  // more malformed tag tests
  // malformed attributes test
  it('Should throw an error if closing and opening tags do not match.', () => {    
    expect(() => html`<div><h1></div></h1>`).toThrow()
  })
})
