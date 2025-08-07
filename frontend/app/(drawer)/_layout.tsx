import React from 'react'
import { Drawer } from "expo-router/drawer";
import DrawerToggle from '../../components/drawerToggle';


const _Layout = () => {
  return (
    <Drawer>
        <Drawer.Screen 
          name="index" 
          options={{
            title: 'Home', 
            headerShown: true,
            headerLeft: () => <DrawerToggle />
          }} 
        />
        <Drawer.Screen 
          name="profile" 
          options={{
            title: 'Profile', 
            headerShown: true,
            headerLeft: () => <DrawerToggle />
          }} 
        />
        <Drawer.Screen 
          name="saved" 
          options={{
            title: 'Saved', 
            headerShown: true,
            headerLeft: () => <DrawerToggle />
          }} 
        />
        <Drawer.Screen 
          name="search" 
          options={{
            title: 'Search', 
            headerShown: true,
            headerLeft: () => <DrawerToggle />
          }} 
        />
    </Drawer>
  )
}

export default _Layout