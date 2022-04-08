import html from '@alchemic/html'
import render from './render'
import mutateNode from './mutateNode'

describe('Diff tests.', () => {
  describe('root level nodes', () => {
    it('Should replace an element.', () => {
      const a = html`<p>hello world</p>`
      const b = html`<div>hello world</div>`
  
      render(a, b)
  
      expect(b.outerHTML).toBe('<div>hello world</div>')
    })
  
    xit('Should replace a comment?.', () => {})
  
    it('Should morph a node.', () => {
      const a = html`<p>hello world!</p>`
      const b = html`<p>hello you!!</p>`
  
      mutateNode(a, b)
  
      expect(b.outerHTML).toBe('<p>hello you!!</p>')
    })
  
    xit('should morph a node with namespaced attribute', () => {})
  })

  describe('nested nodes', () => {
    it('Should replace a child node with different tag names.', () => {
      const a = html`<main><p>hello world</p></main>`
      const b = html`<main><div>hello world</div></main>`
  
      render(a, b)
  
      expect(b.outerHTML).toBe('<main><p>hello world</p></main>')
    })

    it('Should replace a child node with the same tag names.', () => {
      const a = html`<main><p>hello world</p></main>`
      const b = html`<main><p>hello you</p></main>`
  
      render(a, b)
  
      expect(b.outerHTML).toBe('<main><p>hello world</p></main>')
    })

    it('Should not alter identical nodes.', () => {
      const a = html`<main><p>hello world</p></main>`
      const b = html`<main><p>hello world</p></main>`
  
      render(a, b)
  
      expect(b.outerHTML).toBe('<main><p>hello world</p></main>')
    })

    it('Should remove a node.', () => {
      const a = html`<main></main>`
      const b = html`<main><p>hello you</p></main>`
  
      render(a, b)
  
      expect(b.outerHTML).toBe('<main></main>')
    })

    it('Should append a node.', () => {
      const a = html`<main><p>hello you</p></main>`
      const b = html`<main></main>`
  
      render(a, b)
  
      expect(b.outerHTML).toBe('<main><p>hello you</p></main>')
    })

    it('Should replace children that are a different node type.', () => {
      const update = html`<section>'hello'</section>`
      const existing = html`<section><div></div></section>`
      const expected = update.outerHTML
    
      render(update, existing)
          
      expect(existing.outerHTML).toBe(expected)
    })
  })

  describe('attributes', () => {
    it('Should remove attributes from existing nodes if the update has no attributes.', () => {
      const existing = html`<input type="text" value="howdy" />`
      const update = html`<input type="text" />`

      render(update, existing)

      expect(existing.hasAttribute('value')).toBe(false)
    })

    it('Should set attributes to null.', () => {
      const existing = html`<input type="text" value="howdy" />`
      const update = html`<input type="text" value=${null} />`

      render(update, existing)

      expect(existing.hasAttribute('value')).toBe(false)
    })

    it('Should modify attributes that already exists on update and existing.', () => {
      const existing = html`<input type="text" value="howdy" />`
      const update = html`<input type="text" value="hi" />`

      render(update, existing)

      expect(existing.getAttribute('value')).toBe('hi')
    })

    it('Should add attributes that exists on update and not existing.', () => {
      const existing = html`<input type="text" />`
      const update = html`<input type="text" value="hi" />`

      render(update, existing)

      expect(existing.getAttribute('value')).toBe('hi')
    })

    const booleanAttributeTest = (testProperty: 'checked' | 'disabled') => {
      it(`Should add ${testProperty} to the existing node if it is on the update node.`, () => {
        const existing = html`<input type="checkbox" />`
        const update = html`<input type="checkbox" ${testProperty}=${true} />`

        render(update, existing)

        expect(existing.hasAttribute(testProperty)).toBeTruthy()
      })

      it(`Should remove ${testProperty} from the existing node if it is not on the update node.`, () => {
        const existing = html`<input type="checkbox" ${testProperty}=${true} />`
        const update = html`<input type="checkbox"  />`

        render(update, existing)

        expect(existing.hasAttribute(testProperty)).toBeFalsy()
      })

      it(`Should modify ${testProperty} on the existing node if it is also on the update node.`, () => {
        const existing = html`<input type="checkbox" ${testProperty}=${false} />`
        const update = html`<input type="checkbox"  ${testProperty}=${true}/>`

        render(update, existing)

        expect(existing.hasAttribute(testProperty)).toBeTruthy()
      })

      it(`Should modify ${testProperty} on the existing node if it is also on the update node.`, () => {
        const existing = html`<input type="checkbox" ${testProperty}=${true} />`
        const update = html`<input type="checkbox"  ${testProperty}=${false}/>`

        render(update, existing)

        expect(existing.hasAttribute(testProperty)).toBeFalsy()
      })
    }

    booleanAttributeTest('checked')
    booleanAttributeTest('disabled')

    it('Should update the intermediate attribute.', () => {
      const existing = html`<input type="checkbox" />` as HTMLInputElement
      const update = html`<input type="checkbox" />` as HTMLInputElement

      update.indeterminate = true
      render(update, existing)

      expect(existing.indeterminate).toBe(true)
    })

    it('Should update the intermediate attribute.', () => {
      const existing = html`<input type="checkbox" />` as HTMLInputElement
      const update = html`<input type="checkbox" />` as HTMLInputElement

      update.indeterminate = false
      render(update, existing)

      expect(existing.indeterminate).toBe(false)
    })
  })

  describe('lists', () => {
    it('Should add option nodes to existing node.', () => {
      const existing = html`<select></select>`
      const update = html`<select><option>1</option><option>2</option><option>3</option><option>4</option></select>`

      render(update, existing)

      expect(existing.outerHTML).toBe('<select><option>1</option><option>2</option><option>3</option><option>4</option></select>')
    })

    it('Should remove option nodes from existing node.', () => {
      const existing = html`<select><option>1</option><option>2</option><option>3</option><option>4</option></select>`
      const update = html`<select></select>`

      render(update, existing)

      expect(existing.outerHTML).toBe('<select></select>')
    })

    it('Should add the selected attribute.', () => {
      const existing = html`<select><option>1</option><option>2</option></select>`
      const update = html`<select><option>1</option><option selected>2</option></select>`

      render(update, existing)

      expect(existing.outerHTML).toBe(update.outerHTML)
    })

    it('Should add the selected attribute (xml style).', () => {
      const existing = html`<select><option>1</option><option>2</option></select>`
      const update = html`<select><option>1</option><option selected="selected">2</option></select>`

      render(update, existing)

      expect(existing.outerHTML).toBe('<select><option>1</option><option selected="selected">2</option></select>')
    })

    it('Should switch the selected attribute.', () => {
      const existing = html`<select><option selected="selected">1</option><option>2</option></select>`
      const update = html`<select><option>1</option><option selected="selected">2</option></select>`

      render(update, existing)

      expect(existing.outerHTML).toBe('<select><option>1</option><option selected="selected">2</option></select>')
    })

    it('Should replace child nodes so that existing matches the update.', () => {
      const existing = html`<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`
      const update = html`<ul><div>1</div><li>2</li><p>3</p><li>4</li><li>5</li></ul>`

      render(update, existing)

      expect(existing.outerHTML).toBe('<ul><div>1</div><li>2</li><p>3</p><li>4</li><li>5</li></ul>')
    })

    it('Should replace child nodes over multiple iterations.', () => {
      const existing = html`<ul></ul>`
      const update = html`<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`

      render(update, existing)

      expect(existing.outerHTML).toBe('<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>')

      const update2 = html`<ul><div>1</div><li>2</li><p>3</p><li>4</li><li>5</li></ul>`

      render(update2, existing)

      expect(existing.outerHTML).toBe('<ul><div>1</div><li>2</li><p>3</p><li>4</li><li>5</li></ul>')
    })
  })

  describe('element reordering', () => {
    it('Should add new child nodes to existing nodes and use the id attribute to reorder.', () => {
      const existing = html`<ul>
        <li id="a"></li>
        <li id="b"></li>
        <li id="c"></li>
      </ul>`
      const update = html`<ul>
        <li id="a"></li>
        <li id="new"></li>
        <li id="b"></li>
        <li id="c"></li>
      </ul>`

      const oldFirst = existing.children[0]
      const oldSecond = existing.children[1]
      const oldThird = existing.children[2]
      const expected = update.outerHTML

      render(update, existing)

      expect(oldFirst).toEqual(existing.children[0])
      expect(oldSecond).toEqual(existing.children[2])
      expect(oldThird).toEqual(existing.children[3])
      expect(existing.outerHTML).toBe(expected)
    })

    it('Should add new child nodes to existing nodes and handle elements with no id.', () => {
      const existing = html`<ul>
        <li></li>
        <li id="a"></li>
        <li id="b"></li>
        <li id="c"></li>
        <li></li>
      </ul>`
      const update = html`<ul>
        <li></li>
        <li id="a"></li>
        <li id="new"></li>
        <li id="b"></li>
        <li id="c"></li>
        <li></li>
      </ul>`

      const oldSecond = existing.children[1]
      const oldThird = existing.children[2]
      const oldForth = existing.children[3]
      const expected = update.outerHTML

      render(update, existing)

      expect(oldSecond).toEqual(existing.children[1])
      expect(oldThird).toEqual(existing.children[3])
      expect(oldForth).toEqual(existing.children[4])
      expect(existing.outerHTML).toEqual(expected)
    })

    it('Should remove child nodes from existing nodes and use the id attribute to reorder.', () => {
      const existing = html`<ul><li id="a"></li><li id="b"></li><li id="c"></li></ul>`
      const update = html`<ul><li id="c"></li><li id="a"></li></ul>`

      const oldFirst = existing.children[0]
      const oldThird = existing.children[2]
      const expected = update.outerHTML

      render(update, existing)

      expect(oldFirst).toEqual(existing.children[1])
      expect(oldThird).toEqual(existing.children[0])
      expect(existing.outerHTML).toBe(expected)
    })

    it('Should remove orphaned id nodes.', () => {
      const existing = html`
        <div>
          <div>1</div>
          <li id="a">a</li>
        </div>
      `
      const update = html`
        <div>
          <div>2</div>
          <li id="b">b</li>
        </div>
      `
      const expected = update.outerHTML

      render(update, existing)

      expect(existing.outerHTML).toBe(expected)
    })
  })
})
