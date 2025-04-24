import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    Image, 
    TouchableOpacity, 
    SafeAreaView, 
    StatusBar, 
    Platform, 
    useWindowDimensions,
    ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Index = () => {
    const router = useRouter();
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const isSmallDevice = width < 380;
    const isLandscape = width > height;

    // Calculate responsive sizes
    const logoSize = Math.min(width * 0.35, 150);
    // Use the same button width regardless of orientation for vertical alignment
    const buttonWidth = isLandscape ? '60%' : '85%';
    const buttonPaddingVertical = isSmallDevice ? 10 : 14;
    const titleFontSize = isSmallDevice ? 24 : 30;

    // Safe area padding, mainly for notched devices
    const paddingTop = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#D7CCC8" />
            <SafeAreaView className="flex-1 bg-[#D7CCC8]">
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <View 
                        className="flex-1 justify-center items-center"
                        style={{ 
                            width: isLandscape ? '80%' : '90%',
                            maxWidth: 500,
                            paddingTop: paddingTop + (isLandscape ? 10 : 40),
                            paddingBottom: insets.bottom || 20
                        }}
                    >
                        {/* App Logo */}
                        <Image
                            source={require('../assets/images/image-placeholder.png')}
                            style={{
                                width: logoSize,
                                height: logoSize,
                                marginBottom: height * 0.04
                            }}
                            resizeMode="contain"
                        />

                        <Text style={{ fontSize: titleFontSize }} className="font-bold text-[#4E342E] mb-2">
                            Welcome
                        </Text>
                        <Text className={`text-[#6D4C41] text-center mb-${isSmallDevice ? '6' : '10'}`}>
                            Sign in to continue or create a new account
                        </Text>

                        {/* Button Container - Always vertical layout */}
                        <View style={{ 
                            width: buttonWidth, 
                            alignItems: 'center'
                        }}>
                            {/* Login Button */}
                            <TouchableOpacity
                                style={{ 
                                    width: '100%',
                                    paddingVertical: buttonPaddingVertical,
                                    marginBottom: 16
                                }}
                                className="bg-[#795548] rounded-xl flex-row justify-center items-center"
                                onPress={() => router.push('/login')}
                            >
                                <Ionicons name="log-in-outline" size={isSmallDevice ? 16 : 20} color="white" />
                                <Text className="text-white text-base ml-2">Log In</Text>
                            </TouchableOpacity>

                            {/* Sign Up Button */}
                            <TouchableOpacity
                                style={{
                                    width: '100%',
                                    paddingVertical: buttonPaddingVertical,
                                    marginBottom: 16
                                }}
                                className="border border-[#795548] rounded-xl flex-row justify-center items-center"
                                onPress={() => router.push('/signup')}
                            >
                                <Ionicons name="person-add-outline" size={isSmallDevice ? 16 : 20} color="#795548" />
                                <Text className="text-[#795548] text-base ml-2">Create Account</Text>
                            </TouchableOpacity>
                            
                            {/* Delivery Man Button */}
                            <TouchableOpacity
                                style={{
                                    width: '100%',
                                    paddingVertical: buttonPaddingVertical
                                }}
                                className="bg-[#5D4037] rounded-xl flex-row justify-center items-center"
                                onPress={() => router.push('/delivery/deliveryman')}
                            >
                                <Ionicons name="bicycle-outline" size={isSmallDevice ? 16 : 20} color="white" />
                                <Text className="text-white text-base ml-2">Delivery Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default Index;