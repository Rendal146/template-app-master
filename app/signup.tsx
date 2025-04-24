import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Image,
    ScrollView,
    ActivityIndicator,
    useWindowDimensions,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SignUp = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    // Get dimensions and insets for responsive layout
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const isLandscape = width > height;
    const isSmallDevice = width < 380;

    // Calculate responsive sizes
    const logoSize = isLandscape ? Math.min(width * 0.12, 80) : Math.min(width * 0.2, 100);
    const horizontalPadding = isLandscape ? width * 0.08 : width * 0.07;
    const formWidth = isLandscape ? '80%' : '100%';
    const titleFontSize = isSmallDevice ? 20 : 24;
    
    // Text and input sizing
    const labelFontSize = isSmallDevice ? 13 : 14;
    const inputPaddingVertical = isSmallDevice ? 10 : 12;
    const inputFontSize = isSmallDevice ? 14 : 15;

    const handleSignUp = () => {
        // Simple UI simulation with no backend
        setLoading(true);

        // Simulate a network request
        setTimeout(() => {
            setLoading(false);
            router.push('/dashboard');
        }, 1500);
    };

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#D7CCC8" />
            <SafeAreaView style={{ flex: 1, backgroundColor: '#D7CCC8' }}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: Math.max(20, insets.bottom),
                            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0
                        }}
                    >
                        {/* Back button */}
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{
                                padding: 16,
                                paddingLeft: Math.max(16, insets.left),
                                paddingTop: 16
                            }}
                        >
                            <Ionicons name="arrow-back" size={24} color="#4E342E" />
                        </TouchableOpacity>

                        {/* Main content container with responsive layout */}
                        <View style={{
                            alignItems: 'center',
                            paddingHorizontal: horizontalPadding,
                            marginTop: isLandscape ? 0 : 10
                        }}>
                            {/* Header */}
                            <View style={{ alignItems: 'center', marginBottom: isLandscape ? 20 : 30 }}>
                                <Image
                                    source={require('../assets/images/image-placeholder.png')}
                                    style={{
                                        width: logoSize,
                                        height: logoSize,
                                        marginBottom: isLandscape ? 10 : 16
                                    }}
                                    resizeMode="contain"
                                />
                                <Text style={{
                                    fontSize: titleFontSize,
                                    fontWeight: 'bold',
                                    color: '#4E342E',
                                    marginBottom: 8
                                }}>
                                    Create Account
                                </Text>
                                <Text style={{
                                    color: '#6D4C41',
                                    textAlign: 'center',
                                    fontSize: isSmallDevice ? 13 : 14
                                }}>
                                    Sign up to get started with our app
                                </Text>
                            </View>

                            {/* Form container with responsive width */}
                            <View style={{ width: formWidth, maxWidth: 500 }}>
                                {/* Full Name Input */}
                                <View style={{ marginBottom: isSmallDevice ? 12 : 16 }}>
                                    <Text style={{ 
                                        color: '#5D4037',
                                        marginBottom: 6,
                                        marginLeft: 4,
                                        fontSize: labelFontSize
                                    }}>
                                        Full Name
                                    </Text>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: '#EFEBE9',
                                        borderRadius: 12,
                                        paddingHorizontal: 12
                                    }}>
                                        <Ionicons name="person-outline" size={isSmallDevice ? 18 : 20} color="#795548" />
                                        <TextInput
                                            style={{
                                                flex: 1,
                                                paddingVertical: inputPaddingVertical,
                                                paddingHorizontal: 8,
                                                color: '#4E342E',
                                                fontSize: inputFontSize
                                            }}
                                            placeholder="Enter your full name"
                                            placeholderTextColor="#A1887F"
                                            value={fullName}
                                            onChangeText={setFullName}
                                            autoCapitalize="words"
                                        />
                                    </View>
                                </View>

                                {/* Email Input */}
                                <View style={{ marginBottom: isSmallDevice ? 12 : 16 }}>
                                    <Text style={{ 
                                        color: '#5D4037',
                                        marginBottom: 6,
                                        marginLeft: 4,
                                        fontSize: labelFontSize
                                    }}>
                                        Email
                                    </Text>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: '#EFEBE9',
                                        borderRadius: 12,
                                        paddingHorizontal: 12
                                    }}>
                                        <Ionicons name="mail-outline" size={isSmallDevice ? 18 : 20} color="#795548" />
                                        <TextInput
                                            style={{
                                                flex: 1,
                                                paddingVertical: inputPaddingVertical,
                                                paddingHorizontal: 8,
                                                color: '#4E342E',
                                                fontSize: inputFontSize
                                            }}
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
                                <View style={{ marginBottom: isSmallDevice ? 12 : 16 }}>
                                    <Text style={{ 
                                        color: '#5D4037',
                                        marginBottom: 6,
                                        marginLeft: 4,
                                        fontSize: labelFontSize
                                    }}>
                                        Password
                                    </Text>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: '#EFEBE9',
                                        borderRadius: 12,
                                        paddingHorizontal: 12
                                    }}>
                                        <Ionicons name="lock-closed-outline" size={isSmallDevice ? 18 : 20} color="#795548" />
                                        <TextInput
                                            style={{
                                                flex: 1,
                                                paddingVertical: inputPaddingVertical,
                                                paddingHorizontal: 8,
                                                color: '#4E342E',
                                                fontSize: inputFontSize
                                            }}
                                            placeholder="Create a password"
                                            placeholderTextColor="#A1887F"
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry={!showPassword}
                                        />
                                        <TouchableOpacity 
                                            onPress={() => setShowPassword(!showPassword)}
                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        >
                                            <Ionicons
                                                name={showPassword ? "eye-off-outline" : "eye-outline"}
                                                size={isSmallDevice ? 18 : 20}
                                                color="#795548"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={{
                                        fontSize: isSmallDevice ? 11 : 12,
                                        color: '#8D6E63',
                                        marginTop: 4,
                                        marginLeft: 4
                                    }}>
                                        Password must be at least 8 characters
                                    </Text>
                                </View>

                                {/* Confirm Password Input */}
                                <View style={{ marginBottom: isSmallDevice ? 16 : 24 }}>
                                    <Text style={{ 
                                        color: '#5D4037',
                                        marginBottom: 6,
                                        marginLeft: 4,
                                        fontSize: labelFontSize
                                    }}>
                                        Confirm Password
                                    </Text>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: '#EFEBE9',
                                        borderRadius: 12,
                                        paddingHorizontal: 12
                                    }}>
                                        <Ionicons name="lock-closed-outline" size={isSmallDevice ? 18 : 20} color="#795548" />
                                        <TextInput
                                            style={{
                                                flex: 1,
                                                paddingVertical: inputPaddingVertical,
                                                paddingHorizontal: 8,
                                                color: '#4E342E',
                                                fontSize: inputFontSize
                                            }}
                                            placeholder="Confirm your password"
                                            placeholderTextColor="#A1887F"
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                            secureTextEntry={!showConfirmPassword}
                                        />
                                        <TouchableOpacity 
                                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        >
                                            <Ionicons
                                                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                                size={isSmallDevice ? 18 : 20}
                                                color="#795548"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Terms and Conditions Checkbox */}
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginBottom: isSmallDevice ? 16 : 24
                                    }}
                                    onPress={() => setAgreeToTerms(!agreeToTerms)}
                                >
                                    <View style={{
                                        width: isSmallDevice ? 18 : 20,
                                        height: isSmallDevice ? 18 : 20,
                                        borderWidth: 1,
                                        borderRadius: 4,
                                        marginRight: 8,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: agreeToTerms ? '#6D4C41' : 'transparent',
                                        borderColor: agreeToTerms ? '#6D4C41' : '#A1887F'
                                    }}>
                                        {agreeToTerms && <Ionicons name="checkmark" size={isSmallDevice ? 12 : 14} color="white" />}
                                    </View>
                                    <Text style={{ 
                                        color: '#5D4037', 
                                        flex: 1,
                                        fontSize: isSmallDevice ? 13 : 14
                                    }}>
                                        I agree to the <Text style={{ color: '#8D6E63' }}>Terms & Conditions</Text> and <Text style={{ color: '#8D6E63' }}>Privacy Policy</Text>
                                    </Text>
                                </TouchableOpacity>

                                {/* Sign Up Button */}
                                <TouchableOpacity
                                    style={{
                                        paddingVertical: isSmallDevice ? 12 : 14,
                                        borderRadius: 12,
                                        alignItems: 'center',
                                        backgroundColor: agreeToTerms ? '#6D4C41' : '#A1887F',
                                        marginBottom: isSmallDevice ? 20 : 28
                                    }}
                                    onPress={handleSignUp}
                                    disabled={loading || !agreeToTerms}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text style={{ 
                                            color: 'white', 
                                            fontWeight: '600', 
                                            fontSize: isSmallDevice ? 15 : 16 
                                        }}>
                                            Create Account
                                        </Text>
                                    )}
                                </TouchableOpacity>

                                {/* Login Link */}
                                <View style={{ 
                                    flexDirection: 'row', 
                                    justifyContent: 'center',
                                    marginBottom: 16,
                                    paddingVertical: 8
                                }}>
                                    <Text style={{ 
                                        color: '#5D4037',
                                        fontSize: isSmallDevice ? 14 : 15
                                    }}>
                                        Already have an account?{' '}
                                    </Text>
                                    <TouchableOpacity 
                                        onPress={() => router.push('/login')}
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    >
                                        <Text style={{ 
                                            color: '#8D6E63', 
                                            fontWeight: '600',
                                            fontSize: isSmallDevice ? 14 : 15
                                        }}>
                                            Log In
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
};

export default SignUp;