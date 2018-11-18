import React from 'react'
import {connect} from 'react-redux'
import './PointsManager.css'
import Point from "../Point/Point";
import PointCreater from "../PointCreater/PointCreater";
import DragInfo from './dnd/DragInfo'
import DragItem from './dnd/DragItem'
import {setPoints, updatePoints, updatePolyline} from "../redux/actions/actions";

class PointsManager extends React.Component {
   constructor(props) {
      super(props)
      this.state = {
         pointsBuffer: null
      }
      this.ul = React.createRef()
   }

   componentDidMount() {
      // Начало реализации drag and drop
      let dragInfo = null
      let isNotFinished = false

      const ul = this.ul.current
      document.onselectstart = () => false
      document.onmousedown = e => {
         if(dragInfo && dragInfo.dragItemsList.find(item => item.item.offsetTop !== item.y)){
            return
         }
         // const dragElement = dragInfo.dragElement
         // const dragItem = dragInfo.dragItemsList.find(item => item.item === dragElement)
         // const notFinishedItem = dragInfo.dragItemsList.find(item => item.item.offsetTop !== item.y)

         if (isNotFinished) {
            return
         }

         if(e.target.className === 'material-icons close'){
            return
         }

         const element = DragInfo.getDraggableElement(e.target);
         if (!element) {
            return
         }

         dragInfo = new DragInfo({
            dragElement: element,
            mouseX: e.pageX,
            mouseY: e.pageY
         })

         this.setState({
            pointsBuffer: [...this.props.points]
         })


      }

      document.onmousemove = e => {
         if (!dragInfo) {
            return
         }

         if (Math.abs(e.pageX - dragInfo.mouseX) <= 3 && Math.abs(e.pageY - dragInfo.mouseY) <= 3) {
            return
         }

         const liList = [...ul.querySelectorAll('.draggable')]
         liList.reverse()
         liList.forEach(item => {
            const x = item.offsetLeft
            const width = getComputedStyle(item).width
            const dragItem = new DragItem({
               item: item,
               y: item.offsetTop
            })
            dragInfo.dragItemsList.unshift(dragItem)
            item.style.position = 'absolute'
            item.style.left = `${x}px`
            item.style.top = dragItem.y + 'px'
            item.style.width = width
            document.body.insertBefore(item, document.body.firstElementChild)
         })

         if (!dragInfo.avatar) {
            dragInfo.avatar = dragInfo.dragElement.cloneNode()
            const avatar = dragInfo.avatar
            avatar.innerHTML = dragInfo.dragElement.innerHTML
            avatar.classList.add('avatar')
            avatar.style.position = 'absolute'
            avatar.style.width = getComputedStyle(dragInfo.dragElement).width
            avatar.style.left = dragInfo.dragElement.offsetLeft + 'px'
            avatar.style.top = dragInfo.dragElement.offsetTop + 'px'
            avatar.style.zIndex = '9999'
            document.body.appendChild(avatar)
            dragInfo.dragElement.style.visibility = 'hidden'
         }

         const avatar = dragInfo.avatar
         avatar.style.top = e.pageY - dragInfo.shiftY + 'px'

         const dragItem = dragInfo.dragItemsList.find(item => item.item === dragInfo.dragElement)
         let itemForChange = null
         for (let i = dragInfo.dragItemsList.length - 1; i >= 0 && !itemForChange; i--) {
            const item = dragInfo.dragItemsList[i]
            const avatar = dragInfo.avatar
            if (avatar.offsetTop < item.y + item.item.offsetHeight / 2 && dragItem.y > item.y) {
               itemForChange = item
            }
         }

         if (!itemForChange) {
            for (let i = 0; i < dragInfo.dragItemsList.length && !itemForChange; i++) {
               const item = dragInfo.dragItemsList[i]
               const avatar = dragInfo.avatar
               if (avatar.offsetTop + avatar.offsetHeight > item.y + item.item.offsetHeight / 2 && dragItem.y < item.y) {
                  itemForChange = item
               }
            }
         }

         if (itemForChange) {
            const yBuffer = dragItem.y
            dragItem.y = itemForChange.y
            itemForChange.y = yBuffer
            dragItem.item.style.top = dragItem.y + 'px'
            itemForChange.item.style.top = itemForChange.y + 'px'

            const event = new Event('pointsChange')
            event.firstElementId = dragItem.item.id
            event.secondElementId = itemForChange.item.id
            document.dispatchEvent(event)
         }
      }

      function onPointsChange(event) {
         const firstIndex = this.props.points.findIndex(item => item.id === event.firstElementId)
         const secondIndex = this.props.points.findIndex(item => item.id === event.secondElementId)

         const newPoints = [...this.props.points]
         const buffer = newPoints[firstIndex]
         newPoints[firstIndex] = newPoints[secondIndex]
         newPoints[secondIndex] = buffer
         this.props.setPoints(newPoints)
         this.props.updatePoints(newPoints)
         this.props.updatePolyline({points: this.props.points, polyline: this.props.polyline})
      }

      document.addEventListener('pointsChange', onPointsChange.bind(this))

      document.onmouseup = () => {
         if (!dragInfo) {
            return
         }

         if (!dragInfo.avatar) {
            if(this.state.pointsBuffer){
               this.setState({
                  pointsBuffer: null
               })
            }
            dragInfo = null
            return
         }

         isNotFinished = true
         const avatar = dragInfo.avatar
         const dragItemsList = dragInfo.dragItemsList
         const dragElement = dragInfo.dragElement
         dragInfo = null

         avatar.style.transitionProperty = 'top'
         avatar.style.transitionDuration = '0.3s'

         const dragItem = dragItemsList.find(item => item.item === dragElement)
         avatar.style.top = dragItem.y + 'px'
         const id = setInterval(() => {
            const notFinishedItem = dragItemsList.find(item => item.item.offsetTop !== item.y)
            if (!notFinishedItem) {
               if (avatar.offsetTop === dragItem.y) {
                  document.body.removeChild(avatar)
                  dragElement.style.visibility = 'visible'
                  const fragment = document.createDocumentFragment()
                  dragItemsList.sort((a, b) => a.y - b.y)
                  dragItemsList.forEach(liItem => {
                     liItem.item.style.position = ''
                     liItem.item.style.left = ''
                     liItem.item.style.top = ''
                     liItem.item.style.width = ''
                     fragment.appendChild(liItem.item)
                  })
                  ul.appendChild(fragment)
                  isNotFinished = false
                  this.setState({
                     pointsBuffer: null
                  })
                  clearInterval(id)
               }
            }

         }, 10)
      }
      //Конец реализации drag and drop
   }

   render() {
      return (
         <div className="points">
            <PointCreater/>
            <ul className="points-container" ref={this.ul}>
               {
                  this.state.pointsBuffer
                     ? this.state.pointsBuffer.map(point =>(<Point point={point} key={point.id}/>))
                     : this.props.points.map(point => (<Point point={point} key={point.id}/>))
               }
            </ul>
         </div>
      )
   }
}

function mapStateToProps(state){
   return {
      points: state.points,
      polyline: state.polyline
   }
}

function mapDispatchToProps(dispatch){
   return {
      setPoints: points => dispatch(setPoints(points)),
      updatePoints: points => dispatch(updatePoints(points)),
      updatePolyline: payload => dispatch(updatePolyline(payload))
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(PointsManager)