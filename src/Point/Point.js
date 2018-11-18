import React from 'react'
import './Point.css'
import {connect} from 'react-redux'
import {deletePoint} from "../redux/actions/actions";

class Point extends React.Component {
   render() {
      return (
         <li className="draggable" id={this.props.point.id}>
            <div
               style={{
                  display: 'inline-block',
                  width: '260px'
               }}
            >{this.props.point.title}
            </div>
            <i//Иконка закрытия
               onClick={
                  () => {//Удаляем соответствующий объект point
                     this.props.deletePoint({
                        points: this.props.points,
                        point: this.props.point,
                        myMap: this.props.myMap,
                        polyline: this.props.polyline
                     })
                  }
               }
               className={'material-icons close'}
               style={{
                  position: 'absolute',
                  right: '5px',
                  top: '2px',
                  cursor: 'default'
               }}
            >cancel_presentation</i>
         </li>
      )
   }
}

function mapStateToProps(state) {
   return {
      points: state.points,
      polyline: state.polyline,
      myMap: state.myMap
   }
}

function mapDispatchToProps(dispatch) {
   return {
      deletePoint: payload => dispatch(deletePoint(payload)),
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(Point)