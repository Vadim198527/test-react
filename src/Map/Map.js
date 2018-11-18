import React from 'react'
import './Map.css'
import {connect} from 'react-redux'
import {initYmapsAndMyMap} from "../redux/actions/actions";

class MyMap extends React.Component {

   componentDidMount() {
      this.props.initYmapsAndMyMap({center: this.props.mapCoordsDefault})
   }


   render() {
      return (
         <div id="map" style={{width: '600px', height: '400px', border: '2px solid gray'}}/>
      )
   }


}

function mapStateToProps(state) {
   return {
      point: state.points,
      mapCoordsDefault: state.mapCoordsDefault
   }
}

function mapDispatchToProps(dispatch){
   return {
      initYmapsAndMyMap: center => dispatch(initYmapsAndMyMap(center))
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyMap)
