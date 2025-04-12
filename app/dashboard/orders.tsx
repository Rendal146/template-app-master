import React, { useState } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Alert, Modal, ScrollView, TextInput, Image } from 'react-native';
import { useCart, CartItem } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function OrderView(): JSX.Element {
    const { cart, removeFromCart, clearCart } = useCart();
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
        tax: number;
        total: number;
        date: string;
        orderNumber: string;
    } | null>(null);

    const calculateSubtotal = (): number => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const calculateTax = (subtotal: number): number => {
        return subtotal * 0.08; // 8% tax
    };

    const calculateTotal = (subtotal: number, tax: number): number => {
        return subtotal + tax;
    };

    const deleteCart = (): void => {
        Alert.alert(
            'Delete Cart',
            'Are you sure you want to delete all items from your cart?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => clearCart(),
                },
            ]
        );
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
        const tax = calculateTax(subtotal);
        const total = calculateTotal(subtotal, tax);
        
        setReceiptData({
            items: [...cart],
            subtotal: subtotal,
            tax: tax,
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

    const renderCartItem = ({ item }: { item: CartItem }) => {
        const itemTotal = item.price * item.quantity;
        return (
            <View className="flex-row justify-between py-2.5 border-b border-gray-200">
                <Text className="text-base text-[#4E342E]">
                    {item.name} x {item.quantity}
                </Text>
                <View className="flex-row items-center">
                    <Text className="text-base text-[#4E342E] mr-4">₱{itemTotal.toFixed(2)}</Text>
                </View>
            </View>
        );
    };

    const renderReceiptItem = ({ item }: { item: CartItem }) => {
        const itemTotal = item.price * item.quantity;
        return (
            <View className="flex-row justify-between py-2">
                <Text className="text-sm text-[#4E342E]">
                    {item.name} x {item.quantity}
                </Text>
                <Text className="text-sm text-[#4E342E]">₱{itemTotal.toFixed(2)}</Text>
            </View>
        );
    };

    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const total = calculateTotal(subtotal, tax);

    const renderReceiptModal = () => {
        if (!receiptData) return null;
        
        return (
            <Modal
                visible={showReceipt}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowReceipt(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white w-[90%] rounded-lg p-5 max-h-[80%]">
                        <ScrollView>
                            <View className="items-center mb-4">
                                <Text className="text-xl font-bold text-[#4E342E]">Holy Cup</Text>
                                <Text className="text-sm text-[#6D4C41] mb-1">341 Real St, Dumaguete, 6200 Negros Oriental</Text>
                                <Text className="text-xs text-[#6D4C41] mb-2">Phone: 0976 006 3169</Text>
                                <Text className="text-xs text-[#6D4C41]">Receipt #{receiptData.orderNumber}</Text>
                                <Text className="text-xs text-[#6D4C41] mb-3">{receiptData.date}</Text>
                            </View>
                            
                            <View className="border-t border-b border-gray-300 py-3 mb-3">
                                <Text className="font-bold text-[#4E342E] mb-2">Order Details:</Text>
                                {receiptData.items.map(item => {
                                    const itemTotal = item.price * item.quantity;
                                    return (
                                        <View key={item.id} className="flex-row justify-between py-2">
                                            <Text className="text-sm text-[#4E342E]">
                                                {item.name} x {item.quantity}
                                            </Text>
                                            <Text className="text-sm text-[#4E342E]">₱{itemTotal.toFixed(2)}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                            
                            <View className="mb-5">
                                <View className="flex-row justify-between py-1">
                                    <Text className="text-[#4E342E]">Subtotal:</Text>
                                    <Text className="text-[#4E342E]">₱{receiptData.subtotal.toFixed(2)}</Text>
                                </View>
                                <View className="flex-row justify-between py-1">
                                    <Text className="text-[#4E342E]">Tax (8%):</Text>
                                    <Text className="text-[#4E342E]">₱{receiptData.tax.toFixed(2)}</Text>
                                </View>
                                <View className="flex-row justify-between py-1 border-t border-gray-300 mt-1 pt-2">
                                    <Text className="font-bold text-[#4E342E]">Total:</Text>
                                    <Text className="font-bold text-[#4E342E]">₱{receiptData.total.toFixed(2)}</Text>
                                </View>
                                <View className="flex-row justify-between py-1 mt-2">
                                    <Text className="text-[#4E342E]">Payment Method:</Text>
                                    <Text className="text-[#4E342E]">{paymentMethod}</Text>
                                </View>
                            </View>
                            
                            <View className="items-center mb-5">
                                <Text className="text-[#4E342E] mb-1">Thank you for your purchase!</Text>
                                <Text className="text-xs text-[#6D4C41]">Please come again</Text>
                            </View>
                        </ScrollView>
                        
                        <TouchableOpacity
                            className="bg-[#6D4C41] py-3 rounded-lg items-center"
                            onPress={completeOrder}
                        >
                            <Text className="text-white font-bold">Done</Text>
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
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white w-[90%] rounded-lg p-5 max-h-[80%]">
                        <ScrollView>
                            <View className="items-center mb-4">
                                <Text className="text-xl font-bold text-[#007EFF] mb-2">GCash Payment</Text>
                                <Text className="text-base text-[#4E342E] mb-4">Total: ₱{receiptData?.total.toFixed(2)}</Text>
                                
                                <View className="w-full mb-6">
                                    <View className="flex-row items-center mb-2">
                                        <View className="bg-[#007EFF] w-6 h-6 rounded-full items-center justify-center mr-2">
                                            <Text className="text-white font-bold">1</Text>
                                        </View>
                                        <Text className="text-lg font-bold text-[#4E342E]">Send payment to:</Text>
                                    </View>
                                    <View className="bg-gray-100 p-4 rounded-lg">
                                        <Text className="text-base text-[#4E342E]">GCash Number: 0917 123 4567</Text>
                                        <Text className="text-base text-[#4E342E]">Account Name: Holy Cup Coffee</Text>
                                    </View>
                                </View>
                                
                                <View className="w-full mb-6">
                                    <View className="flex-row items-center mb-2">
                                        <View className="bg-[#007EFF] w-6 h-6 rounded-full items-center justify-center mr-2">
                                            <Text className="text-white font-bold">2</Text>
                                        </View>
                                        <Text className="text-lg font-bold text-[#4E342E]">Upload screenshot of receipt</Text>
                                    </View>
                                    
                                    {receiptUploaded ? (
                                        <View className="items-center">
                                            {receiptImage ? (
                                                <Image 
                                                    source={{ uri: receiptImage }}
                                                    className="w-full h-[200px] rounded-lg mb-2"
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <View className="bg-green-100 p-3 rounded-lg mb-2">
                                                    <Ionicons name="checkmark-circle" size={50} color="green" />
                                                </View>
                                            )}
                                            <Text className="text-green-700">Receipt uploaded successfully!</Text>
                                        </View>
                                    ) : (
                                        <View className="items-center">
                                            <TouchableOpacity 
                                                className="bg-[#007EFF] py-3 px-6 rounded-lg flex-row items-center justify-center mb-3"
                                                onPress={pickImage}
                                            >
                                                <Ionicons name="camera" size={24} color="white" className="mr-2" />
                                                <Text className="text-white font-bold ml-2">Choose from Gallery</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity 
                                                className="bg-[#6D4C41] py-3 px-6 rounded-lg flex-row items-center justify-center"
                                                onPress={pickImage}
                                            >
                                                <Ionicons name="camera" size={24} color="white" className="mr-2" />
                                                <Text className="text-white font-bold ml-2">Take Photo</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </ScrollView>
                        
                        <TouchableOpacity
                            className={`py-3 rounded-lg items-center ${receiptUploaded ? 'bg-[#007EFF]' : 'bg-gray-400'}`}
                            onPress={completeGcashPayment}
                            disabled={!receiptUploaded}
                        >
                            <Text className="text-white font-bold">Complete Payment</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    if (showPaymentView) {
        return (
            <SafeAreaView className="flex-1 bg-[#D7CCC8] p-4">
                {renderReceiptModal()}
                {renderGcashModal()}
                
                <TouchableOpacity 
                    onPress={() => setShowPaymentView(false)}
                    className="mb-3"
                >
                    <Text className="text-[#6D4C41] font-bold text-lg">← Back</Text>
                </TouchableOpacity>
                
                <Text className="text-2xl font-bold text-[#4E342E] mb-4">Payment</Text>

                <View className="border-t border-gray-300 pt-5">
                    <Text className="text-lg font-bold text-[#4E342E] mb-2.5">Order Summary</Text>
                    <FlatList
                        data={cart}
                        keyExtractor={(item) => item.id}
                        renderItem={renderCartItem}
                        ListEmptyComponent={<Text className="text-center text-base text-[#6D4C41] mt-5">Your cart is empty.</Text>}
                        className="mb-5"
                    />
                    <View className="flex-row justify-between py-1.5">
                        <Text>Tax (8%):</Text>
                        <Text>₱{tax.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between py-1.5">
                        <Text className="font-bold">Total:</Text>
                        <Text className="font-bold text-[#3077e3]">₱{total.toFixed(2)}</Text>
                    </View>
                </View>

                <View className="flex-1" />

                <View className="mt-5">
                    <Text className="text-lg font-bold text-[#4E342E] mb-2.5">Payment Method</Text>
                    <TouchableOpacity
                        className="bg-[#6D4C41] py-3 rounded-lg items-center mx-1 mb-2"
                        onPress={() => handlePayment('Cash')}
                    >
                        <Text className="text-white font-bold">Cash</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-[#6D4C41] py-3 rounded-lg items-center mx-1 mb-5"
                        onPress={() => handlePayment('GCash')}
                    >
                        <Text className="text-white font-bold">GCash</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#D7CCC8] p-4">
            <Text className="text-2xl font-bold text-[#4E342E] mb-4">Your Order</Text>

            <FlatList
                data={cart}
                keyExtractor={(item) => item.id}
                renderItem={renderCartItem}
                ListEmptyComponent={<Text className="text-center text-base text-[#6D4C41] mt-5">Your cart is empty.</Text>}
                className="mb-5"
            />

            <View className="border-t border-gray-300 pt-5">
                <Text className="text-lg font-bold text-[#4E342E] mb-2.5">Order Summary</Text>
                <View className="flex-row justify-between py-1.5">
                    <Text>Subtotal:</Text>
                    <Text>₱{subtotal.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between py-1.5">
                    <Text>Tax (8%):</Text>
                    <Text>₱{tax.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between py-1.5">
                    <Text className="font-bold">Total:</Text>
                    <Text className="font-bold text-[#3077e3]">₱{total.toFixed(2)}</Text>
                </View>
            </View>

            <View className="flex-row justify-between mt-5">
                <TouchableOpacity
                    className="flex-1 bg-white py-3 rounded-lg items-center mx-1 border border-[#D84315]"
                    onPress={deleteCart}
                >
                    <Text className="text-[#D84315] font-bold">Delete Cart</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-1 bg-[#6D4C41] py-3 rounded-lg items-center mx-1"
                    onPress={proceedToPayment}
                >
                    <Text className="text-white font-bold">Proceed to Payment</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}