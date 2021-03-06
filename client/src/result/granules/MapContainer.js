import { connect } from 'react-redux'
import MapComponent from '../../search/map/MapComponent'
import { toggleGranuleFocus } from './GranulesActions'

const mapStateToProps = (state) => {
  let granules = state.getIn(['granules', 'granules'])
  let featureCollection = []
  granules.forEach((data, id)=> {
    featureCollection.push(convertToGeoJson(data.toJS(), id))
  })
  return {
    geoJsonFeatures: featureCollection,
    focusedFeatures: state.getIn(['granules', 'focusedGranules']).toJS()
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleGeometryFocus: id => toggleGranuleFocus(id)
  }
}

const MapContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(MapComponent)

const convertToGeoJson = (recordData, id) => {
  // Currently defaulting to rendering bounding box coordinates
  let geoJson = {
    geometry: {
      coordinates: bboxToCoords(recordData.spatialBounding.coordinates),
      type: "Polygon"
    },
    properties: Object.assign(recordData, {id: id}),
    type: "Feature"
  }
  return geoJson
}

const bboxToCoords = bbox => {
  const southWest = [bbox[0][0], bbox[0][1]]
  const southEast = [bbox[0][0], bbox[1][1]]
  const northEast = [bbox[1][0], bbox[1][1]]
  const northWest = [bbox[1][0], bbox[0][1]]
  return [[southWest, southEast, northEast, northWest]]
}

export default MapContainer
