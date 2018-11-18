import React, {Component} from 'react';
import PointsManager from "../PointsManager/PointsManager";
import './Content.css'
import Map from "../Map/Map"

class Content extends Component {
   render() {
      return (
         <div className={'content'}>
            <PointsManager/>
            <Map/>
         </div>
      );
   }
}

export default Content