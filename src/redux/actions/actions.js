import {
   ADD_POINT,
   ADD_POLYLINE,
   SET_CURRENT_ID,
   SET_MAP,
   SET_POINTS,
   SET_YMAPS
} from "./actionTypes";

export function initYmapsAndMyMap({center}) {// устанавливаем ymaps и созданную нами карту myMap
   return dispatch => {
      window.onload = () => {
         const ymaps = window.ymaps
         dispatch(setYmaps(ymaps))
         ymaps.ready(() => {
            const myMap = new ymaps.Map('map', {center, zoom: 7})
            dispatch(setMap(myMap))
         })
      }
   }
}

export function incCurrentId(id) {//Изменяем, увеличивая, текущий state.currentId
   const numberId = +id.slice(5)
   const newId = `point${numberId + 1}`
   return {
      type: SET_CURRENT_ID,
      payload: newId
   }
}

export function updatePoints(points) {
   return () => {
      points.forEach((point, index) => {
         point.placemark.properties.set('iconContent', index + 1)
      })
   }
}

export function addPolyline(polyline) {//Добавляем созданный маршрут
   return {
      type: ADD_POLYLINE,
      payload: polyline
   }
}

export function updatePolyline({points, polyline}) {
   return async () => {
      const geometry = points.map(point => point.placemark.geometry.getCoordinates())
      await polyline.geometry.setCoordinates(geometry)
   }
}

export function deletePolyline({myMap, polyline}) {
   myMap.geoObjects.remove(polyline)
   return {
      type: ADD_POLYLINE,
      payload: null
   }
}

export function addPoint(point) {
   return {
      type: ADD_POINT,
      payload: point
   }
}

export function deletePoint({points, point, myMap, polyline}) {
   return async dispatch => {
      try {
         let newPoints = points.filter(item => item.id !== point.id)//Создаем копиью state.points без данной point
         const placemark = point.placemark
         myMap.geoObjects.remove(placemark) // удаляем соответстующую метку
         newPoints.forEach((point, index) => {//обновляем метки
            point.placemark.properties.set('iconContent', index + 1)
         })
         if (polyline) {
            if (newPoints.length === 1) { //Если осталась одна метка и есть маршрут, удаляем маршрут
               deletePolyline({myMap, polyline});
            } else {// иначе обновляем его
               const geometry = newPoints.map(point => point.placemark.geometry.getCoordinates());//Находим координаты всех меток
               await polyline.geometry.setCoordinates(geometry);
            }
         }
         dispatch(setPoints(newPoints))
      } catch(err) {
          throw err
      }

   }
}

export function setPoints(points) {
   return {
      type: SET_POINTS,
      payload: points
   }
}


function setYmaps(ymaps) {
   return {
      type: SET_YMAPS,
      payload: ymaps
   }
}

function setMap(myMap) {
   return {
      type: SET_MAP,
      payload: myMap
   }
}



























