import { Container, Description, Info, Label } from './styles';

export type LocationInfoProps = {
  label: string;
  description: string;
};

type Props = LocationInfoProps;

export function LocationInfo({ label, description }: Props) {
  return (
    <Container>
      <Info>
        {/* A propriedade numberOfLines serve para limitar a quantidade de linhas */}
        <Label numberOfLines={1}>{label}</Label>

        <Description numberOfLines={1}>{description}</Description>
      </Info>
    </Container>
  );
}
