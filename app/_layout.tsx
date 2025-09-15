import { Stack } from "expo-router";
import { UserProvider } from './usercontext'
export default function RootLayout() {
  return (

  <UserProvider>
  <Stack >

    <Stack.Screen 
    name="(dashboard)"
    options={{ headerShown: false}}
    />
    <Stack.Screen
    name="index"
    options={{headerShown: false}}
    />
    <Stack.Screen
    name="signup"
    options={{headerShown: false}}
    />
    <Stack.Screen
    name="homepage"
    options={{headerShown: false}}
    />
    <Stack.Screen
     name="signin"
     options={{headerShown: false}}
    />

  </Stack> 
   </UserProvider>
  )
}