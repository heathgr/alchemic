import { eventList } from '@alchemic/utilities'

// if new element has a whitelisted attribute
// update existing element
// if existing element has it and new one doesn't
// remove it from existing element
export default (updateNode: HTMLElement, existingNode: HTMLElement) => {
  for (let i = 0; i < eventList.length; i++) {
    if (updateNode[eventList[i]]) {                                                     
      (existingNode[eventList[i]] as unknown) = (updateNode[eventList[i]] as unknown)   
    } else if (existingNode[eventList[i]]) {                                            
      existingNode[eventList[i]] = null                                                 
    }
  }
}
