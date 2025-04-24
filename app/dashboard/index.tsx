import React, { useMemo, useState, useCallback } from 'react';
import { 
    View, 
    Text, 
    SafeAreaView, 
    Image, 
    FlatList, 
    TouchableOpacity, 
    Alert, 
    ImageSourcePropType,
    useWindowDimensions,
    StatusBar,
    Platform,
    ScrollView,
    Modal
} from 'react-native';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

// Import specific non-coffee drink images
const darkChocoImage = require('../../assets/images/dark-choco.png');
const taroMilkImage = require('../../assets/images/taro-milk.png');
const matchaImage = require('../../assets/images/matcha.png');
const mixedBerriesImage = require('../../assets/images/mixed-berries.png');
const strawberryImage = require('../../assets/images/strawberry.png');
const chocoStrawberryImage = require('../../assets/images/choco-strawberry.png'); 
const chocoMatchaImage = require('../../assets/images/choco-matcha.png');
const strawberryMatchaImage = require('../../assets/images/strawberry-matcha.png');

// Import specific hot coffee images
const cafeAmericanoImage = require('../../assets/images/cafe-americano.png');
const cafeLatteeImage = require('../../assets/images/cafe-latte.png');
const hotCappuccinoImage = require('../../assets/images/hot-cappuccino.png');
const hotVanillaLatteImage = require('../../assets/images/hot-vanilla-latte.png');
const hotHazelnutLatteImage = require('../../assets/images/hot-hazelnut-latte.png');
const hotCaramelMacchiatoImage = require('../../assets/images/hot-caramel-macchiato.png');
const hotMochaImage = require('../../assets/images/hot-mocha.png');
const extraEspressoShotImage = require('../../assets/images/extra-espresso-shot.png');
const singleEspressoImage = require('../../assets/images/single-espresso.png');

// Import specific iced coffee images
const icedAmericanoImage = require('../../assets/images/iced/iced-americano.png');
const icedCaffeLatteImage = require('../../assets/images/iced/iced-caffe-latte.png');
const icedCappuccinoImage = require('../../assets/images/iced/iced-cappuccino.png');
const icedMochaImage = require('../../assets/images/iced/iced-mocha.png');
const icedAlmondLatteImage = require('../../assets/images/iced/iced-almond-latte.png');
const icedBrownSugarLatteImage = require('../../assets/images/iced/iced-brown-sugar-latte.png');
const icedVanillaLatteImage = require('../../assets/images/iced/iced-vanilla-latte.png');
const frenchVanillaIcedCoffeeImage = require('../../assets/images/iced/french-vanilla-iced-coffee.png');
const icedHazelnutLatteImage = require('../../assets/images/iced/iced-hazelnut-latte.png');
const icedCaramelMacchiatoImage = require('../../assets/images/iced/iced-caramel-macchiato.png');
const icedTaroLatteImage = require('../../assets/images/iced/iced-taro-latte.png');
const icedMatchaLatteImage = require('../../assets/images/iced/iced-matcha-latte.png');
const icedEspressoStrongImage = require('../../assets/images/iced/iced-espresso-strong.png');
const icedSaltedCaramelLatteImage = require('../../assets/images/iced/iced-salted-caramel-latte.png');
const icedDoubleMochaImage = require('../../assets/images/iced/iced-double-mocha.png');
const icedCookieDoughLatteImage = require('../../assets/images/iced/iced-cookie-dough-latte.png');
const icedStrawberryLatteImage = require('../../assets/images/iced/iced-strawberry-latte.png');
const icedBlackForestLatteImage = require('../../assets/images/iced/iced-black-forest-latte.png');
// Define size interface
interface Size {
    name: string;
    price: number;
}

// Update MenuItem interface to include sizes
interface MenuItem {
    id: string;
    name: string;
    description: string;
    image: ImageSourcePropType;
    category: string;
    sizes: Size[];
}

// Define interface for the modal props
interface SizeModalProps {
    item: MenuItem;
    visible: boolean;
    selectedSize: Size | null;
    setSelectedSize: (size: Size) => void;
    onClose: () => void;
    onConfirm: () => void;
    isTablet: boolean;
    isSmallDevice: boolean;
}

// Category types
type CategoryType = 'Non Coffee' | 'Hot Coffee' | 'Iced Coffee' | 'Frappe Non-Coffee' | 'Frappe Coffee';

// Categories array
const categories: CategoryType[] = [
    'Non Coffee',
    'Hot Coffee',
    'Iced Coffee',
    'Frappe Coffee',
    'Frappe Non-Coffee'
];

// Default coffee image for placeholder
const coffeeImage = require('../../assets/images/coffee.png');
const hotCoffeeImage = require('../../assets/images/hot-coffee.png');
const icedCoffeeImage = require('../../assets/images/iced-coffee.png');
const frappeImage = require('../../assets/images/frappe.png');
const nonCoffeeImage = require('../../assets/images/non-coffee.png');

// Holy Cup Menu Items
const menuItems: MenuItem[] = [
    // Non Coffee Items
    {
        id: 'nc1',
        name: 'Iced Milk Dark Chocolate',
        description: 'Rich dark chocolate with cold milk over ice',
        image: darkChocoImage,
        category: 'Non Coffee',
        sizes: [
            { name: 'S', price: 65 },
            { name: 'M', price: 75 },
            { name: 'L', price: 90 }
        ]
    },
    {
        id: 'nc2',
        name: 'Iced Milk Taro',
        description: 'Smooth and creamy taro flavor with cold milk',
        image: taroMilkImage,
        category: 'Non Coffee',
        sizes: [
            { name: 'S', price: 65 },
            { name: 'M', price: 75 },
            { name: 'L', price: 90 }
        ]
    },
    {
        id: 'nc3',
        name: 'Iced Milk Matcha',
        description: 'Premium green tea matcha with cold milk',
        image: matchaImage,
        category: 'Non Coffee',
        sizes: [
            { name: 'S', price: 70 },
            { name: 'M', price: 80 },
            { name: 'L', price: 95 }
        ]
    },
    {
        id: 'nc4',
        name: 'Iced Milk Mixed Berries',
        description: 'Refreshing mix of berries with cold milk',
        image: mixedBerriesImage,
        category: 'Non Coffee',
        sizes: [
            { name: 'S', price: 65 },
            { name: 'M', price: 75 },
            { name: 'L', price: 90 }
        ]
    },
    {
        id: 'nc5',
        name: 'Iced Milk Strawberry',
        description: 'Sweet strawberry flavor with cold milk',
        image: strawberryImage,
        category: 'Non Coffee',
        sizes: [
            { name: 'S', price: 80 },
            { name: 'M', price: 90 },
            { name: 'L', price: 110 }
        ]
    },
    {
        id: 'nc6',
        name: 'Iced Milk Choco Strawberry',
        description: 'Chocolate and strawberry combo with cold milk',
        image: chocoStrawberryImage,
        category: 'Non Coffee',
        sizes: [
            { name: 'S', price: 85 },
            { name: 'M', price: 95 },
            { name: 'L', price: 115 }
        ]
    },
    {
        id: 'nc7',
        name: 'Iced Milk Choco Matcha',
        description: 'Chocolate and matcha blend with cold milk',
        image: chocoMatchaImage,
        category: 'Non Coffee',
        sizes: [
            { name: 'S', price: 85 },
            { name: 'M', price: 95 },
            { name: 'L', price: 115 }
        ]
    },
    {
        id: 'nc8',
        name: 'Iced Milk Matcha Strawberry',
        description: 'Delicious matcha and strawberry combo with milk',
        image: strawberryMatchaImage,
        category: 'Non Coffee',
        sizes: [
            { name: 'S', price: 85 },
            { name: 'M', price: 95 },
            { name: 'L', price: 115 }
        ]
    },

    // Hot Coffee Items
    {
        id: 'hc1',
        name: 'Cafe Americano',
        description: 'Espresso shot with hot water',
        image: cafeAmericanoImage,
        category: 'Hot Coffee',
        sizes: [
            { name: '8oz', price: 70 },
            { name: '12oz', price: 85 }
        ]
    },
    {
        id: 'hc2',
        name: 'Cafe Latte',
        description: 'Espresso with steamed milk',
        image: cafeLatteeImage,
        category: 'Hot Coffee',
        sizes: [
            { name: '8oz', price: 80 },
            { name: '12oz', price: 95 }
        ]
    },
    {
        id: 'hc3',
        name: 'Hot Cappuccino',
        description: 'Espresso with steamed milk and foam',
        image: hotCappuccinoImage,
        category: 'Hot Coffee',
        sizes: [
            { name: '8oz', price: 80 },
            { name: '12oz', price: 95 }
        ]
    },
    {
        id: 'hc4',
        name: 'Hot Vanilla Latte',
        description: 'Espresso with vanilla and steamed milk',
        image: hotVanillaLatteImage,
        category: 'Hot Coffee',
        sizes: [
            { name: '8oz', price: 85 },
            { name: '12oz', price: 100 }
        ]
    },
    {
        id: 'hc5',
        name: 'Hot Hazelnut Latte',
        description: 'Espresso with hazelnut flavor and steamed milk',
        image: hotHazelnutLatteImage,
        category: 'Hot Coffee',
        sizes: [
            { name: '8oz', price: 85 },
            { name: '12oz', price: 100 }
        ]
    },
    {
        id: 'hc6',
        name: 'Hot Caramel Macchiato',
        description: 'Espresso with caramel and steamed milk',
        image: hotCaramelMacchiatoImage,
        category: 'Hot Coffee',
        sizes: [
            { name: '8oz', price: 85 },
            { name: '12oz', price: 100 }
        ]
    },
    {
        id: 'hc7',
        name: 'Hot Mocha',
        description: 'Espresso with chocolate and steamed milk',
        image: hotMochaImage,
        category: 'Hot Coffee',
        sizes: [
            { name: '8oz', price: 85 },
            { name: '12oz', price: 100 }
        ]
    },
    {
        id: 'hc8',
        name: 'Extra Espresso Shot',
        description: 'Add an extra shot of espresso to any drink',
        image: extraEspressoShotImage,
        category: 'Hot Coffee',
        sizes: [
            { name: 'One Shot', price: 30 }
        ]
    },
    {
        id: 'hc9',
        name: 'Single Espresso',
        description: 'A single shot of espresso',
        image: singleEspressoImage,
        category: 'Hot Coffee',
        sizes: [
            { name: 'One Shot', price: 50 }
        ]
    },

    // Iced Coffee Items
    {
        id: 'ic1',
        name: 'Iced Americano',
        description: 'Espresso with cold water over ice',
        image: icedAmericanoImage,
        category: 'Iced Coffee',
        sizes: [
            { name: 'S', price: 60 },
            { name: 'M', price: 70 },
            { name: 'L', price: 85 }
        ]
    },
    {
        id: 'ic2',
        name: 'Iced Cafe Latte',
        description: 'Espresso with cold milk over ice',
        image: icedCaffeLatteImage,
        category: 'Iced Coffee',
        sizes: [
            { name: 'S', price: 65 },
            { name: 'M', price: 75 },
            { name: 'L', price: 90 }
        ]
    },
    {
        id: 'ic3',
        name: 'Iced Cappuccino',
        description: 'Espresso with cold milk and foam over ice',
        image: icedCappuccinoImage,
        category: 'Iced Coffee',
        sizes: [
            { name: 'S', price: 70 },
            { name: 'M', price: 80 },
            { name: 'L', price: 95 }
        ]
    },
    {
        id: 'ic4',
        name: 'Iced Mocha',
        description: 'Espresso with chocolate and cold milk over ice',
        image: icedMochaImage,
        category: 'Iced Coffee',
        sizes: [
            { name: 'S', price: 75 },
            { name: 'M', price: 85 },
            { name: 'L', price: 100 }
        ]
    },
    {
        id: 'ic5',
        name: 'Iced Almond Latte',
        description: 'Espresso with almond flavor and cold milk',
        image: icedAlmondLatteImage,
        category: 'Iced Coffee',
        sizes: [
            { name: 'S', price: 75 },
            { name: 'M', price: 85 },
            { name: 'L', price: 100 }
        ]
    },
    {
        id: 'ic6',
        name: 'Iced Brown Sugar Latte',
        description: 'Espresso with brown sugar and cold milk',
        image: icedBrownSugarLatteImage,
        category: 'Iced Coffee',
        sizes: [
            { name: 'S', price: 75 },
            { name: 'M', price: 85 },
            { name: 'L', price: 100 }
        ]
    },
    {
        id: 'ic7',
        name: 'Iced Vanilla Latte',
        description: 'Espresso with vanilla and cold milk',
        image: icedVanillaLatteImage,
        category: 'Iced Coffee',
        sizes: [
            { name: 'S', price: 75 },
            { name: 'M', price: 85 },
            { name: 'L', price: 100 }
        ]
    },
    {
        id: 'ic8',
        name: 'Iced French Vanilla Latte',
        description: 'Espresso with french vanilla and cold milk',
        image: frenchVanillaIcedCoffeeImage,
        category: 'Iced Coffee',
        sizes: [
            { name: 'S', price: 75 },
            { name: 'M', price: 85 },
            { name: 'L', price: 100 }
        ]
    },
    {
        id: 'ic9',
        name: 'Iced Hazelnut Latte',
        description: 'Espresso with hazelnut and cold milk',
        image: icedHazelnutLatteImage,
        category: 'Iced Coffee',
        sizes: [
            { name: 'S', price: 75 },
            { name: 'M', price: 85 },
            { name: 'L', price: 100 }
        ]
    },
    {
        id: 'ic10',
        name: 'Iced Caramel Macchiato',
        description: 'Espresso with caramel and cold milk',
        image: icedCaramelMacchiatoImage,
        category: 'Iced Coffee',
        sizes: [
            { name: 'S', price: 75 },
            { name: 'M', price: 85 },
            { name: 'L', price: 100 }
        ]
    },
    {
        id: 'ic11',
        name: 'Iced Taro Latte',
        description: 'Espresso with taro flavor and cold milk',
        image: icedTaroLatteImage,
        category: 'Iced Coffee',
        sizes: [
            { name: 'S', price: 75 },
            { name: 'M', price: 85 },
            { name: 'L', price: 100 }
        ]
    },
    {
        id: 'ic12',
        name: 'Iced Matcha Latte',
        description: 'Espresso with matcha and cold milk',
        image: icedMatchaLatteImage,
        category: 'Iced Coffee',
        sizes: [
            { name: 'S', price: 80 },
            { name: 'M', price: 90 },
            { name: 'L', price: 110 }
        ]
    },
    {
        id: 'ic13',
        name: 'Iced Espresso [Strong]',
        description: 'Strong espresso over ice',
        image: icedEspressoStrongImage,
        category: 'Iced Coffee',
        sizes: [
            { name: 'S', price: 80 },
            { name: 'M', price: 90 },
            { name: 'L', price: 110 }
        ]
    },
    {
        id: 'ic14',
        name: 'Iced Salted Caramel Latte',
        description: 'Espresso with salted caramel and cold milk',
        image: icedSaltedCaramelLatteImage,
        category: 'Iced Coffee',
        sizes: [
            { name: 'S', price: 80 },
            { name: 'M', price: 90 },
            { name: 'L', price: 110 }
        ]
    },
    {
        id: 'ic15',
        name: 'Iced Double Mocha',
        description: 'Double chocolate with espresso and cold milk',
        image: icedDoubleMochaImage, // Updated from generic icedCoffeeImage
        category: 'Iced Coffee',
        sizes: [
            { name: 'S', price: 80 },
            { name: 'M', price: 90 },
            { name: 'L', price: 110 }
        ]
    },
    {
        id: 'ic16',
        name: 'Iced Cookie Dough Latte',
        description: 'Espresso with cookie dough flavor and cold milk',
        image: icedCookieDoughLatteImage, // Updated from generic icedCoffeeImage
        category: 'Iced Coffee',
        sizes: [
            { name: 'S', price: 80 },
            { name: 'M', price: 90 },
            { name: 'L', price: 110 }
        ]
    },
    {
        id: 'ic17',
        name: 'Iced Strawberry Latte',
        description: 'Espresso with strawberry and cold milk',
        image: icedStrawberryLatteImage, // Updated from generic icedCoffeeImage
        category: 'Iced Coffee',
        sizes: [
            { name: 'S', price: 85 },
            { name: 'M', price: 95 },
            { name: 'L', price: 115 }
        ]
    },
    {
        id: 'ic18',
        name: 'Iced Black Forest Latte',
        description: 'Espresso with black forest flavor and cold milk',
        image: icedBlackForestLatteImage, // Updated from generic icedCoffeeImage
        category: 'Iced Coffee',
        sizes: [
            { name: 'S', price: 85 },
            { name: 'M', price: 95 },
            { name: 'L', price: 115 }
        ]
    },
    // Frappe Non-Coffee Items
    {
        id: 'fnc1',
        name: 'Dark Chocolate Frappe',
        description: 'Blended dark chocolate with ice and whipped cream',
        image: frappeImage,
        category: 'Frappe Non-Coffee',
        sizes: [
            { name: 'M', price: 85 },
            { name: 'L', price: 100 }
        ]
    },
    {
        id: 'fnc2',
        name: 'Taro Frappe',
        description: 'Blended taro with ice and whipped cream',
        image: frappeImage,
        category: 'Frappe Non-Coffee',
        sizes: [
            { name: 'M', price: 85 },
            { name: 'L', price: 100 }
        ]
    },
    {
        id: 'fnc3',
        name: 'Java Chip Frappe',
        description: 'Blended java chips with ice and whipped cream',
        image: frappeImage,
        category: 'Frappe Non-Coffee',
        sizes: [
            { name: 'M', price: 85 },
            { name: 'L', price: 100 }
        ]
    },
    {
        id: 'fnc4',
        name: 'Cookies and Cream Frappe',
        description: 'Blended cookies with ice and whipped cream',
        image: frappeImage,
        category: 'Frappe Non-Coffee',
        sizes: [
            { name: 'M', price: 85 },
            { name: 'L', price: 100 }
        ]
    },
    {
        id: 'fnc5',
        name: 'Mixed Berries Frappe',
        description: 'Blended mixed berries with ice and whipped cream',
        image: frappeImage,
        category: 'Frappe Non-Coffee',
        sizes: [
            { name: 'M', price: 85 },
            { name: 'L', price: 100 }
        ]
    },
    {
        id: 'fnc6',
        name: 'Matcha Frappe',
        description: 'Blended matcha with ice and whipped cream',
        image: frappeImage,
        category: 'Frappe Non-Coffee',
        sizes: [
            { name: 'M', price: 90 },
            { name: 'L', price: 110 }
        ]
    },

    // Frappe Coffee Items
    {
        id: 'fc1',
        name: 'Matcha Frappe',
        description: 'Blended matcha with coffee, ice and whipped cream',
        image: frappeImage,
        category: 'Frappe Coffee',
        sizes: [
            { name: 'M', price: 95 },
            { name: 'L', price: 115 }
        ]
    },
    {
        id: 'fc2',
        name: 'Salted Caramel Frappe',
        description: 'Blended salted caramel with coffee, ice and whipped cream',
        image: frappeImage,
        category: 'Frappe Coffee',
        sizes: [
            { name: 'M', price: 90 },
            { name: 'L', price: 120 }
        ]
    },
    {
        id: 'fc3',
        name: 'Mocha Frappe',
        description: 'Blended mocha with coffee, ice and whipped cream',
        image: frappeImage,
        category: 'Frappe Coffee',
        sizes: [
            { name: 'M', price: 90 },
            { name: 'L', price: 120 }
        ]
    },
    {
        id: 'fc4',
        name: 'Cookie Dough Frappe',
        description: 'Blended cookie dough with coffee, ice and whipped cream',
        image: frappeImage,
        category: 'Frappe Coffee',
        sizes: [
            { name: 'M', price: 95 },
            { name: 'L', price: 115 }
        ]
    },
    {
        id: 'fc5',
        name: 'Strawberry Frappe',
        description: 'Blended strawberry with coffee, ice and whipped cream',
        image: frappeImage,
        category: 'Frappe Coffee',
        sizes: [
            { name: 'M', price: 100 },
            { name: 'L', price: 130 }
        ]
    },
    {
        id: 'fc6',
        name: 'Vanilla Frappe',
        description: 'Blended vanilla with coffee, ice and whipped cream',
        image: frappeImage,
        category: 'Frappe Coffee',
        sizes: [
            { name: 'M', price: 90 },
            { name: 'L', price: 120 }
        ]
    },
    {
        id: 'fc7',
        name: 'French Vanilla Frappe',
        description: 'Blended french vanilla with coffee, ice and whipped cream',
        image: frappeImage,
        category: 'Frappe Coffee',
        sizes: [
            { name: 'M', price: 90 },
            { name: 'L', price: 120 }
        ]
    },
    {
        id: 'fc8',
        name: 'Brown Sugar Frappe',
        description: 'Blended brown sugar with coffee, ice and whipped cream',
        image: frappeImage,
        category: 'Frappe Coffee',
        sizes: [
            { name: 'M', price: 90 },
            { name: 'L', price: 120 }
        ]
    },
    {
        id: 'fc9',
        name: 'Hazelnut Frappe',
        description: 'Blended hazelnut with coffee, ice and whipped cream',
        image: frappeImage,
        category: 'Frappe Coffee',
        sizes: [
            { name: 'M', price: 90 },
            { name: 'L', price: 120 }
        ]
    },
    {
        id: 'fc10',
        name: 'Caramel Frappe',
        description: 'Blended caramel with coffee, ice and whipped cream',
        image: frappeImage,
        category: 'Frappe Coffee',
        sizes: [
            { name: 'M', price: 90 },
            { name: 'L', price: 120 }
        ]
    },
    {
        id: 'fc11',
        name: 'Almond Frappe',
        description: 'Blended almond with coffee, ice and whipped cream',
        image: frappeImage,
        category: 'Frappe Coffee',
        sizes: [
            { name: 'M', price: 90 },
            { name: 'L', price: 120 }
        ]
    },
    {
        id: 'fc12',
        name: 'Java Chip Frappe',
        description: 'Blended java chips with coffee, ice and whipped cream',
        image: frappeImage,
        category: 'Frappe Coffee',
        sizes: [
            { name: 'M', price: 90 },
            { name: 'L', price: 120 }
        ]
    }
];

// Update the MemoizedSizeModal component with proper type annotation
const MemoizedSizeModal = React.memo<SizeModalProps>(({ 
    item, 
    visible, 
    selectedSize, 
    setSelectedSize, 
    onClose, 
    onConfirm, 
    isTablet, 
    isSmallDevice 
}) => {
    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                paddingHorizontal: 20
            }}>
                <View style={{
                    width: '100%',
                    maxWidth: 400,
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 20,
                    alignItems: 'center',
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                }}>
                    <Text style={{
                        fontSize: isTablet ? 22 : 20,
                        fontWeight: 'bold',
                        color: '#4E342E',
                        marginBottom: 12,
                        textAlign: 'center'
                    }}>
                        {item.name}
                    </Text>
                    
                    <View style={{
                        width: '100%',
                        height: 120,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 12
                    }}>
                        <Image 
                            source={item.image}
                            style={{
                                width: 100,
                                height: 100
                            }}
                            resizeMode="contain"
                        />
                    </View>
                    
                    <Text style={{
                        fontSize: isTablet ? 16 : 14,
                        color: '#6D4C41',
                        marginBottom: 20,
                        textAlign: 'center'
                    }}>
                        {item.description}
                    </Text>
                    
                    <Text style={{
                        fontSize: isTablet ? 18 : 16,
                        fontWeight: 'bold',
                        color: '#00695c',
                        marginBottom: 12
                    }}>
                        Choose a Size:
                    </Text>
                    
                    <View style={{
                        width: '100%',
                        marginBottom: 20
                    }}>
                        {item.sizes.map((size, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingVertical: 12,
                                    paddingHorizontal: 16,
                                    backgroundColor: selectedSize?.name === size.name ? '#EFEBE9' : 'white',
                                    borderWidth: 1,
                                    borderColor: selectedSize?.name === size.name ? '#6D4C41' : '#E0E0E0',
                                    borderRadius: 8,
                                    marginBottom: 8
                                }}
                                onPress={() => setSelectedSize(size)}
                            >
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    {selectedSize?.name === size.name && (
                                        <Ionicons name="checkmark-circle" size={24} color="#6D4C41" style={{ marginRight: 8 }} />
                                    )}
                                    <Text style={{
                                        fontSize: isTablet ? 18 : 16,
                                        fontWeight: selectedSize?.name === size.name ? 'bold' : 'normal',
                                        color: '#4E342E'
                                    }}>
                                        {size.name}
                                    </Text>
                                </View>
                                <Text style={{
                                    fontSize: isTablet ? 18 : 16,
                                    fontWeight: 'bold',
                                    color: '#00695c'
                                }}>
                                    ₱{size.price}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%'
                    }}>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 12,
                                paddingHorizontal: 20,
                                borderRadius: 8,
                                backgroundColor: '#E0E0E0',
                                width: '48%'
                            }}
                            onPress={onClose}
                        >
                            <Text style={{
                                color: '#4E342E',
                                fontWeight: 'bold',
                                fontSize: isTablet ? 16 : 14,
                                textAlign: 'center'
                            }}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={{
                                paddingVertical: 12,
                                paddingHorizontal: 20,
                                borderRadius: 8,
                                backgroundColor: selectedSize ? '#6D4C41' : '#A1887F',
                                width: '48%',
                                opacity: selectedSize ? 1 : 0.7
                            }}
                            onPress={onConfirm}
                            disabled={!selectedSize}
                        >
                            <Text style={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: isTablet ? 16 : 14,
                                textAlign: 'center'
                            }}>
                                Add to Cart
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
});

export default function MenuView(): JSX.Element {
    const { addToCart, cart } = useCart();
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    
    // State for active category, default to showing all items
    const [activeCategory, setActiveCategory] = useState<CategoryType | 'All'>('All');
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [selectedSize, setSelectedSize] = useState<Size | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    
    // Calculate responsive dimensions
    const isLandscape = width > height;
    const isTablet = width > 768;
    const isSmallDevice = width < 375;
    
    // Determine number of columns based on device orientation and size
    const numColumns = useMemo(() => {
        if (isTablet) return isLandscape ? 4 : 3;
        return isLandscape ? 3 : 2;
    }, [isLandscape, isTablet]);
    
    // Calculate responsive image height
    const imageHeight = useMemo(() => {
        if (isTablet) return 180;
        if (isLandscape) return 120;
        return isSmallDevice ? 130 : 150;
    }, [isTablet, isLandscape, isSmallDevice]);
    
    // Calculate responsive spacing
    const itemPadding = isSmallDevice ? 12 : 16;
    const itemMargin = isSmallDevice ? 6 : 8;
    const headerFontSize = isTablet ? 28 : (isSmallDevice ? 20 : 24);
    const itemNameFontSize = isTablet ? 18 : (isSmallDevice ? 14 : 16);
    const categoryFontSize = isTablet ? 16 : (isSmallDevice ? 12 : 14);
    
    // Calculate total quantity of items in cart
    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

    // Filter menu items based on active category
    const filteredMenuItems = useMemo(() => {
        if (activeCategory === 'All') {
            return menuItems;
        }
        return menuItems.filter(item => item.category === activeCategory);
    }, [activeCategory]);

    const openSizeModal = useCallback((item: MenuItem) => {
        setSelectedItem(item);
        setSelectedSize(null);
        // Use requestAnimationFrame to delay showing the modal
        requestAnimationFrame(() => {
            setModalVisible(true);
        });
    }, []);

    const handleAddToCart = () => {
        if (selectedItem && selectedSize) {
            const itemName = `${selectedItem.name} (${selectedSize.name})`;
            addToCart(selectedItem.id + selectedSize.name, itemName, selectedSize.price);
            Alert.alert('Added to Cart', `${itemName} has been added to your cart!`);
            setModalVisible(false);
        }
    };

    const renderMenuItem = ({ item, index }: { item: MenuItem; index: number }) => {
        // Calculate column width based on number of columns
        const itemWidth = (width - (insets.left + insets.right) - (numColumns + 1) * (itemMargin * 2)) / numColumns;
        
        // Get lowest price for display
        const lowestPrice = item.sizes.reduce((lowest, size) => 
            size.price < lowest ? size.price : lowest, item.sizes[0].price);
        
        return (
            <TouchableOpacity
                onPress={() => openSizeModal(item)}
                style={{
                    width: itemWidth,
                    padding: itemPadding,
                    margin: itemMargin,
                    backgroundColor: '#f9f9f9',
                    borderRadius: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                }}
            >
                {/* Image container with fixed aspect ratio */}
                <View style={{
                    width: '100%',
                    height: imageHeight,
                    borderRadius: 8,
                    marginBottom: 8,
                    backgroundColor: '#f5f5f5',
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Image
                        source={item.image}
                        style={{
                            width: '90%',
                            height: '90%',
                        }}
                        resizeMode="contain"
                    />
                </View>
                
                <Text 
                    style={{
                        fontSize: itemNameFontSize,
                        fontWeight: 'bold',
                        color: '#00695c',
                        marginBottom: 4
                    }}
                    numberOfLines={1}
                >
                    {item.name}
                </Text>
                
                <View style={{
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: 8
                }}>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: isSmallDevice ? 13 : 15,
                        color: '#004d40',
                    }}>
                        From ₱{lowestPrice}
                    </Text>
                    <Text style={{
                        fontSize: isSmallDevice ? 12 : 13,
                        color: '#6D4C41',
                    }}>
                        {item.sizes.length} sizes
                    </Text>
                </View>
                
                <Text 
                    style={{
                        fontSize: isSmallDevice ? 12 : 14,
                        color: '#6D4C41',
                        marginBottom: 12,
                        height: isSmallDevice ? 36 : 40
                    }}
                    numberOfLines={2}
                >
                    {item.description}
                </Text>
                
                <TouchableOpacity
                    style={{
                        backgroundColor: '#6D4C41',
                        paddingVertical: isSmallDevice ? 8 : 10,
                        borderRadius: 8,
                        alignItems: 'center'
                    }}
                    onPress={() => openSizeModal(item)}
                >
                    <Text style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: isSmallDevice ? 12 : 14
                    }}>
                        Choose Size
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: '#D7CCC8',
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0
        }}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: 12
            }}>
                <View>
                    <Text style={{
                        fontSize: headerFontSize,
                        fontWeight: 'bold',
                        color: '#4E342E'
                    }}>
                        Holy Cup
                    </Text>
                    <Text style={{
                        fontSize: isSmallDevice ? 12 : 14,
                        color: '#795548'
                    }}>
                        Best Price
                    </Text>
                </View>
                
                {/* Cart Icon with Badge */}
                <TouchableOpacity 
                    style={{ padding: 8 }}
                    onPress={() => navigation.navigate('orders' as never)}
                >
                    <Ionicons name="cart" size={isSmallDevice ? 26 : 30} color="#4E342E" />
                    {cartItemCount > 0 && (
                        <View style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            backgroundColor: '#F44336',
                            borderRadius: 12,
                            width: isSmallDevice ? 18 : 22,
                            height: isSmallDevice ? 18 : 22,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Text style={{
                                color: 'white',
                                fontSize: isSmallDevice ? 10 : 12,
                                fontWeight: 'bold'
                            }}>
                                {cartItemCount}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Category tabs - Improved fixed height container */}
            <View style={{
                height: 50,
                backgroundColor: '#EFEBE9',
                borderRadius: 25,
                marginHorizontal: 16,
                marginBottom: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2,
                padding: 4
            }}>
                <FlatList
                    data={['All', ...categories]}
                    keyExtractor={(item) => item}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        alignItems: 'center'
                    }}
                    renderItem={({ item }) => {
                        const isActive = activeCategory === item;
                        return (
                            <TouchableOpacity
                                style={{
                                    paddingVertical: 8,
                                    paddingHorizontal: 16,
                                    backgroundColor: isActive ? '#6D4C41' : 'transparent',
                                    borderRadius: 20,
                                    marginHorizontal: 4,
                                    height: 36,
                                    justifyContent: 'center',
                                    minWidth: 80,
                                    alignItems: 'center'
                                }}
                                onPress={() => {
                                    setActiveCategory(item as CategoryType | 'All');
                                }}
                            >
                                <Text
                                    style={{
                                        color: isActive ? '#fff' : '#6D4C41',
                                        fontWeight: isActive ? 'bold' : 'normal',
                                        fontSize: categoryFontSize,
                                        textAlign: 'center'
                                    }}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                    initialNumToRender={categories.length + 1}
                    getItemLayout={(data, index) => ({
                        length: 88, // minWidth + marginHorizontal * 2
                        offset: 88 * index,
                        index,
                    })}
                />
            </View>

            <FlatList
                data={filteredMenuItems}
                keyExtractor={(item) => item.id}
                renderItem={renderMenuItem}
                numColumns={numColumns}
                key={`menu-${numColumns}-${activeCategory}`}
                contentContainerStyle={{
                    paddingHorizontal: 8,
                    paddingBottom: insets.bottom + 20
                }}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={{
                    flex: 1,
                    justifyContent: numColumns < 3 ? 'space-between' : 'flex-start'
                }}
                ListEmptyComponent={
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 50
                    }}>
                        <Text style={{
                            fontSize: itemNameFontSize,
                            color: '#6D4C41',
                            textAlign: 'center'
                        }}>
                            No items to display in this category.
                        </Text>
                    </View>
                }
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={50}
                windowSize={21}
            />
            
            {selectedItem && (
                <MemoizedSizeModal
                    item={selectedItem}
                    visible={modalVisible}
                    selectedSize={selectedSize}
                    setSelectedSize={setSelectedSize}
                    onClose={() => setModalVisible(false)}
                    onConfirm={handleAddToCart}
                    isTablet={isTablet}
                    isSmallDevice={isSmallDevice}
                />
            )}
        </SafeAreaView>
    );
}
