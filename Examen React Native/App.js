import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TaskListScreen from './screens/TaskListScreen'; 
import AddTask from './screens/AddTask';


const Stack = createNativeStackNavigator();


export default function App() {
 return (
   <NavigationContainer>
     <Stack.Navigator initialRouteName="Home">
       <Stack.Screen name="TaskListScreen" component={TaskListScreen} options={{ headerShown: false }}/>
       <Stack.Screen name="AddTask" component={AddTask} options={{ headerShown: false }}/>
     </Stack.Navigator>
   </NavigationContainer>
 );
}
