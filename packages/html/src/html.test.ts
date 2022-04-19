/* eslint-disable import/no-extraneous-dependencies */
import html from './html'
import format from 'diffable-html'

describe('html', () => {
  describe('Template Parsing.', () => {
    afterEach(() => {
      document.body.innerHTML = ''
    })
  
    const testCases = [
      {
        theSubject: 'Should parse simple html elements with no attributes.',
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
        theSubject: 'Should parse a single element.',
        template: () => html`
          <div></div>
        `,
        expected: '<div></div>',
      },

      {
        theSubject: 'Should parse opening tags with whitespace around a tag name.',
        template: () => html`
          <  div  ></ div >
        `,
        expected: '<div></div>',
      },
      
      {
        theSubject: 'Should parse number template expressions.',
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
        theSubject: 'Should parse tags defined by expressions.',
        template: () => html`
          <div>
            <${'h1'}>I am a header!!!</${'h1'}>
            <p>I am a paragraph.</p>
          </div>
        `,
        expected: `
        <div>
          <${'h1'}>I am a header!!!</${'h1'}>
          <p>I am a paragraph.</p>
        </div>
        `,
      },

      {
        theSubject: 'Should parse self closing tags.',
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
        theSubject: 'Should parse only one self closing tag.',
        template: () => html`
          <div />
        `,
        expected: `
          <div></div>
        `,
      },

      {
        theSubject: 'Should ignore elements that are part of a false conditional expressions.',
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
        theSubject: 'Should not ignore elements that are part of a true conditional expressions.',
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
        theSubject: 'Should parse template expressions.',
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

      {
        theSubject: 'Should ignore invalid objects.',
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
        theSubject: 'Should parse an array of template expressions.',
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
        theSubject: 'Should parse an array of string expressions.',
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
        theSubject: 'Should parse an array of mixed type expressions.',
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
        theSubject: 'Should parse attributes.',
        template: () => html`
          <div class='test-class' id='my-id'>Test Content</div>
        `,
        expected: `
          <div class="test-class" id="my-id">Test Content</div>
        `,
      },

      {
        theSubject: 'Should parse attributes with spaces.',
        template: () => html`
          <div class= 'test-class' id   =  'my-id'>Test Content</div>
        `,
        expected: `
          <div class="test-class" id="my-id">Test Content</div>
        `,
      },

      {
        theSubject: 'Should parse attributes with whitespace.',
        template: () => html`
          <div
            class=
            'test-class'
            id   =  'my-id'>Test Content</div>
        `,
        expected: `
          <div class="test-class" id="my-id">Test Content</div>
        `,
      },

      {
        theSubject: 'Should parse an input element\'s value attribute.',
        template: () => html`<input value="test value" />`,
        expected: '<input value="test value"/>',
      },

      {
        theSubject: 'Should parse attributes with self closing tags.',
        template: () => html`
          <main>
            <div class='test-class' id='my-id' xmlns='http://example.com/namespace'/>
          </main>
        `,
        expected: `
        <main>
          <div class='test-class' id='my-id' xmlns='http://example.com/namespace'></div>
        </main>
        `,
      },

      // TODO revisit tests with escaped characters
      {
        theSubject: 'Should parse attributes with escaped quotes.',
        template: () => html`
          <input value="I like \\"quoted words\\"" />
        `,
        expected: `
          <input value="I like \\&quot;quoted words\\&quot;">
        `,
      },

      {
        theSubject: 'Should parse attributes with single quotes.',
        template: () => html`
          <input value='single quote value' />
        `,
        expected: `
          <input value="single quote value">
        `,
      },

      // TODO revisit tests with escaped characters
      {
        theSubject: 'Should parse attributes with escaped single quotes.',
        template: () => html`
          <input value='single \\'quote\\' value' />
        `,
        expected: `
          <input value="single \\'quote\\' value">
        `,
      },
      
      {
        theSubject: 'Should parse attributes with no quotes.',
        template: () => html`
          <input value=unquoted-value />
        `,
        expected: `
          <input value="unquoted-value">
        `,
      },

      {
        theSubject: 'Should parse attributes with an explicit true value.',
        template: () => html`
          <option value='test' selected="true"/>
        `,
        expected: `
          <option value='test' selected="true" />
        `,
      },

      {
        theSubject: 'Should parse attributes with an implicit true value.',
        template: () => html`
          <option value='test' selected />
        `,
        expected: `
          <option value='test' selected />
        `,
      },

      // TODO revisit tests with escaped characters
      {
        theSubject: 'Should parse attribute expressions with escaped single quotes.',
        template: () => html`
          <input value="${'I like \'quoted words\''}" />
        `,
        expected: `
          <input value="I like 'quoted words'">
        `,
      },

      // {
      //   theSubject: 'Should parse attribute expressions with escaped double quotes.',
      //   template: () => html`
      //     // eslint-disable-next-line @typescript-eslint/quotes
      //     <input value='${"I like \"quoted words\""}' />
      //   `,
      //   expected: `
      //     <input value="I like 'quoted words'">
      //   `,
      // },
      
      {
        theSubject: 'Should parse attributes that have expressions.',
        template: () => html`
          <div class='some-class-${2 + 10}' id="${'my-id-from-expression'}">Test Content</div>
        `,
        expected: `
          <div class="some-class-12" id="my-id-from-expression">Test Content</div>
        `,
      },

      {
        theSubject: 'Should parse attributes with a true expression.',
        template: () => html`
          <option value='test' selected=${true} />
        `,
        expected: `
          <option value='test' selected />
        `,
      },

      {
        theSubject: 'Should parse attributes with an explicit false value.',
        template: () => html`
          <option value='test' selected='false'/>
        `,
        expected: `
          <option value='test' selected="false" />
        `,
      },

      {
        theSubject: 'Should remove attributes with a false expression.',
        template: () => html`
          <option value='test' selected=${false} />
        `,
        expected: `
          <option value='test' />
        `,
      },

      {
        theSubject: 'Should remove attributes with an undefined expression.',
        template: () => html`
          <option value='test' selected=${undefined} />
        `,
        expected: `
          <option value='test' />
        `,
      },

      {
        theSubject: 'Should remove attributes with a null expression.',
        template: () => html`
          <option value='test' selected=${null} />
        `,
        expected: `
          <option value='test' />
        `,
      },

      {
        theSubject: 'Should parse selected attributes',
        template: () =>html`
        <select><option>1</option><option selected>2</option></select>
      `, 
        expected: `
          <select><option>1</option><option selected >2</option></select>
        `,
      },

      {
        theSubject: 'Should ignore attributes with a function that is not a valid event handler.',
        template: () => html`
          <button onawesome=${() => null} style=${() => null} />
        `,
        expected: `
          <button />
        `,
      },
  
      {
        theSubject: 'Should sanitize template expressions to prevent html injection.',
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
        theSubject: 'Should parse inline styles.',
        template: () => html`<div style="color:red;"></div>`,
        expected: `
          <div style="color:red;"></div>
        `,
      },

      {
        theSubject: 'Should parse tags that are declared on multiple lines.',
        template: () => html`
          <div
            id="test-class"
            style="color:red;"
          >Content and stuff</div>`,
        expected: `
          <div id="test-class" style="color:red;">Content and stuff</div>
        `,
      },

      {
        theSubject: 'Should parse tags with expressions in attribute names.',
        template: () => html`
          <div s${'ty'}le="color:red;">Test content</div>`,
        expected: `
          <div style="color:red;">Test content</div>
        `,
      },

      {
        theSubject: 'Should parse tags with expressions in attribute names.',
        template: () => html`
          <div id=${'test-id'} s${'ty'}l${'e'}="color:red;">Test content</div>`,
        expected: `
          <div id="test-id" style="color:red;">Test content</div>
        `,
      },

      // {
      //   theSubject: 'Should not break.',
      //   template: () => html`
      //     <div id=>Test content</div>`,
      //   expected: `
          
      //   `,
      // },
    ]
    
    testCases.forEach(
      ({ theSubject, template, expected }) => {
        it(theSubject, () => {
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
          <button onclick=${eventHandler}>Click Me!</button>
      ` as HTMLElement

      document.body.appendChild(template)
      
      const testButton = document.querySelector('button') as HTMLElement

      testButton.click()

      expect(eventHandler).toHaveBeenCalledTimes(1)
    })
  })

  describe('Error Handling.', () => {
    const testCases = [
      {
        theSubject: 'Should throw an error if closing and opening tags do not match.',
        template: () => html`<div><h1></div></h1>`,
        expected: 'Error evaluating tag: </div>.  Closing tag does not match the open tag.',
      },
      {
        // TODO this feature will be supported in the future.
        theSubject: 'Should throw an error if there is more than one root element.',
        template: () => html`<div></div><h1></h1>`,
        expected: 'The template should have a single root node.',
      },
      {
        theSubject: 'Should throw an error if there are unclosed tags.',
        template: () => html`<main><div><h1></main>`,
        expected: 'Error evaluating tag: </main>.  Closing tag does not match the open tag.',
      },
      {
        theSubject: 'Should throw an error if there is a closing tag with no open tag.',
        template: () => html`</main><h1></h1>`,
        expected: 'Error evaluating tag: </main>.  Closing tag does not match the open tag.',
      },
      {
        theSubject: 'Should throw an error if there is no tag name.',
        template: () => html`<></>`,
        expected: 'Error evaluating tag: <>.  There is no tag name.',
      },
      {
        theSubject: 'Should throw an error there is an invalid tag name.',
        template: () => html`<@!></@!>`,
        expected: '',
      },
      {
        theSubject: 'Should throw an error if no nodes are generated.',
        template: () => html``,
        expected: 'The template should have a single root node.',
      },
    ]

    testCases.forEach(
      ({ theSubject, template, expected }) => {
        xit(theSubject, () => {
          expect(() => template()).toThrowError(expected)
        })
      },
    )
  })
})
