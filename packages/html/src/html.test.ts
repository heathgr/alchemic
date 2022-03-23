/* eslint-disable import/no-extraneous-dependencies */
import html from './html'
import format from 'diffable-html'

// TODO test and make sure inline styles will be supported
describe('html', () => {
  describe('Template Parsing.', () => {
    afterEach(() => {
      document.body.innerHTML = ''
    })
  
    const testCases = [
      {
        theFunction: 'Should parse simple html elements with no attributes.',
        template: () => html`
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
        template: () => html`
          <div></div>
        `,
        expected: '<div></div>',
      },
  
      {
        theFunction: 'Should parse number template expressions.',
        template: () => html`
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
        template: () => html`
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
        template: () => html`
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
        template: () => html`
          <div />
        `,
        expected: `
          <div></div>
        `,
      },
  
      {
        theFunction: 'Should ignore elements that are part of a false conditional expressions.',
        template: () => html`
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
        template: () => html`
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
        template: () => html`
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
      
      // TODO reword/rework this test
      {
        theFunction: 'Should parse template expressions with malformed html.',
        template: () => html`
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
        template: () => html`
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
        template: () => html`
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
        template: () => html`
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
        template: () => html`
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
        template: () => html`
          <div class='test-class' id='my-id'>Test Content</div>
        `,
        expected: `
          <div class="test-class" id="my-id">Test Content</div>
        `,
      },
  
      {
        theFunction: 'Should parse attributes that have expressions.',
        template: () => html`
          <div class='some-class-${2 + 10}' id="${'my-id-from-expression'}">Test Content</div>
        `,
        expected: `
          <div class="some-class-12" id="my-id-from-expression">Test Content</div>
        `,
      },
  
      {
        theFunction: 'Should sanitize template expressions to prevent html injection.',
        template: () => html`
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

      {
        theFunction: 'Should parse attribute name spaces.',
        template: () => html`<svg xmlns="http://www.w3.org/2000/svg" xmlns:test="http://www.example.com/test" width="40" height="40"></svg>`,
        expected: `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:test="http://www.example.com/test" width="40" height="40"></svg>
        `,
      },

      {
        theFunction: 'Should parse inline styles.',
        template: () => html`<div style="color:red;"></div>`,
        expected: `
          <div style="color:red;"></div>
        `,
      },
    ]
    
    testCases.forEach(
      ({ theFunction, template, expected }) => {
        it(theFunction, () => {
          document.body.appendChild(template())
  
          expect(format(document.body.innerHTML)).toBe(format(expected))
        })
      },
    )
  })

  describe('Event handling.', () => {
    // TODO more detailed event handler tests.
    it('Should handle onclick events.', () => {
      const eventHandler = jest.fn()
      const template = html`
        <div>
          <button onclick=${eventHandler} data-testid="test-button">Click Me!!!</button>
        </div>
      ` as HTMLElement

      document.body.appendChild(template)
      
      const testButton = document.querySelector('[data-testid="test-button"]') as HTMLElement

      testButton.click()

      expect(eventHandler).toHaveBeenCalledTimes(1)
    })
  })

  describe('Error Handling.', () => {
    // malformed attributes test
    it('Should throw an error if closing and opening tags do not match.', () => {    
      expect(() => html`<div><h1></div></h1>`).toThrowError('Invalid HTML: There is a mismatch between opening and closing tags.')
    })

    // TODO this feature will be supported in the future.
    it('Should throw an error if there is more than one root element.', () => {    
      expect(() => html`<div></div><h1></h1>`).toThrowError('It is broke!!')
    })

    it('Should throw an error if there are unclosed tags.', () => {    
      expect(() => html`<main><div><h1></main>`).toThrowError('Invalid HTML: There is a mismatch between opening and closing tags.')
    })

    it('Should throw an error if there are unclosed tags.', () => {    
      expect(() => html`<main><div><h1></main>`).toThrowError('Invalid HTML: There is a mismatch between opening and closing tags.')
    })

    it('Should throw an error if there is a closing tag with no open tag.', () => {    
      expect(() => html`</main><h1></h1>`).toThrowError('Invalid HTML: There is a mismatch between opening and closing tags.')
    })

    // TODO rethink this a template might be empty it relies on a conditional statement.
    it('Should throw an error if no nodes are generated.', () => {    
      expect(() => html``).toThrowError('It is broke!!')
    })
  })
})
