import React from 'react'
import './PointCreater.css'
import {connect} from 'react-redux'
import {addPoint, addPolyline, incCurrentId, updatePolyline} from "../redux/actions/actions";

class pointCreater extends React.Component {
   render() {
      const createPlacemark = async ({value, ymaps}) => {
         try {
            const res = await ymaps.geocode(value)
            if (res.geoObjects.get(0)) {// Если строка запроса отобразилась к координаты
               const coords = res.geoObjects.get(0).geometry.getCoordinates()
               const placemark = new ymaps.Placemark(coords, null, {preset: 'islands#blackStretchyIcon', draggable: true})
               return placemark
            } else {
               return null
            }
         } catch (err) {
            throw err
         }
      }

      const createPolyline = () => {
         const geometry = this.props.points.map(point => point.placemark.geometry.getCoordinates())
         const polyline = new this.props.ymaps.Polyline(geometry, null, {  strokeColor: '#000000', strokeWidth: 3})
         return polyline
      }
      const onKeyPress = async e => {
         if (e.which === 13 && e.target.value.trim() !== '') {// Если нажата Enter и поле ввода не пусто
            const target = e.target
            if (this.props.ymaps && this.props.myMap) {//Если загружены элементы yandex API, создаем Placemark
               const placemark = await createPlacemark({value: e.target.value.trim(), ymaps: this.props.ymaps})
               if (placemark) {// Если вернулась именно Placemark, а не null
                  const numberOfPlacemark = this.props.points.length + 1 // определяем цифру, которая изначатльно будет записана в iconContent
                  placemark.properties.set('iconContent', numberOfPlacemark)
                  placemark.events.add('drag', () => {// Если переносим метку, обсновляем маршрут с учетом новых координат
                     this.props.updatePolyline({points: this.props.points, polyline: this.props.polyline})
                  })

                  placemark.events.add('click', () => {//Если кликаем на метку, появляется балун
                     const point = this.props.points.find(item => item.placemark === placemark)
                     const title = point.title
                     this.props.myMap.balloon.open(placemark.geometry.getCoordinates(), title);
                  })
                  this.props.myMap.geoObjects.add(placemark)
                  this.props.myMap.panTo(placemark.geometry.getCoordinates(), {duration: 1000}) //Плавно переводим центр к новым координатам

                  const id = this.props.currentId // В state.currentId хранится уникальный id для новой метки
                  this.props.incCurrentId(id)// Изменяем id, подготавливая его для следующей метки
                  const title = target.value.trim()
                  this.props.addPoint({id, title, placemark})// добавляем новый объект Point в state
                  if(this.props.points.length === 2){// Если это вторая метка, создаем маршрут
                     const polyline = createPolyline()
                     this.props.myMap.geoObjects.add(polyline)
                     this.props.addPolyline(polyline)
                  } else if (this.props.points.length > 2){ // Если меток больше 2, то при создании очередной, модифицируем маршрут
                     this.props.updatePolyline({points: this.props.points, polyline: this.props.polyline})
                  }
                  target.value = ''
               } else {
                  alert('Данные введены неверно или что-то пошло не так')// Если не получили координат по нашему запросу, выводим сообщение, поле ввода не очищаем
               }
            }
         }
      }
      return (
         <input
            type="text"
            className={'point-creater'}
            onKeyPress={onKeyPress}
            placeholder={'Новая точка маршрута'}/>
      )
   }
}

function mapStateToProps(state) {
   return {
      ymaps: state.ymaps,
      myMap: state.myMap,
      currentId: state.currentId,
      points: state.points,
      polyline: state.polyline
   }
}

function mapDispatchToProps(dispatch) {
   return {
      addPoint: point => dispatch(addPoint(point)),
      incCurrentId: id => dispatch(incCurrentId(id)),
      addPolyline: polyline => dispatch(addPolyline(polyline)),
      updatePolyline: payload => dispatch(updatePolyline(payload))
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(pointCreater)