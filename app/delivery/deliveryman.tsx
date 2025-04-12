import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, FlatList, Modal, Image, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

// Enhanced types for our data
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface DeliveryItem {
  id: string;
  customer: string;
  address: string;
  status: 'Pending' | 'Ongoing' | 'Completed';
  time: string;
  estimatedDelivery: string;
  orderItems: OrderItem[];
  totalAmount: number;
  phoneNumber: string;
  paymentMethod: 'GCash' | 'COD'; // Changed from 'Prepaid' | 'COD'
}

interface NotificationItem {
  id: string;
  message: string;
  time: string;
}

const DeliveryDashboard = () => {
    const router = useRouter();
    const [selectedDelivery, setSelectedDelivery] = useState<DeliveryItem | null>(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showDeliveryConfirmModal, setShowDeliveryConfirmModal] = useState(false);
    const [deliveryProofImage, setDeliveryProofImage] = useState<string | null>(null);
    const [customerSignature, setCustomerSignature] = useState<string>('');
    const [cashReceived, setCashReceived] = useState<string>('');
    const [cashChange, setCashChange] = useState<number>(0);
    
    // Enhanced delivery data with payment method
    const [deliveries, setDeliveries] = useState<DeliveryItem[]>([
        { 
            id: '1', 
            customer: 'John Doe', 
            address: '123 Coffee St., Dumaguete City', 
            status: 'Pending', 
            time: '10:30 AM',
            estimatedDelivery: '11:15 AM',
            phoneNumber: '+63 917 123 4567',
            orderItems: [
                { id: '1-1', name: 'Espresso', quantity: 2, price: 175 },
                { id: '1-2', name: 'Croissant', quantity: 1, price: 95 },
            ],
            totalAmount: 445,
            paymentMethod: 'COD'
        },
        { 
            id: '2', 
            customer: 'Jane Smith', 
            address: '456 Brew Ave., Bantayan', 
            status: 'Ongoing', 
            time: '11:15 AM',
            estimatedDelivery: '11:45 AM',
            phoneNumber: '+63 945 678 9012',
            orderItems: [
                { id: '2-1', name: 'Cappuccino', quantity: 1, price: 225 },
                { id: '2-2', name: 'Chocolate Muffin', quantity: 2, price: 85 },
            ],
            totalAmount: 395,
            paymentMethod: 'GCash'
        },
        { 
            id: '3', 
            customer: 'Michael Brown', 
            address: '789 Latte Rd., Sibulan', 
            status: 'Completed', 
            time: '09:45 AM',
            estimatedDelivery: '10:30 AM',
            phoneNumber: '+63 908 765 4321',
            orderItems: [
                { id: '3-1', name: 'Americano', quantity: 3, price: 185 },
            ],
            totalAmount: 555,
            paymentMethod: 'COD'
        },
        { 
            id: '4', 
            customer: 'Emily Davis', 
            address: '101 Espresso Blvd., Valencia', 
            status: 'Pending', 
            time: '12:00 PM',
            estimatedDelivery: '12:45 PM',
            phoneNumber: '+63 927 456 7890',
            orderItems: [
                { id: '4-1', name: 'Latte', quantity: 2, price: 240 },
                { id: '4-2', name: 'Blueberry Cheesecake', quantity: 1, price: 150 },
                { id: '4-3', name: 'Ham & Cheese Sandwich', quantity: 1, price: 175 },
            ],
            totalAmount: 805,
            paymentMethod: 'GCash'
        },
    ]);
    
    const [notifications, setNotifications] = useState<NotificationItem[]>([
        { id: '1', message: 'New order assigned to you!', time: 'Just now' },
        { id: '2', message: 'Customer changed delivery location', time: '5 min ago' },
    ]);

    // Count deliveries by status
    const pendingCount = deliveries.filter(d => d.status === 'Pending').length;
    const ongoingCount = deliveries.filter(d => d.status === 'Ongoing').length;
    const completedCount = deliveries.filter(d => d.status === 'Completed').length;

    // Simulate receiving a new order
    useEffect(() => {
        const timer = setTimeout(() => {
            setNotifications(prev => [
                { id: (prev.length + 1).toString(), message: 'New delivery assigned!', time: 'Just now' },
                ...prev
            ]);
        }, 5000); // Show notification after 5 seconds
        
        return () => clearTimeout(timer);
    }, []);

    const openMap = () => {
        // This would open the map app or navigate to a map view
        alert('Opening map view...');
        // router.push('/delivery/map');
    };

    const openOrderDetails = (delivery: DeliveryItem) => {
        setSelectedDelivery(delivery);
        setShowOrderModal(true);
    };

    const startDeliveryConfirmation = () => {
        if (selectedDelivery) {
            setDeliveryProofImage(null);
            setCustomerSignature('');
            setCashReceived('');
            setCashChange(0);
            setShowDeliveryConfirmModal(true);
            setShowOrderModal(false);
        }
    };

    // Function to take or pick a delivery proof photo
    const takeDeliveryPhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need camera permissions to take delivery proof photos');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setDeliveryProofImage(result.assets[0].uri);
        }
    };

    // Function to handle order delivery completion
    const completeDelivery = () => {
        if (!selectedDelivery) return;

        // For COD orders, validate payment
        if (selectedDelivery.paymentMethod === 'COD') {
            if (!cashReceived || parseFloat(cashReceived) < selectedDelivery.totalAmount) {
                Alert.alert('Payment Error', 'Please collect the full payment amount before completing delivery');
                return;
            }
        }
        // For GCash orders, no validation needed as it's already paid

        // Update order status
        setDeliveries(prevDeliveries => 
            prevDeliveries.map(delivery => 
                delivery.id === selectedDelivery.id
                    ? { ...delivery, status: 'Completed' }
                    : delivery
            )
        );

        // Add to notifications
        setNotifications(prev => [
            { 
                id: (prev.length + 1).toString(), 
                message: `Order #${selectedDelivery.id} marked as delivered!`, 
                time: 'Just now' 
            },
            ...prev
        ]);

        // Show success message
        Alert.alert(
            'Delivery Completed', 
            `Order #${selectedDelivery.id} has been successfully delivered to ${selectedDelivery.customer}!`,
            [{ text: 'OK', onPress: () => setShowDeliveryConfirmModal(false) }]
        );
    };

    // Function to calculate change for COD orders
    const calculateChange = (amount: string) => {
        if (!selectedDelivery || !amount) return;
        
        const receivedAmount = parseFloat(amount);
        const orderTotal = selectedDelivery.totalAmount;
        
        if (!isNaN(receivedAmount) && receivedAmount >= orderTotal) {
            setCashChange(receivedAmount - orderTotal);
        } else {
            setCashChange(0);
        }
    };

    // Changes to make payment method displays more visible

    // 1. Update the DeliveryItem list card - make payment method more prominent
    const renderDeliveryItem = ({ item }: { item: DeliveryItem }) => (
        <TouchableOpacity
            className="mb-3 p-4 rounded-lg bg-[#EFEBE9]"
            onPress={() => openOrderDetails(item)}
        >
            {/* Customer Information */}
            <View className="flex-row justify-between items-center mb-1">
                <Text className="text-base font-bold text-[#4E342E]">{item.customer}</Text>
                <Text className={`px-2 py-1 rounded-full text-xs ${
                    item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    item.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                }`}>
                    {item.status}
                </Text>
            </View>
            
            {/* Payment Badge - Enhanced to be more visible */}
            <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center">
                    <Ionicons name="location-outline" size={14} color="#8D6E63" style={{ marginTop: 2, marginRight: 4 }} />
                    <Text className="text-[#6D4C41] flex-1" numberOfLines={1} ellipsizeMode="tail">
                        {item.address}
                    </Text>
                </View>
            </View>
            
            {/* Payment Method - Moved to its own row for better visibility */}
            <View className="flex-row items-center mb-2">
                <Ionicons 
                    name={item.paymentMethod === 'GCash' ? "wallet-outline" : "cash-outline"} 
                    size={14} 
                    color="#8D6E63" 
                    style={{ marginRight: 4 }}
                />
                <Text className="text-xs text-[#6D4C41] mr-2">Payment:</Text>
                <View className={`px-3 py-1 rounded-md ${
                    item.paymentMethod === 'GCash' ? 'bg-blue-100' : 'bg-amber-100'
                }`}>
                    <Text className={`text-xs font-medium ${
                        item.paymentMethod === 'GCash' ? 'text-blue-700' : 'text-amber-700'
                    }`}>
                        {item.paymentMethod}
                    </Text>
                </View>
            </View>
            
            {/* Order Summary */}
            <View className="mb-2 bg-white rounded-md p-2 mt-1">
                <Text className="text-xs font-bold text-[#5D4037]">ORDER SUMMARY:</Text>
                {item.orderItems.slice(0, 2).map((orderItem, index) => (
                    <Text key={orderItem.id} className="text-xs text-[#5D4037]">
                        {orderItem.quantity}x {orderItem.name}
                    </Text>
                ))}
                {item.orderItems.length > 2 && (
                    <Text className="text-xs text-[#5D4037]">+ {item.orderItems.length - 2} more items</Text>
                )}
                <Text className="text-xs font-bold text-[#5D4037] mt-1">
                    Total: ₱{item.totalAmount.toFixed(2)}
                </Text>
            </View>
            
            {/* Times */}
            <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={14} color="#8D6E63" />
                    <Text className="text-xs text-[#8D6E63] ml-1">Ordered: {item.time}</Text>
                </View>
                <View className="flex-row items-center">
                    <Ionicons name="timer-outline" size={14} color="#8D6E63" />
                    <Text className="text-xs text-[#8D6E63] ml-1">Deliver by: {item.estimatedDelivery}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderNotificationItem = ({ item }: { item: NotificationItem }) => (
        <View className="mb-2 p-3 rounded-lg bg-[#D7CCC8] border-l-4 border-[#795548]">
            <Text className="text-[#4E342E]">{item.message}</Text>
            <Text className="text-xs text-[#8D6E63] mt-1">{item.time}</Text>
        </View>
    );

    // 2. Update the Order Details Modal - make payment method more prominent
    const renderOrderDetailsModal = () => {
        if (!selectedDelivery) return null;
        
        return (
            <Modal
                visible={showOrderModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowOrderModal(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white w-[90%] rounded-lg p-5 max-h-[80%]">
                        <ScrollView>
                            {/* Header with close button */}
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-xl font-bold text-[#4E342E]">Order Details</Text>
                                <TouchableOpacity onPress={() => setShowOrderModal(false)}>
                                    <Ionicons name="close-circle" size={24} color="#8D6E63" />
                                </TouchableOpacity>
                            </View>
                            
                            {/* Order ID */}
                            <View className="bg-[#EFEBE9] p-3 rounded-md mb-4">
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-[#5D4037] font-bold text-base">Order #{selectedDelivery.id}</Text>
                                    <Text className="text-[#5D4037]">Status: {selectedDelivery.status}</Text>
                                </View>
                            </View>
                            
                            {/* Payment Method - Enhanced, moved to its own section */}
                            <View className="mb-4">
                                <View className="flex-row items-center">
                                    <Ionicons 
                                        name={selectedDelivery.paymentMethod === 'GCash' ? "wallet" : "cash"} 
                                        size={20} 
                                        color={selectedDelivery.paymentMethod === 'GCash' ? "#0073ff" : "#ff8f00"} 
                                        style={{ marginRight: 8 }}
                                    />
                                    <Text className="text-lg font-bold text-[#4E342E]">Payment Method</Text>
                                </View>
                                <View className={`mt-2 p-3 rounded-md ${
                                    selectedDelivery.paymentMethod === 'GCash' ? 'bg-blue-50' : 'bg-amber-50'
                                }`}>
                                    <Text className={`text-base font-medium ${
                                        selectedDelivery.paymentMethod === 'GCash' ? 'text-blue-700' : 'text-amber-700'
                                    }`}>
                                        {selectedDelivery.paymentMethod}
                                    </Text>
                                    <Text className="text-xs text-gray-500 mt-1">
                                        {selectedDelivery.paymentMethod === 'GCash' ? 
                                            'Payment already completed via GCash' : 
                                            'Payment to be collected upon delivery'
                                        }
                                    </Text>
                                </View>
                            </View>
                            
                            {/* Rest of the content remains unchanged */}
                            {/* Customer Information */}
                            <Text className="text-lg font-bold text-[#4E342E] mb-2">Customer Information</Text>
                            <View className="bg-[#EFEBE9] p-3 rounded-md mb-4">
                                <View className="flex-row mb-1">
                                    <Ionicons name="person-outline" size={16} color="#8D6E63" style={{ marginRight: 8, marginTop: 2 }} />
                                    <Text className="text-[#5D4037] flex-1">{selectedDelivery.customer}</Text>
                                </View>
                                <View className="flex-row mb-1">
                                    <Ionicons name="call-outline" size={16} color="#8D6E63" style={{ marginRight: 8, marginTop: 2 }} />
                                    <Text className="text-[#5D4037]">{selectedDelivery.phoneNumber}</Text>
                                </View>
                                <View className="flex-row">
                                    <Ionicons name="location-outline" size={16} color="#8D6E63" style={{ marginRight: 8, marginTop: 2 }} />
                                    <Text className="text-[#5D4037] flex-1">{selectedDelivery.address}</Text>
                                </View>
                            </View>
                            
                            {/* Order Items */}
                            <Text className="text-lg font-bold text-[#4E342E] mb-2">Order Items</Text>
                            <View className="bg-[#EFEBE9] p-3 rounded-md mb-4">
                                {selectedDelivery.orderItems.map((item) => (
                                    <View key={item.id} className="flex-row justify-between mb-2">
                                        <Text className="text-[#5D4037]">{item.quantity}x {item.name}</Text>
                                        <Text className="text-[#5D4037]">₱{(item.price * item.quantity).toFixed(2)}</Text>
                                    </View>
                                ))}
                                <View className="border-t border-[#BCAAA4] my-2 pt-2">
                                    <View className="flex-row justify-between">
                                        <Text className="font-bold text-[#5D4037]">Total</Text>
                                        <Text className="font-bold text-[#5D4037]">₱{selectedDelivery.totalAmount.toFixed(2)}</Text>
                                    </View>
                                </View>
                            </View>
                            
                            {/* Delivery Time */}
                            <Text className="text-lg font-bold text-[#4E342E] mb-2">Delivery Schedule</Text>
                            <View className="bg-[#EFEBE9] p-3 rounded-md mb-4">
                                <View className="flex-row justify-between mb-2">
                                    <View className="flex-row items-center">
                                        <Ionicons name="time-outline" size={16} color="#8D6E63" style={{ marginRight: 8 }} />
                                        <Text className="text-[#5D4037]">Order Time:</Text>
                                    </View>
                                    <Text className="text-[#5D4037]">{selectedDelivery.time}</Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <View className="flex-row items-center">
                                        <Ionicons name="timer-outline" size={16} color="#8D6E63" style={{ marginRight: 8 }} />
                                        <Text className="text-[#5D4037]">Estimated Delivery:</Text>
                                    </View>
                                    <Text className="font-bold text-[#5D4037]">{selectedDelivery.estimatedDelivery}</Text>
                                </View>
                            </View>
                            
                            {/* Action Buttons */}
                            <View className="flex-row justify-between">
                                <TouchableOpacity 
                                    className="flex-1 bg-[#8D6E63] py-3 rounded-md mr-2 flex-row justify-center items-center"
                                    onPress={openMap}
                                >
                                    <Ionicons name="map-outline" size={20} color="white" style={{ marginRight: 8 }} />
                                    <Text className="text-white font-bold">Navigate</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    className="flex-1 bg-[#4CAF50] py-3 rounded-md ml-2 flex-row justify-center items-center"
                                    onPress={startDeliveryConfirmation}
                                >
                                    <Ionicons name="checkmark-circle-outline" size={20} color="white" style={{ marginRight: 8 }} />
                                    <Text className="text-white font-bold">Mark Delivered</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        );
    };

    // 3. Update the Delivery Confirmation Modal - make payment method clearer
    const renderDeliveryConfirmModal = () => {
        if (!selectedDelivery) return null;
        
        const isGcash = selectedDelivery.paymentMethod === 'GCash';
        
        return (
            <Modal
                visible={showDeliveryConfirmModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowDeliveryConfirmModal(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white w-[90%] rounded-lg p-5 max-h-[90%]">
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Header with back button */}
                            <View className="flex-row justify-between items-center mb-4">
                                <TouchableOpacity onPress={() => {
                                    setShowDeliveryConfirmModal(false);
                                    setShowOrderModal(true);
                                }}>
                                    <Ionicons name="arrow-back" size={24} color="#8D6E63" />
                                </TouchableOpacity>
                                <Text className="text-xl font-bold text-center text-[#4E342E]">Delivery Confirmation</Text>
                                <View style={{ width: 24 }} /> {/* Empty view for spacing */}
                            </View>
                            
                            {/* Order Summary with Clear Payment Method */}
                            <View className="mb-5">
                                <Text className="text-base font-bold text-[#5D4037] mb-2">Order Information</Text>
                                <View className="bg-[#EFEBE9] p-3 rounded-lg">
                                    <View className="flex-row justify-between mb-1">
                                        <Text className="text-[#5D4037] font-medium">Order #:</Text>
                                        <Text className="text-[#5D4037] font-bold">{selectedDelivery.id}</Text>
                                    </View>
                                    <View className="flex-row justify-between mb-1">
                                        <Text className="text-[#5D4037] font-medium">Customer:</Text>
                                        <Text className="text-[#5D4037]">{selectedDelivery.customer}</Text>
                                    </View>
                                    <View className="flex-row justify-between mb-1">
                                        <Text className="text-[#5D4037] font-medium">Total Amount:</Text>
                                        <Text className="text-[#5D4037] font-bold">₱{selectedDelivery.totalAmount.toFixed(2)}</Text>
                                    </View>
                                </View>
                            </View>
                            
                            {/* Payment Method - Given more prominence */}
                            <View className="mb-5">
                                <Text className="text-base font-bold text-[#5D4037] mb-2">Payment Method</Text>
                                <View className={`p-4 rounded-lg flex-row items-center justify-between ${
                                    isGcash ? 'bg-blue-50' : 'bg-amber-50'
                                }`}>
                                    <View className="flex-row items-center">
                                        <Ionicons 
                                            name={isGcash ? "wallet" : "cash"} 
                                            size={24} 
                                            color={isGcash ? "#0073ff" : "#ff8f00"} 
                                            style={{ marginRight: 10 }}
                                        />
                                        <Text className={`text-lg font-bold ${
                                            isGcash ? 'text-blue-700' : 'text-amber-700'
                                        }`}>
                                            {isGcash ? 'GCash' : 'COD'}
                                        </Text>
                                    </View>
                                    <View className={`py-1 px-3 rounded-full ${
                                        isGcash ? 'bg-blue-100' : 'bg-amber-100'
                                    }`}>
                                        <Text className={`text-xs font-medium ${
                                            isGcash ? 'text-blue-800' : 'text-amber-800'
                                        }`}>
                                            {isGcash ? 'Pre-paid' : 'Collect Payment'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            
                            {/* Payment Collection for COD - Skip for GCash */}
                            {!isGcash && (
                                <View className="mb-5">
                                    <Text className="text-lg font-bold text-[#4E342E] mb-2">Payment Collection</Text>
                                    <View className="bg-[#EFEBE9] p-4 rounded-lg">
                                        <View className="flex-row items-center justify-between mb-3">
                                            <Text className="text-[#5D4037]">Order Amount:</Text>
                                            <Text className="text-[#5D4037] font-bold">₱{selectedDelivery.totalAmount.toFixed(2)}</Text>
                                        </View>
                                        <View className="mb-3">
                                            <Text className="text-[#5D4037] mb-1">Cash Received:</Text>
                                            <View className="flex-row items-center">
                                                <Text className="text-[#5D4037] font-bold mr-2">₱</Text>
                                                <TextInput
                                                    className="flex-1 bg-white p-2 rounded-md border border-[#BCAAA4]"
                                                    keyboardType="numeric"
                                                    value={cashReceived}
                                                    onChangeText={(text) => {
                                                        setCashReceived(text);
                                                        calculateChange(text);
                                                    }}
                                                    placeholder="Enter amount"
                                                />
                                            </View>
                                        </View>
                                        <View className="flex-row items-center justify-between pt-2 border-t border-[#BCAAA4]">
                                            <Text className="text-[#5D4037]">Change:</Text>
                                            <Text className="text-[#5D4037] font-bold">
                                                ₱{cashChange.toFixed(2)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                            
                            {/* GCash Payment Verification Section - New section for GCash */}
                            {isGcash && (
                                <View className="mb-5">
                                    <Text className="text-lg font-bold text-[#4E342E] mb-2">GCash Payment Verification</Text>
                                    <View className="bg-[#EFEBE9] p-4 rounded-lg">
                                        <View className="items-center mb-3">
                                            <Ionicons name="checkmark-circle" size={40} color="#007bff" />
                                            <Text className="text-[#5D4037] font-medium mt-2">Payment Already Completed via GCash</Text>
                                        </View>
                                        <Text className="text-xs text-[#8D6E63] italic text-center">
                                            Verify with the customer that payment was successfully made
                                        </Text>
                                    </View>
                                </View>
                            )}
                            
                            {/* Rest of the modal content remains the same */}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#D7CCC8" />
            <SafeAreaView className="flex-1 bg-[#D7CCC8]">
                <ScrollView className="flex-1 p-4">
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-6">
                        <View>
                            <Text className="text-2xl font-bold text-[#4E342E]">Delivery Dashboard</Text>
                            <Text className="text-[#6D4C41]">Welcome back, Delivery Partner</Text>
                        </View>
                        <TouchableOpacity 
                            className="w-10 h-10 rounded-full bg-[#795548] items-center justify-center"
                            onPress={() => alert('Profile settings')}
                        >
                            <Ionicons name="person" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Delivery Stats Summary */}
                    <View className="flex-row justify-between mb-6">
                        <View className="flex-1 bg-[#FFCC80] p-3 rounded-lg mr-2 items-center">
                            <Text className="text-2xl font-bold text-[#4E342E]">{pendingCount}</Text>
                            <Text className="text-[#4E342E]">Pending</Text>
                        </View>
                        <View className="flex-1 bg-[#90CAF9] p-3 rounded-lg mx-2 items-center">
                            <Text className="text-2xl font-bold text-[#4E342E]">{ongoingCount}</Text>
                            <Text className="text-[#4E342E]">Ongoing</Text>
                        </View>
                        <View className="flex-1 bg-[#A5D6A7] p-3 rounded-lg ml-2 items-center">
                            <Text className="text-2xl font-bold text-[#4E342E]">{completedCount}</Text>
                            <Text className="text-[#4E342E]">Completed</Text>
                        </View>
                    </View>

                    {/* Map Shortcut */}
                    <TouchableOpacity 
                        className="bg-[#5D4037] p-4 rounded-lg mb-6 flex-row items-center justify-center"
                        onPress={openMap}
                    >
                        <Ionicons name="map" size={24} color="white" />
                        <Text className="text-white text-base ml-2">Open Delivery Map</Text>
                    </TouchableOpacity>

                    {/* Real-time Updates */}
                    <View className="mb-6">
                        <Text className="text-lg font-bold text-[#4E342E] mb-2">Real-time Updates</Text>
                        <FlatList
                            data={notifications}
                            renderItem={renderNotificationItem}
                            keyExtractor={item => item.id}
                            scrollEnabled={false}
                        />
                    </View>

                    {/* Current Deliveries */}
                    <View>
                        <Text className="text-lg font-bold text-[#4E342E] mb-2">Your Deliveries</Text>
                        <FlatList
                            data={deliveries}
                            renderItem={renderDeliveryItem}
                            keyExtractor={item => item.id}
                            scrollEnabled={false}
                        />
                    </View>
                </ScrollView>

                {/* Bottom Navigation */}
                <View className="flex-row bg-[#795548] p-2">
                    <TouchableOpacity className="flex-1 items-center p-2">
                        <Ionicons name="home" size={24} color="white" />
                        <Text className="text-white text-xs">Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 items-center p-2">
                        <Ionicons name="list" size={24} color="#D7CCC8" />
                        <Text className="text-[#D7CCC8] text-xs">Orders</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 items-center p-2">
                        <Ionicons name="notifications" size={24} color="#D7CCC8" />
                        <Text className="text-[#D7CCC8] text-xs">Alerts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 items-center p-2">
                        <Ionicons name="person" size={24} color="#D7CCC8" />
                        <Text className="text-[#D7CCC8] text-xs">Profile</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            
            {/* Order Details Modal */}
            {renderOrderDetailsModal()}
            
            {/* Delivery Confirmation Modal */}
            {renderDeliveryConfirmModal()}
        </>
    );
};

export default DeliveryDashboard;