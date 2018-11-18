export default class DragInfo {
   constructor({dragElement = {}, mouseX, mouseY}) {
      this.dragElement = dragElement
      this.avatar = null
      this.dragItemsList = []
      this.mouseX = mouseX
      this.mouseY = mouseY
      this.shiftY = this.mouseY - this.dragElement.offsetTop
   }

   static getDraggableElement(elem) {
      const result = elem.closest('.draggable')
      return result && !result.classList.contains('avatar') ? result : null
   }
}