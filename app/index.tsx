import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Index = () => {
    const router = useRouter();

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#D7CCC8" />
            <SafeAreaView className="flex-1 bg-[#D7CCC8]">
                <View className="flex-1 justify-center items-center px-6">
                    {/* App Logo */}
                    <Image
                        source={require('../assets/images/image-placeholder.png')}
                        className="w-[150px] h-[150px] mb-10"
                        resizeMode="contain"
                    />

                    <Text className="text-3xl font-bold text-[#4E342E] mb-2">Welcome</Text>
                    <Text className="text-[#6D4C41] text-center mb-10">
                        Sign in to continue or create a new account
                    </Text>

                    {/* Login Button */}
                    <TouchableOpacity
                        className="bg-[#795548] w-full py-4 rounded-xl flex-row justify-center items-center mb-4"
                        onPress={() => router.push('/login')}
                    >
                        <Ionicons name="log-in-outline" size={20} color="white" />
                        <Text className="text-white text-base ml-2">Log In</Text>
                    </TouchableOpacity>

                    {/* Sign Up Button */}
                    <TouchableOpacity
                        className="border border-[#795548] w-full py-4 rounded-xl flex-row justify-center items-center mb-4"
                        onPress={() => router.push('/signup')}
                    >
                        <Ionicons name="person-add-outline" size={20} color="#795548" />
                        <Text className="text-[#795548] text-base ml-2">Create Account</Text>
                    </TouchableOpacity>
                    
                    {/* Delivery Man Button */}
                    <TouchableOpacity
                        className="bg-[#5D4037] w-full py-4 rounded-xl flex-row justify-center items-center"
                        onPress={() => router.push('/delivery/deliveryman')}
                    >
                        <Ionicons name="bicycle-outline" size={20} color="white" />
                        <Text className="text-white text-base ml-2">Delivery Login</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    );
};

export default Index;