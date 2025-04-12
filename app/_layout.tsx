import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback } from 'react'
import { Stack } from 'expo-router'
import { useFonts } from 'expo-font'
import { CartProvider } from './context/CartContext'

import "../global.css"


const RootLayout = () => {
    const [fontsLoaded] = useFonts({
        'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),

    });

    return (
        <CartProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="login" />
                <Stack.Screen name="signup" />
                <Stack.Screen name="dashboard" />
            </Stack>
        </CartProvider>
    )
}

export default RootLayout

const styles = StyleSheet.create({})