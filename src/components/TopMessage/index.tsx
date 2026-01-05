import { IconProps } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';
import { Container, Title } from './styles';

// Essa é a tipagem para usarmos o ícone também de forma dinâmica
export type IconBoxProps = React.FC<IconProps>;

type Props = {
  icon?: IconBoxProps;
  title: string;
};

export function TopMessage({ title, icon: Icon }: Props) {
  const { COLORS } = useTheme();
  const insets = useSafeAreaInsets();

  const paddingTop = insets.top + 5;

  return (
    <Container style={{ paddingTop }}>
      {Icon && <Icon size={18} color={COLORS.BRAND_LIGHT} />}
      <Title>{title}</Title>
    </Container>
  );
}
