import {
   ADD_POINT,
   ADD_POLYLINE,
   SET_CURRENT_ID,
   SET_MAP,
   SET_POINTS,
   SET_YMAPS
} from "./actions/actionTypes";

const initialState = {
   currentId: 'point1',
   ymaps: null,
   myMap: null,
   points: [], // обектны структуры {id, title, placemark}
   polyline: null,// маршрут
   mapCoordsDefault: [55.76, 37.64]// координаты центра по умолчанию
}

export default function (state = initialState, action) {
   switch (action.type) {
      case SET_YMAPS:
         return {
            ...state,
            ymaps: action.payload
         }
      case SET_MAP:
         return {
            ...state,
            myMap: action.payload
         }
      case SET_POINTS:
         return {
            ...state,
            points: action.payload
         }
      case ADD_POINT: {
         const points = [...state.points]
         points.push(action.payload)
         return {
            ...state,
            points
         }
      }
      case SET_CURRENT_ID:
         return {
            ...state,
            currentId: action.payload
         }
      case ADD_POLYLINE:
         return {
            ...state,
            polyline: action.payload
         }
      default:
         return state
   }
}

