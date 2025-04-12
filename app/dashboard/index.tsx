import React from 'react';
import { View, Text, SafeAreaView, Image, FlatList, TouchableOpacity, Alert, ImageSourcePropType } from 'react-native';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo
import espressoImage from '../../assets/images/espresso.png';
import cappuccinoImage from '../../assets/images/cappuccino.png';
import latteImage from '../../assets/images/latte.png';
import mochaImage from '../../assets/images/mocha.png';
import americanoImage from '../../assets/images/americano.png';
import macchiatoImage from '../../assets/images/macchiato.png';


interface MenuItem {
    id: string;
    name: string;
    price: number;
    description: string;
    image: ImageSourcePropType;
}

const menuItems: MenuItem[] = [
    {
        id: '1',
        name: 'Espresso',
        price: 175.0,
        description: 'Rich and strong espresso shot.',
        image: espressoImage,
    },
    {
        id: '2',
        name: 'Cappuccino',
        price: 225.0,
        description: 'Espresso with steamed milk and foam.',
        image: cappuccinoImage,
    },
    {
        id: '3',
        name: 'Latte',
        price: 240.0,
        description: 'Espresso with steamed milk.',
        image: latteImage,
    },
    {
        id: '4',
        name: 'Mocha',
        price: 265.0,
        description: 'Espresso with chocolate and steamed milk.',
        image: mochaImage,
    },
    {
        id: '5',
        name: 'Americano',
        price: 185.0,
        description: 'Espresso with hot water.',
        image: americanoImage,
    },
    {
        id: '6',
        name: 'Macchiato',
        price: 215.0,
        description: 'Espresso with a dash of foamed milk.',
        image: macchiatoImage,
    },
];

export default function MenuView(): JSX.Element {
    const { addToCart, cart } = useCart();

    // Calculate total quantity of items in cart
    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

    const handleAddToCart = (id: string, name: string, price: number) => {
        addToCart(id, name, price);
        Alert.alert('Added to Cart', `${name} has been added to your cart!`);
    };

    const renderMenuItem = ({ item }: { item: MenuItem }) => (
        <View className="bg-[#f9f9f9] rounded-lg p-4 mb-4 flex-1 mx-2 shadow-md">
            <Image
                source={item.image}
                className="w-full h-[150px] rounded-lg mb-2"
                resizeMode="cover"
                onError={(e) => console.error('Image loading error:', e.nativeEvent.error)}
            />
            <Text className="text-lg font-bold text-[#00695c] mb-1">{item.name}</Text>
            <Text className="font-bold text-[#004d40] mb-2">₱{item.price.toFixed(2)}</Text>
            <Text className="text-sm text-[#6D4C41] mb-3">{item.description}</Text>
            <TouchableOpacity
                className="bg-[#6D4C41] py-2.5 rounded-lg items-center"
                onPress={() => handleAddToCart(item.id, item.name, item.price)}
            >
                <Text className="text-white font-bold">Add to Cart</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#D7CCC8] p-4">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-2xl font-bold text-[#4E342E]">Our Menu</Text>
                
                {/* Cart Icon with Badge */}
                <View className="relative">
                    <Ionicons name="cart" size={30} color="#4E342E" />
                    {cartItemCount > 0 && (
                        <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 flex items-center justify-center">
                            <Text className="text-white text-xs font-bold">{cartItemCount}</Text>
                        </View>
                    )}
                </View>
            </View>

            <FlatList
                data={menuItems}
                keyExtractor={(item) => item.id}
                renderItem={renderMenuItem}
                numColumns={2} // Display items in a grid layout
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}
