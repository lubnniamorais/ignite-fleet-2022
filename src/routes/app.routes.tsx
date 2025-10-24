import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from '../screens/Home';

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
  return (
    // Desabilitar o titulo que é colocado automaticamente pelo navigator
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name='home' component={Home} />
    </Navigator>
  );
}
