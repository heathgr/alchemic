import nodesAreSame from './nodesAreSame'

describe('nodesAreSame', () => {
  it('Should return true if the nodes ids are the same.', () => {
    const a = document.createElement('span')
    const b = document.createElement('span')

    a.id = 'test'
    b.id = 'test'

    expect(nodesAreSame(a, b)).toBeTruthy()
  })

  it('Should return false if the nodes ids are not the same.', () => {
    const a = document.createElement('span')
    const b = document.createElement('span')

    a.id = 'test'
    b.id = 'test-not-matching-a'

    expect(nodesAreSame(a, b)).toBeFalsy()
  })

  it('Should return false if both nodes tag names do not match.', () => {
    const a = document.createElement('span')
    const b = document.createElement('main')

    expect(nodesAreSame(a, b)).toBeFalsy()
  })

  it('Should return false if both nodes are text nodes and their values do not match.', () => {
    const a = document.createTextNode('test value')
    const b = document.createTextNode('test value that does not match a')

    expect(nodesAreSame(a, b)).toBeFalsy()
  })

  it('Should return true if both nodes are text nodes and their values match.', () => {
    const a = document.createTextNode('test value')
    const b = document.createTextNode('test value')

    expect(nodesAreSame(a, b)).toBeTruthy()
  })

  it('Should return false by default.', () => {
    const a = document.createElement('span')
    const b = document.createElement('span')

    expect(nodesAreSame(a, b)).toBeFalsy()
  })
})
