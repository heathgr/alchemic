// import toDiffableHtml from 'diffable-html'
import html from './html'

describe('html', () => {
  it('Should run.', () => {
    const test = html`
    <div>
      <h1>Header</h1>
      <p>Blah blah blah</p>
      <p>More blah <span>blah</span></p>
    </div>
    `

    document.body.appendChild(test)

    console.log('html: ', document.body.outerHTML)

    expect(test).not.toBe(null)
  })
})
