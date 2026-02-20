import { CarIcon, FlagCheckeredIcon } from 'phosphor-react-native';

import { LocationInfo, LocationInfoProps } from '../LocationInfo';

import { Container, Line } from './styles';

type Props = {
  departure: LocationInfoProps;
  arrival: LocationInfoProps;
};

export function Locations({ departure, arrival }: Props) {
  return (
    <Container>
      <LocationInfo
        icon={CarIcon}
        label={departure.label}
        description={departure.description}
      />

      <Line />

      <LocationInfo
        icon={FlagCheckeredIcon}
        label={arrival.label}
        description={arrival.description}
      />
    </Container>
  );
}
