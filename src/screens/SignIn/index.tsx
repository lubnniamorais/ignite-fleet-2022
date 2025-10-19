import { IOS_CLIENT_ID, WEB_CLIENT_ID } from '@env';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useState } from 'react';
import { Alert } from 'react-native';

import backgroundImg from '../../assets/background.png';

import { Button } from '../../components/Button';
import { supabase } from '../../lib/supabase';
import { Container, Slogan, Title } from './styles';

GoogleSignin.configure({
  scopes: ['email', 'profile'],
  webClientId: WEB_CLIENT_ID,
  iosClientId: IOS_CLIENT_ID,
});

export function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  async function handleGoogleSignIn() {
    try {
      setIsAuthenticating(true);

      const { data } = await GoogleSignin.signIn();

      if (data?.idToken) {
        // 🔹 Login com Supabase usando o idToken do Google
        const credential = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: data.idToken,
        });

        console.log('Usuário logado:', credential.data.user);

        // 👉 O App.tsx vai automaticamente detectar a nova sessão via onAuthStateChange
      } else {
        Alert.alert('Erro', 'Nao foi possivel conectar ao Google');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Nao foi possivel conectar ao Google');

      setIsAuthenticating(false);
    }
  }

  return (
    <Container source={backgroundImg}>
      <Title>Ignite Fleet</Title>

      <Slogan>Gestão de uso de veículo</Slogan>

      <Button
        title='Entrar com Google'
        isLoading={isAuthenticating}
        onPress={handleGoogleSignIn}
      />
    </Container>
  );
}
