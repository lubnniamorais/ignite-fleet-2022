import { PowerIcon } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { supabase } from '../../lib/supabase';

import theme from '../../theme';
import { Loading } from '../Loading';
import { Container, Greeting, Message, Name, Picture } from './styles';

interface IUserData {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
}

export function HomeHeader() {
  const [user, setUser] = useState<IUserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Para evitar que o componente fique com o padding-top de 0
  // Renderiza nas áreas seguras da tela
  const insets = useSafeAreaInsets();
  const paddingTop = insets.top + 32;

  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        console.log('Nenhum usuário ativo');
        setUser(null);
        setLoading(false);
        return;
      }

      if (data.user) {
        const metadataUser = data.user.user_metadata;

        setUser({
          id: metadataUser.id,
          email: metadataUser.email,
          name: metadataUser.full_name,
          avatar_url: metadataUser.avatar_url,
        });
      }

      setLoading(false);
    }

    loadUser();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <Container style={{ paddingTop }}>
      <Picture
        source={{ uri: user?.avatar_url }}
        placeholder='L184i9ofa}of00ayjtay~qj[f6ju'
      />

      <Greeting>
        <Message>Ola, </Message>

        <Name>{user?.name}</Name>
      </Greeting>

      <TouchableOpacity activeOpacity={0.7} onPress={handleSignOut}>
        <PowerIcon size={32} color={theme.COLORS.GRAY_400} />
      </TouchableOpacity>
    </Container>
  );
}
