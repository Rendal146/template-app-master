import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, Feather, FontAwesome } from '@expo/vector-icons';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = () => {
        setLoading(true);

        // Simulate a delay as if connecting to backend
        setTimeout(() => {
            setLoading(false);
            router.push('/dashboard');
        }, 1500);
    };

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#D7CCC8" />
            <SafeAreaView style={{ flex: 1, backgroundColor: '#D7CCC8' }}>
                {/* Back Button */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ padding: 16 }}
                >
                    <MaterialIcons name="arrow-back-ios" size={24} color="#4E342E" />
                </TouchableOpacity>

                {/* Header */}
                <View style={{ alignItems: 'center', paddingHorizontal: 32, marginTop: 48 }}>
                    <Image
                        source={require('../assets/images/image-placeholder.png')}
                        style={{ width: 160, height: 160, marginBottom: 24 }}
                        resizeMode="contain"
                    />
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#4E342E', marginBottom: 8 }}>Welcome Back</Text>
                    <Text style={{ color: '#6D4C41', textAlign: 'center', marginBottom: 32 }}>
                        Log in to your account to continue
                    </Text>
                </View>

                {/* Login Form */}
                <View style={{ paddingHorizontal: 32, marginTop: 24, paddingBottom: 32 }}>
                    {/* Email Input */}
                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ color: '#5D4037', marginBottom: 8, marginLeft: 4 }}>Email</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFEBE9', borderRadius: 16, paddingHorizontal: 12 }}>
                            <MaterialIcons name="email" size={20} color="#795548" />
                            <TextInput
                                style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 8, color: '#4E342E' }}
                                placeholder="Enter your email"
                                placeholderTextColor="#A1887F"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* Password Input */}
                    <View style={{ marginBottom: 24 }}>
                        <Text style={{ color: '#5D4037', marginBottom: 8, marginLeft: 4 }}>Password</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFEBE9', borderRadius: 16, paddingHorizontal: 12 }}>
                            <Feather name="lock" size={20} color="#795548" />
                            <TextInput
                                style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 8, color: '#4E342E' }}
                                placeholder="Enter your password"
                                placeholderTextColor="#A1887F"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Feather
                                    name={showPassword ? "eye-off" : "eye"}
                                    size={20}
                                    color="#795548"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 24 }}>
                        <Text style={{ color: '#8D6E63' }}>Forgot Password?</Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity
                        style={{ backgroundColor: '#6D4C41', paddingVertical: 16, borderRadius: 16, alignItems: 'center' }}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Log In</Text>
                        )}
                    </TouchableOpacity>

                    {/* Sign Up Link */}
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 32 }}>
                        <Text style={{ color: '#5D4037' }}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/signup')}>
                            <Text style={{ color: '#8D6E63', fontWeight: '600' }}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
};

export default Login;