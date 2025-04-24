import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    SafeAreaView, 
    StatusBar, 
    Image, 
    ActivityIndicator, 
    ScrollView,
    useWindowDimensions,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    // Get screen dimensions and insets
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const isLandscape = width > height;
    const isSmallDevice = width < 380;
    
    // Calculate responsive sizes
    const logoSize = isLandscape ? Math.min(width * 0.2, 130) : Math.min(width * 0.35, 160);
    const horizontalPadding = isLandscape ? width * 0.1 : 32;
    const titleFontSize = isSmallDevice ? 20 : 24;
    
    // Layout is now always column, with adjusted widths for landscape
    const formWidth = isLandscape ? '70%' : '100%';

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
                {/* Back Button - Positioned absolutely */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ 
                        position: 'absolute',
                        top: Math.max(16, insets.top + (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0)),
                        left: Math.max(16, insets.left),
                        zIndex: 10,
                        padding: 10
                    }}
                >
                    <MaterialIcons name="arrow-back-ios" size={24} color="#4E342E" />
                </TouchableOpacity>

                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView 
                        contentContainerStyle={{ 
                            flexGrow: 1,
                            paddingBottom: insets.bottom || 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: insets.top + (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0) + 40
                        }}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Content Container - Always column layout now */}
                        <View style={{
                            width: isLandscape ? '90%' : '85%',
                            maxWidth: 500,
                            alignItems: 'center',
                        }}>
                            {/* Logo always at the top */}
                            <Image
                                source={require('../assets/images/image-placeholder.png')}
                                style={{ 
                                    width: logoSize, 
                                    height: logoSize, 
                                    marginBottom: isLandscape ? 20 : 24 
                                }}
                                resizeMode="contain"
                            />
                            
                            {/* Welcome Text - Always below logo */}
                            <Text style={{ 
                                fontSize: titleFontSize, 
                                fontWeight: 'bold', 
                                color: '#4E342E', 
                                marginBottom: 8,
                                textAlign: 'center'
                            }}>
                                Welcome Back
                            </Text>
                            <Text style={{ 
                                color: '#6D4C41', 
                                textAlign: 'center', 
                                marginBottom: isSmallDevice ? 16 : 32,
                                fontSize: isSmallDevice ? 14 : 16
                            }}>
                                Log in to your account to continue
                            </Text>

                            {/* Login Form - Below welcome text */}
                            <View style={{ 
                                width: formWidth,
                                alignItems: 'center'
                            }}>
                                {/* Email Input */}
                                <View style={{ 
                                    marginBottom: isSmallDevice ? 12 : 16,
                                    width: '100%'
                                }}>
                                    <Text style={{ 
                                        color: '#5D4037', 
                                        marginBottom: 8, 
                                        marginLeft: 4,
                                        fontSize: isSmallDevice ? 14 : 16,
                                        textAlign: 'center'
                                    }}>
                                        Email
                                    </Text>
                                    <View style={{ 
                                        flexDirection: 'row', 
                                        alignItems: 'center', 
                                        backgroundColor: '#EFEBE9', 
                                        borderRadius: 16, 
                                        paddingHorizontal: 12 
                                    }}>
                                        <MaterialIcons name="email" size={isSmallDevice ? 18 : 20} color="#795548" />
                                        <TextInput
                                            style={{ 
                                                flex: 1, 
                                                paddingVertical: isSmallDevice ? 10 : 12, 
                                                paddingHorizontal: 8, 
                                                color: '#4E342E',
                                                fontSize: isSmallDevice ? 14 : 16,
                                                textAlign: 'center'
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
                                <View style={{ 
                                    marginBottom: isSmallDevice ? 16 : 24,
                                    width: '100%'
                                }}>
                                    <Text style={{ 
                                        color: '#5D4037', 
                                        marginBottom: 8, 
                                        marginLeft: 4,
                                        fontSize: isSmallDevice ? 14 : 16,
                                        textAlign: 'center'
                                    }}>
                                        Password
                                    </Text>
                                    <View style={{ 
                                        flexDirection: 'row', 
                                        alignItems: 'center', 
                                        backgroundColor: '#EFEBE9', 
                                        borderRadius: 16, 
                                        paddingHorizontal: 12 
                                    }}>
                                        <Feather name="lock" size={isSmallDevice ? 18 : 20} color="#795548" />
                                        <TextInput
                                            style={{ 
                                                flex: 1, 
                                                paddingVertical: isSmallDevice ? 10 : 12, 
                                                paddingHorizontal: 8, 
                                                color: '#4E342E',
                                                fontSize: isSmallDevice ? 14 : 16,
                                                textAlign: 'center'
                                            }}
                                            placeholder="Enter your password"
                                            placeholderTextColor="#A1887F"
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry={!showPassword}
                                        />
                                        <TouchableOpacity 
                                            onPress={() => setShowPassword(!showPassword)}
                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        >
                                            <Feather
                                                name={showPassword ? "eye-off" : "eye"}
                                                size={isSmallDevice ? 18 : 20}
                                                color="#795548"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Forgot Password */}
                                <TouchableOpacity 
                                    style={{ 
                                        alignSelf: 'center',
                                        marginBottom: isSmallDevice ? 16 : 24,
                                        paddingVertical: 4,
                                        paddingHorizontal: 4
                                    }}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <Text style={{ 
                                        color: '#8D6E63',
                                        fontSize: isSmallDevice ? 14 : 16
                                    }}>
                                        Forgot Password?
                                    </Text>
                                </TouchableOpacity>

                                {/* Login Button */}
                                <TouchableOpacity
                                    style={{ 
                                        backgroundColor: '#6D4C41', 
                                        paddingVertical: isSmallDevice ? 14 : 16, 
                                        borderRadius: 16, 
                                        alignItems: 'center',
                                        width: '100%'
                                    }}
                                    onPress={handleLogin}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text style={{ 
                                            color: 'white', 
                                            fontWeight: '600', 
                                            fontSize: isSmallDevice ? 15 : 16 
                                        }}>
                                            Log In
                                        </Text>
                                    )}
                                </TouchableOpacity>

                                {/* Sign Up Link */}
                                <View style={{ 
                                    flexDirection: 'row', 
                                    justifyContent: 'center', 
                                    marginTop: isLandscape ? 24 : 32,
                                    paddingVertical: 8,
                                    width: '100%'
                                }}>
                                    <Text style={{ 
                                        color: '#5D4037',
                                        fontSize: isSmallDevice ? 14 : 16
                                    }}>
                                        Don't have an account? 
                                    </Text>
                                    <TouchableOpacity 
                                        onPress={() => router.push('/signup')}
                                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                    >
                                        <Text style={{ 
                                            color: '#8D6E63', 
                                            fontWeight: '600',
                                            fontSize: isSmallDevice ? 14 : 16,
                                            marginLeft: 4
                                        }}>
                                            Sign Up
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

export default Login;