import walk from './walk'
import * as walkChildren from './walkChildren'
import * as mutateNode from './mutateNode'

describe('walk', () => {
  it('Should return the update node if the existing node is nullish.', () => {
    const updateNode = document.createElement('h1')
    const existingNode = null
    const actual = walk(updateNode, existingNode)

    expect(actual).toEqual(updateNode)
  })

  it('Should return null if the update node is nullish.', () => {
    const updateNode = undefined
    const existingNode = document.createElement('div')
    const actual = walk(updateNode, existingNode)

    expect(actual).toEqual(null)
  })

  it('Should return the update node if both node tag names do not match.', () => {
    const updateNode = document.createElement('h1')
    const existingNode = document.createElement('div')
    const actual = walk(updateNode, existingNode)

    expect(actual).toEqual(updateNode)
  })

  it('Should return the existing node, invoke walkChildren, and invoke mutateNode if both node tag names match.', () => {
    const updateNode = document.createElement('h2')
    const existingNode = document.createElement('h2')
    const walkChildrenSpy = jest.spyOn(walkChildren, 'default')
    const mutateNodeSpy = jest.spyOn(mutateNode, 'default')
    const actual = walk(updateNode, existingNode)

    expect(mutateNodeSpy).toHaveBeenCalledWith(updateNode, existingNode)
    expect(walkChildrenSpy).toHaveBeenCalledWith(updateNode, existingNode)
    expect(actual).toEqual(existingNode)
  })
})
