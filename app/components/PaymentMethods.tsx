import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Modal, 
    ScrollView, 
    Image, 
    Alert,
    useWindowDimensions,
    StyleProp,
    ViewStyle,
    DimensionValue
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartItem } from '../context/CartContext';
import * as ImagePicker from 'expo-image-picker';

interface PaymentMethodsProps {
    isLandscape: boolean;
    isSmallDevice: boolean;
    fontSizeNormal: number;
    fontSizeSubheading: number;
    fontSizeSmall: number;
    buttonPadding: number;
    sectionSpacing: number;
    receiptImageHeight: number;
    isTablet: boolean;
    modalWidth: string | number;
    modalMaxHeight: string | number;
    receiptData: {
        items: CartItem[];
        subtotal: number;
        tax: number;
        total: number;
        date: string;
        orderNumber: string;
    } | null;
    showReceipt: boolean;
    showGcashModal: boolean;
    paymentMethod: string;
    receiptUploaded: boolean;
    receiptImage: string | null;
    handlePayment: (method: string) => void;
    setShowReceipt: (show: boolean) => void;
    setShowGcashModal: (show: boolean) => void;
    completeOrder: () => void;
    completeGcashPayment: () => void;
    pickImage: () => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
    isLandscape,
    isSmallDevice,
    fontSizeNormal,
    fontSizeSubheading,
    fontSizeSmall,
    buttonPadding,
    sectionSpacing,
    receiptImageHeight,
    isTablet,
    modalWidth,
    modalMaxHeight,
    receiptData,
    showReceipt,
    showGcashModal,
    paymentMethod,
    receiptUploaded,
    receiptImage,
    handlePayment,
    setShowReceipt,
    setShowGcashModal,
    completeOrder,
    completeGcashPayment,
    pickImage
}) => {
    
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
                        width: modalWidth as DimensionValue,
                        maxWidth: 500,
                        borderRadius: 12,
                        padding: isSmallDevice ? 16 : 20,
                        maxHeight: modalMaxHeight as DimensionValue
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
                                    paddingVertical: 4
                                }}>
                                    <Text style={{
                                        color: '#4E342E',
                                        fontSize: fontSizeSmall
                                    }}>
                                        Tax (8%):
                                    </Text>
                                    <Text style={{
                                        color: '#4E342E',
                                        fontSize: fontSizeSmall
                                    }}>
                                        ₱{receiptData.tax.toFixed(2)}
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
                        width: modalWidth as DimensionValue,
                        maxWidth: 500,
                        borderRadius: 12,
                        padding: isSmallDevice ? 16 : 20,
                        maxHeight: modalMaxHeight as DimensionValue
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
                                    marginBottom: 10
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
                                                    resizeMode="contain"
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

    const PaymentMethodButtons = () => {
        return (
            <View style={{
                flexDirection: isLandscape && !isSmallDevice ? 'row' : 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                gap: 3
            }}>
                {/* Cash Button - BIGGER SIZE */}
                <TouchableOpacity
                    style={{
                        backgroundColor: '#6D4C41',
                        paddingVertical: isSmallDevice ? buttonPadding + 4 : buttonPadding + 8,
                        paddingHorizontal: isSmallDevice ? 20 : 24,
                        borderRadius: 10,
                        alignItems: 'center',
                        marginBottom: isLandscape && !isSmallDevice ? 0 : 3,
                        marginRight: isLandscape && !isSmallDevice ? 3 : 0,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        elevation: 3,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 2,
                        width: isLandscape && !isSmallDevice ? '48%' : '100%'
                    }}
                    onPress={() => handlePayment('Cash')}
                >
                    <Text style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: isSmallDevice ? fontSizeNormal : fontSizeNormal + 2
                    }}>
                        Cash Payment
                    </Text>
                </TouchableOpacity>
                
                {/* GCash Button - BIGGER SIZE */}
                <TouchableOpacity
                    style={{
                        backgroundColor: '#007EFF',
                        paddingVertical: isSmallDevice ? buttonPadding + 4 : buttonPadding + 8,
                        paddingHorizontal: isSmallDevice ? 20 : 24,
                        borderRadius: 10,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        elevation: 3,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 2,
                        width: isLandscape && !isSmallDevice ? '48%' : '100%'
                    }}
                    onPress={() => handlePayment('GCash')}
                >
                    <Text style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: isSmallDevice ? fontSizeNormal : fontSizeNormal + 2
                    }}>
                        GCash Payment
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <>
            {renderReceiptModal()}
            {renderGcashModal()}
            <View style={{ 
                marginTop: 20,
                width: '100%'
            }}>
                <Text style={{
                    fontSize: fontSizeSubheading,
                    fontWeight: 'bold',
                    color: '#4E342E',
                    marginBottom: 18
                }}>
                    Select Payment Method
                </Text>
                <PaymentMethodButtons />
            </View>
        </>
    );
};

export default PaymentMethods;