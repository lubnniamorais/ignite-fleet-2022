import { CarIcon } from 'phosphor-react-native';
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
  // Obtendo a ultima coordenada
  const lastCoordinate = coordinates[coordinates.length - 1];

  return (
    <MapView
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
      {...rest}
    >
      <Marker coordinate={coordinates[0]}>
        <IconBox size='SMALL' icon={CarIcon} />
      </Marker>
    </MapView>
  );
}
