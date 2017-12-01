import Geobuf from 'geobuf';
import Pbf from 'pbf';

var geobufToGeojson = function(geobuf) {
  return Geobuf.decode( new Pbf(geobuf) );
}

var geojsonToGeobuf = function(geojson) {
  return  Geobuf.encode(geojson, new Pbf());
}
export default {geobufToGeojson, geojsonToGeobuf};

