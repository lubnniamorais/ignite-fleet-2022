import { IconProps } from 'phosphor-react-native';
import { TouchableOpacityProps } from 'react-native';
import { useTheme } from 'styled-components/native';

import { Container } from './styles';

// Essa é a tipagem para usarmos o ícone também de forma dinâmica
export type IconBoxProps = React.FC<IconProps>;

type Props = TouchableOpacityProps & {
  icon: IconBoxProps;
};

export function ButtonIcon({ icon: Icon, ...rest }: Props) {
  const { COLORS } = useTheme();

  return (
    <Container activeOpacity={0.7} {...rest}>
      <Icon size={24} color={COLORS.BRAND_MID} />
    </Container>
  );
}
