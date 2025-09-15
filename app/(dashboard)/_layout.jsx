import ProfilePage from './profile'
import HistoryPage from './history'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Homepage from './homepage'


const DashboardLayout = () => {
    const Tab = createBottomTabNavigator()

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#1f2937',
                    borderTopWidth: 0,
                    height: 90,
                    paddingBottom: 25,
                    paddingTop: 10,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: -2,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 16,
                },
                tabBarActiveTintColor: '#60a5fa',
                tabBarInactiveTintColor: '#9ca3af',
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginTop: 4,
                },
            }}
        >
            <Tab.Screen 
                name="Home" 
                component={Homepage}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Icon 
                            name={focused ? "home" : "home-outline"} 
                            size={24} 
                            color={color} 
                        />
                    ),
                }}
            />

            <Tab.Screen 
                name="Profile" 
                component={ProfilePage} 
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Icon 
                            name={focused ? "person" : "person-outline"} 
                            size={24} 
                            color={color} 
                        />
                    ),
                }}
            />
            
            <Tab.Screen 
                name="History" 
                component={HistoryPage} 
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Icon 
                            name={focused ? "time" : "time-outline"} 
                            size={24} 
                            color={color} 
                        />
                    ),
                }}
            />
        </Tab.Navigator>
   
    )
}

export default DashboardLayout