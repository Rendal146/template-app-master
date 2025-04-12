import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';

export default function DashboardLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#3077e3',
                tabBarInactiveTintColor: '#888',
                tabBarStyle: {
                    backgroundColor: 'white',
                    borderTopWidth: 1,
                    borderTopColor: '#e5e7eb',
                    paddingBottom: 5,
                    height: 55,
                },
                headerStyle: {
                    backgroundColor: 'white',
                },
                headerTitleStyle: {
                    fontWeight: 'bold',
                    color: '#333',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Coffees",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="cafe-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="orders"
                options={{
                    title: "Orders",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="receipt-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}