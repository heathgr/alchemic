import html from '@alchemic/html'
import updateTextArea from './updateTextArea'

describe('updateTextArea', () => {
  it('Should update text area values.', () => {
    const update = html`<textarea>updated value</textarea>` as HTMLTextAreaElement
    const existing = html`<textarea>value not updated</textarea>` as HTMLTextAreaElement

    updateTextArea(update, existing)
    expect(existing.value).toBe('updated value')
  })

  it('Should update empty text area values.', () => {
    const update = html`<textarea></textarea>` as HTMLTextAreaElement
    const existing = html`<textarea>value not updated</textarea>` as HTMLTextAreaElement
    
    updateTextArea(update, existing)
    expect(existing.value).toBe('')
  })

  it('Should do nothing if existing and update values are the same.', () => {
    const update = html`<textarea>same</textarea>` as HTMLTextAreaElement
    const existing = html`<textarea>same</textarea>` as HTMLTextAreaElement
    
    updateTextArea(update, existing)
    expect(existing.value).toBe('same')
  })

  it('Should support empty text area values on IE.', () => {
    const update = html`<textarea></textarea>` as HTMLTextAreaElement
    const existing = html`<textarea>value not updated</textarea>` as HTMLTextAreaElement
    
    existing.placeholder = 'value not updated'

    updateTextArea(update, existing)
    expect(existing.value).toBe('')
  })
})
