import { CarIcon, FlagCheckeredIcon } from 'phosphor-react-native';
import { useRef } from 'react';
import MapView, {
  LatLng,
  MapViewProps,
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { IconBox } from '../IconBox';

type Props = MapViewProps & {
  // Deixamos como um array de coordenadas, pois será necessário apresentar a rota, e o
  // ponto de saída e chegada do usuário
  coordinates: LatLng[];
};

export function Map({ coordinates, ...rest }: Props) {
  // Utilizamos a referência para manipular o mapa
  const mapRef = useRef<MapView>(null);

  // Obtendo a ultima coordenada
  const lastCoordinate = coordinates[coordinates.length - 1];

  async function onMapLoaded() {
    // Verificando se tem mais de uma coordenada, caso tenha, então o mapa
    // será reposicionado
    if (coordinates.length > 1) {
      mapRef.current?.fitToSuppliedMarkers(['departure', 'arrival'], {
        // Essa propriedade faz com que os marcadores não fiquem grudado nas bordas
        edgePadding: {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        },
      });
    }
  }

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={{ width: '100%', height: 200 }}
      // São as coordenadas para a gente mostrar no mapa qual é a posição se encontra
      // As propriedades latitudeDelta e longitudeDelta são para definir a região do mapa
      // que vai exibir a proximidade
      region={{
        latitude: lastCoordinate.latitude,
        longitude: lastCoordinate.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      onMapLoaded={onMapLoaded}
      {...rest}
    >
      <Marker identifier='departure' coordinate={coordinates[0]}>
        <IconBox size='SMALL' icon={CarIcon} />
      </Marker>

      {coordinates.length > 1 && (
        <Marker identifier='arrival' coordinate={lastCoordinate}>
          <IconBox size='SMALL' icon={FlagCheckeredIcon} />
        </Marker>
      )}
    </MapView>
  );
}
