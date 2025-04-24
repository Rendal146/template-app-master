import React, { useState } from 'react';
import { 
    View, 
    Text, 
    SafeAreaView, 
    FlatList, 
    TouchableOpacity, 
    Alert, 
    Modal, 
    ScrollView, 
    TextInput, 
    Image,
    useWindowDimensions,
    Platform,
    StatusBar
} from 'react-native';
import { useCart, CartItem } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PaymentMethods from '../components/PaymentMethods';

export default function OrderView(): JSX.Element {
    const { cart, removeFromCart, clearCart, addToCart } = useCart();
    const [showPaymentView, setShowPaymentView] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [showGcashModal, setShowGcashModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [gcashStep, setGcashStep] = useState(1);
    const [receiptUploaded, setReceiptUploaded] = useState(false);
    const [receiptImage, setReceiptImage] = useState<string | null>(null);
    const [receiptData, setReceiptData] = useState<{
        items: CartItem[];
        subtotal: number;
        tax: number; // Add tax property back
        total: number;
        date: string;
        orderNumber: string;
    } | null>(null);

    // Responsive dimensioning
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const isLandscape = width > height;
    const isTablet = width >= 768;
    const isSmallDevice = width < 375;
    
    // Dynamic size calculations
    const modalWidth = isTablet ? '70%' : isLandscape ? '80%' : '90%';
    const modalMaxHeight = isLandscape ? '90%' : '80%';
    const fontSizeHeading = isTablet ? 28 : isSmallDevice ? 20 : 24;
    const fontSizeSubheading = isTablet ? 22 : isSmallDevice ? 16 : 18;
    const fontSizeNormal = isTablet ? 18 : isSmallDevice ? 14 : 16;
    const fontSizeSmall = isTablet ? 16 : isSmallDevice ? 12 : 14;
    const buttonPadding = isSmallDevice ? 10 : 12;
    const itemPadding = isSmallDevice ? 8 : 10;
    const sectionSpacing = isSmallDevice ? 16 : 20;
    const receiptImageHeight = isLandscape ? 150 : 200;

    const calculateSubtotal = (): number => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const calculateTotal = (subtotal: number): number => {
        return subtotal; // No longer adding tax
    };
    const proceedToPayment = (): void => {
        if (cart.length === 0) {
            Alert.alert('Cart is Empty', 'Please add items to your cart before proceeding to payment.');
            return;
        }
        setShowPaymentView(true);
    };

    const generateOrderNumber = (): string => {
        return `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    };

    const formatDate = (): string => {
        const now = new Date();
        return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    };

    const handlePayment = (method: string): void => {
        setPaymentMethod(method);
        
        // Prepare receipt data
        const subtotal = calculateSubtotal();
        const total = calculateTotal(subtotal);

        setReceiptData({
            items: [...cart],
            subtotal: subtotal,
            tax: 0, // Set tax to 0
            total: total,
            date: formatDate(),
            orderNumber: generateOrderNumber()
        });
        
        if (method === 'Cash') {
            // Show receipt modal for Cash payment
            setShowReceipt(true);
        } else if (method === 'GCash') {
            // Show GCash payment modal
            setGcashStep(1);
            setShowGcashModal(true);
        }
    };

    const completeOrder = (): void => {
        Alert.alert('Thank You!', 'Your order has been placed. Enjoy your coffee!');
        setShowReceipt(false);
        setShowPaymentView(false);
        clearCart();
    };

    const completeGcashPayment = () => {
        // Close GCash modal and show receipt
        setShowGcashModal(false);
        setShowReceipt(true);
    };

    const simulateUploadReceipt = () => {
        // Simulate uploading a receipt
        Alert.alert("Success", "Receipt uploaded successfully!");
        setReceiptUploaded(true);
    };

    const pickImage = async () => {
        // Request permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Please allow access to your photo library to upload a receipt.');
            return;
        }

        // Launch image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setReceiptImage(result.assets[0].uri);
            simulateUploadReceipt();
        }
    };

    const handleRemoveItem = (itemId: string) => {
        const itemToRemove = cart.find(item => item.id === itemId);
        
        if (itemToRemove) {
            // Simply remove one instance of the item
            removeFromCart(itemId);
        }
    };

    const renderCartItem = ({ item }: { item: CartItem }, showRemoveButton: boolean = true) => {
        const itemTotal = item.price * item.quantity;
        return (
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: itemPadding,
                borderBottomWidth: 1,
                borderBottomColor: '#e0e0e0'
            }}>
                <Text style={{ 
                    fontSize: fontSizeNormal,
                    color: '#4E342E'
                }}>
                    {item.name} x {item.quantity}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ 
                        fontSize: fontSizeNormal,
                        color: '#4E342E',
                        marginRight: showRemoveButton ? 16 : 0
                    }}>
                        ₱{itemTotal.toFixed(2)}
                    </Text>
                    {showRemoveButton && (
                        <TouchableOpacity
                            onPress={() => handleRemoveItem(item.id)}
                            style={{
                                padding: 4,
                                backgroundColor: '#EFEBE9',
                                borderRadius: 4,
                                width: isSmallDevice ? 28 : 32,
                                height: isSmallDevice ? 28 : 32,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Ionicons 
                                name="remove" 
                                size={isSmallDevice ? 16 : 20} 
                                color="#D32F2F" 
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    const renderReceiptItem = ({ item }: { item: CartItem }) => {
        const itemTotal = item.price * item.quantity;
        return (
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 8
            }}>
                <Text style={{
                    fontSize: fontSizeSmall,
                    color: '#4E342E'
                }}>
                    {item.name} x {item.quantity}
                </Text>
                <Text style={{
                    fontSize: fontSizeSmall,
                    color: '#4E342E'
                }}>
                    ₱{itemTotal.toFixed(2)}
                </Text>
            </View>
        );
    };

    const subtotal = calculateSubtotal();
    const total = calculateTotal(subtotal);

    const renderReceiptModal = () => {
        if (!receiptData) return null;
        
        return (
            <Modal
                visible={showReceipt}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowReceipt(false)}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    paddingHorizontal: 16
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        width: modalWidth,
                        maxWidth: 500,
                        borderRadius: 12,
                        padding: isSmallDevice ? 16 : 20,
                        maxHeight: modalMaxHeight
                    }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{
                                alignItems: 'center',
                                marginBottom: 16
                            }}>
                                <Text style={{
                                    fontSize: fontSizeSubheading,
                                    fontWeight: 'bold',
                                    color: '#4E342E'
                                }}>
                                    Holy Cup
                                </Text>
                                <Text style={{
                                    fontSize: fontSizeSmall,
                                    color: '#6D4C41',
                                    marginBottom: 4,
                                    textAlign: 'center'
                                }}>
                                    341 Real St, Dumaguete, 6200 Negros Oriental
                                </Text>
                                <Text style={{
                                    fontSize: isSmallDevice ? 10 : 12,
                                    color: '#6D4C41',
                                    marginBottom: 8
                                }}>
                                    Phone: 0976 006 3169
                                </Text>
                                <Text style={{
                                    fontSize: isSmallDevice ? 10 : 12,
                                    color: '#6D4C41'
                                }}>
                                    Receipt #{receiptData.orderNumber}
                                </Text>
                                <Text style={{
                                    fontSize: isSmallDevice ? 10 : 12,
                                    color: '#6D4C41',
                                    marginBottom: 12
                                }}>
                                    {receiptData.date}
                                </Text>
                            </View>
                            
                            <View style={{
                                borderTopWidth: 1,
                                borderBottomWidth: 1,
                                borderColor: '#e0e0e0',
                                paddingVertical: 12,
                                marginBottom: 12
                            }}>
                                <Text style={{
                                    fontWeight: 'bold',
                                    color: '#4E342E',
                                    marginBottom: 8,
                                    fontSize: fontSizeNormal
                                }}>
                                    Order Details:
                                </Text>
                                {receiptData.items.map(item => {
                                    const itemTotal = item.price * item.quantity;
                                    return (
                                        <View 
                                            key={item.id} 
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                paddingVertical: 8
                                            }}
                                        >
                                            <Text style={{
                                                fontSize: fontSizeSmall,
                                                color: '#4E342E'
                                            }}>
                                                {item.name} x {item.quantity}
                                            </Text>
                                            <Text style={{
                                                fontSize: fontSizeSmall,
                                                color: '#4E342E'
                                            }}>
                                                ₱{itemTotal.toFixed(2)}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                            
                            <View style={{ marginBottom: 20 }}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingVertical: 4
                                }}>
                                    <Text style={{
                                        color: '#4E342E',
                                        fontSize: fontSizeSmall
                                    }}>
                                        Subtotal:
                                    </Text>
                                    <Text style={{
                                        color: '#4E342E',
                                        fontSize: fontSizeSmall
                                    }}>
                                        ₱{receiptData.subtotal.toFixed(2)}
                                    </Text>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingVertical: 4,
                                    borderTopWidth: 1,
                                    borderColor: '#e0e0e0',
                                    marginTop: 4,
                                    paddingTop: 8
                                }}>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        color: '#4E342E',
                                        fontSize: fontSizeNormal
                                    }}>
                                        Total:
                                    </Text>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        color: '#4E342E',
                                        fontSize: fontSizeNormal
                                    }}>
                                        ₱{receiptData.total.toFixed(2)}
                                    </Text>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingVertical: 4,
                                    marginTop: 8
                                }}>
                                    <Text style={{
                                        color: '#4E342E',
                                        fontSize: fontSizeSmall
                                    }}>
                                        Payment Method:
                                    </Text>
                                    <Text style={{
                                        color: '#4E342E',
                                        fontSize: fontSizeSmall
                                    }}>
                                        {paymentMethod}
                                    </Text>
                                </View>
                            </View>
                            
                            <View style={{
                                alignItems: 'center',
                                marginBottom: 20
                            }}>
                                <Text style={{
                                    color: '#4E342E',
                                    marginBottom: 4,
                                    fontSize: fontSizeSmall
                                }}>
                                    Thank you for your purchase!
                                </Text>
                                <Text style={{
                                    fontSize: isSmallDevice ? 10 : 12,
                                    color: '#6D4C41'
                                }}>
                                    Please come again
                                </Text>
                            </View>
                        </ScrollView>
                        
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#6D4C41',
                                paddingVertical: buttonPadding,
                                borderRadius: 8,
                                alignItems: 'center',
                                marginTop: 12
                            }}
                            onPress={completeOrder}
                        >
                            <Text style={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: fontSizeNormal
                            }}>
                                Done
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    const renderGcashModal = () => {
        return (
            <Modal
                visible={showGcashModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowGcashModal(false)}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    paddingHorizontal: 16
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        width: modalWidth,
                        maxWidth: 500,
                        borderRadius: 12,
                        padding: isSmallDevice ? 16 : 20,
                        maxHeight: modalMaxHeight
                    }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{
                                alignItems: 'center',
                                marginBottom: 16
                            }}>
                                <Text style={{
                                    fontSize: fontSizeSubheading,
                                    fontWeight: 'bold',
                                    color: '#007EFF',
                                    marginBottom: 8
                                }}>
                                    GCash Payment
                                </Text>
                                <Text style={{
                                    fontSize: fontSizeNormal,
                                    color: '#4E342E',
                                    marginBottom: 16
                                }}>
                                    Total: ₱{receiptData?.total.toFixed(2)}
                                </Text>
                                
                                <View style={{
                                    width: '100%',
                                    marginBottom: sectionSpacing
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginBottom: 8
                                    }}>
                                        <View style={{
                                            backgroundColor: '#007EFF',
                                            width: 24,
                                            height: 24,
                                            borderRadius: 12,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: 8
                                        }}>
                                            <Text style={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                                fontSize: fontSizeSmall
                                            }}>
                                                1
                                            </Text>
                                        </View>
                                        <Text style={{
                                            fontSize: fontSizeNormal,
                                            fontWeight: 'bold',
                                            color: '#4E342E'
                                        }}>
                                            Send payment to:
                                        </Text>
                                    </View>
                                    <View style={{
                                        backgroundColor: '#f5f5f5',
                                        padding: 16,
                                        borderRadius: 8
                                    }}>
                                        <Text style={{
                                            fontSize: fontSizeNormal,
                                            color: '#4E342E'
                                        }}>
                                            GCash Number: 0917 123 4567
                                        </Text>
                                        <Text style={{
                                            fontSize: fontSizeNormal,
                                            color: '#4E342E'
                                        }}>
                                            Account Name: Holy Cup Coffee
                                        </Text>
                                    </View>
                                </View>
                                
                                <View style={{
                                    width: '100%',
                                    marginBottom: sectionSpacing
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginBottom: 8
                                    }}>
                                        <View style={{
                                            backgroundColor: '#007EFF',
                                            width: 24,
                                            height: 24,
                                            borderRadius: 12,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: 8
                                        }}>
                                            <Text style={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                                fontSize: fontSizeSmall
                                            }}>
                                                2
                                            </Text>
                                        </View>
                                        <Text style={{
                                            fontSize: fontSizeNormal,
                                            fontWeight: 'bold',
                                            color: '#4E342E'
                                        }}>
                                            Upload screenshot of receipt
                                        </Text>
                                    </View>
                                    
                                    {receiptUploaded ? (
                                        <View style={{ alignItems: 'center' }}>
                                            {receiptImage ? (
                                                <Image 
                                                    source={{ uri: receiptImage }}
                                                    style={{
                                                        width: '100%',
                                                        height: receiptImageHeight,
                                                        borderRadius: 8,
                                                        marginBottom: 8
                                                    }}
                                                    resizeMode="contain" // Changed to contain to show full image
                                                />
                                            ) : (
                                                <View style={{
                                                    backgroundColor: '#e8f5e9',
                                                    padding: 12,
                                                    borderRadius: 8,
                                                    marginBottom: 8,
                                                    alignItems: 'center'
                                                }}>
                                                    <Ionicons name="checkmark-circle" size={isTablet ? 60 : 50} color="green" />
                                                </View>
                                            )}
                                            <Text style={{
                                                color: 'green',
                                                fontSize: fontSizeSmall
                                            }}>
                                                Receipt uploaded successfully!
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={{ 
                                            alignItems: 'center',
                                            flexDirection: isLandscape && !isSmallDevice ? 'row' : 'column',
                                            justifyContent: 'center'
                                        }}>
                                            <TouchableOpacity 
                                                style={{
                                                    backgroundColor: '#007EFF',
                                                    paddingVertical: buttonPadding,
                                                    paddingHorizontal: 24,
                                                    borderRadius: 8,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginBottom: isLandscape && !isSmallDevice ? 0 : 12,
                                                    marginRight: isLandscape && !isSmallDevice ? 12 : 0,
                                                    minWidth: isLandscape && !isSmallDevice ? 150 : '100%'
                                                }}
                                                onPress={pickImage}
                                            >
                                                <Ionicons name="images-outline" size={isSmallDevice ? 20 : 24} color="white" />
                                                <Text style={{
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    marginLeft: 8,
                                                    fontSize: fontSizeSmall
                                                }}>
                                                    Choose from Gallery
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity 
                                                style={{
                                                    backgroundColor: '#6D4C41',
                                                    paddingVertical: buttonPadding,
                                                    paddingHorizontal: 24,
                                                    borderRadius: 8,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    minWidth: isLandscape && !isSmallDevice ? 150 : '100%'
                                                }}
                                                onPress={pickImage}
                                            >
                                                <Ionicons name="camera-outline" size={isSmallDevice ? 20 : 24} color="white" />
                                                <Text style={{
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    marginLeft: 8,
                                                    fontSize: fontSizeSmall
                                                }}>
                                                    Take Photo
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </ScrollView>
                        
                        <TouchableOpacity
                            style={{
                                paddingVertical: buttonPadding,
                                borderRadius: 8,
                                alignItems: 'center',
                                backgroundColor: receiptUploaded ? '#007EFF' : '#e0e0e0',
                                marginTop: 12
                            }}
                            onPress={completeGcashPayment}
                            disabled={!receiptUploaded}
                        >
                            <Text style={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: fontSizeNormal
                            }}>
                                Complete Payment
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    if (showPaymentView) {
        return (
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: '#D7CCC8',
                padding: 16,
                paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 16 : 16,
                paddingBottom: Math.max(16, insets.bottom)
            }}>
                {renderReceiptModal()}
                {renderGcashModal()}
                
                <TouchableOpacity 
                    onPress={() => setShowPaymentView(false)}
                    style={{ marginBottom: 12 }}
                >
                    <Text style={{
                        color: '#6D4C41',
                        fontWeight: 'bold',
                        fontSize: fontSizeNormal
                    }}>
                        ← Back
                    </Text>
                </TouchableOpacity>
                
                <Text style={{
                    fontSize: fontSizeHeading,
                    fontWeight: 'bold',
                    color: '#4E342E',
                    marginBottom: 16
                }}>
                    Payment
                </Text>

                <View style={{
                    borderTopWidth: 1,
                    borderColor: '#e0e0e0',
                    paddingTop: 20
                }}>
                    <Text style={{
                        fontSize: fontSizeSubheading,
                        fontWeight: 'bold',
                        color: '#4E342E',
                        marginBottom: 10
                    }}>
                        Order Summary
                    </Text>
                    <FlatList
                        data={cart}
                        keyExtractor={(item) => item.id}
                        renderItem={(item) => renderCartItem(item, false)}
                        ListEmptyComponent={
                            <Text style={{
                                textAlign: 'center',
                                fontSize: fontSizeNormal,
                                color: '#6D4C41',
                                marginTop: 20
                            }}>
                                Your cart is empty.
                            </Text>
                        }
                        style={{ marginBottom: 20 }}
                    />
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: 6
                    }}>
                        <Text style={{ fontSize: fontSizeNormal }}>Subtotal:</Text>
                        <Text style={{ fontSize: fontSizeNormal }}>₱{subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: 6
                    }}>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: fontSizeNormal
                        }}>
                            Total:
                        </Text>
                        <Text style={{
                            fontWeight: 'bold',
                            color: '#3077e3',
                            fontSize: fontSizeNormal
                        }}>
                            ₱{total.toFixed(2)}
                        </Text>
                    </View>
                </View>

                <View style={{ flex: 1 }} />

                <PaymentMethods 
                    isLandscape={isLandscape}
                    isSmallDevice={isSmallDevice}
                    fontSizeNormal={fontSizeNormal}
                    fontSizeSubheading={fontSizeSubheading}
                    fontSizeSmall={fontSizeSmall}
                    buttonPadding={buttonPadding}
                    sectionSpacing={sectionSpacing}
                    receiptImageHeight={receiptImageHeight}
                    isTablet={isTablet}
                    modalWidth={modalWidth}
                    modalMaxHeight={modalMaxHeight}
                    receiptData={receiptData}
                    showReceipt={showReceipt}
                    showGcashModal={showGcashModal}
                    paymentMethod={paymentMethod}
                    receiptUploaded={receiptUploaded}
                    receiptImage={receiptImage}
                    handlePayment={handlePayment}
                    setShowReceipt={setShowReceipt}
                    setShowGcashModal={setShowGcashModal}
                    completeOrder={completeOrder}
                    completeGcashPayment={completeGcashPayment}
                    pickImage={pickImage}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: '#D7CCC8',
            padding: 16,
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 16 : 16,
            paddingBottom: Math.max(16, insets.bottom)
        }}>
            <Text style={{
                fontSize: fontSizeHeading,
                fontWeight: 'bold',
                color: '#4E342E',
                marginBottom: 16
            }}>
                Your Order
            </Text>

            <FlatList
                data={cart}
                keyExtractor={(item) => item.id}
                renderItem={(item) => renderCartItem(item, true)}
                ListEmptyComponent={
                    <Text style={{
                        textAlign: 'center',
                        fontSize: fontSizeNormal,
                        color: '#6D4C41',
                        marginTop: 20
                    }}>
                        Your cart is empty.
                    </Text>
                }
                style={{ marginBottom: 20 }}
            />

            <View style={{
                borderTopWidth: 1,
                borderColor: '#e0e0e0',
                paddingTop: 20
            }}>
                <Text style={{
                    fontSize: fontSizeSubheading,
                    fontWeight: 'bold',
                    color: '#4E342E',
                    marginBottom: 10
                }}>
                    Order Summary
                </Text>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 6
                }}>
                    <Text style={{ fontSize: fontSizeNormal }}>Subtotal:</Text>
                    <Text style={{ fontSize: fontSizeNormal }}>₱{subtotal.toFixed(2)}</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 6
                }}>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: fontSizeNormal
                    }}>
                        Total:
                    </Text>
                    <Text style={{
                        fontWeight: 'bold',
                        color: '#3077e3',
                        fontSize: fontSizeNormal
                    }}>
                        ₱{total.toFixed(2)}
                    </Text>
                </View>
            </View>

            <View style={{ flex: 1 }} />

            <View style={{
                flexDirection: isLandscape && !isSmallDevice ? 'row' : 'column',
                marginTop: 20
            }}>
                {isLandscape && !isSmallDevice ? (
                    <>

                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: '#6D4C41',
                                paddingVertical: buttonPadding,
                                borderRadius: 8,
                                alignItems: 'center'
                            }}
                            onPress={proceedToPayment}
                        >
                            <Text style={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: fontSizeNormal
                            }}>
                                Proceed to Payment
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#6D4C41',
                                paddingVertical: buttonPadding,
                                borderRadius: 8,
                                alignItems: 'center',
                                marginBottom: 12
                            }}
                            onPress={proceedToPayment}
                        >
                            <Text style={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: fontSizeNormal
                            }}>
                                Proceed to Payment
                            </Text>
                        </TouchableOpacity>

                    </>
                )}
            </View>
        </SafeAreaView>
    );
}