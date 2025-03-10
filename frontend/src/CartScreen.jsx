import React, { useState, useEffect } from 'react';
import { Stack, Text, XStack, YStack, Button, Image, ScrollView, Input } from 'tamagui';
import Navbar from './Navbar';
import { useWindowDimensions } from 'react-native';
import axios from "axios";


export default function CartScreen() {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem("id"));
  const { width } = useWindowDimensions();
  const isMobile = width < 900;
  const [updatedItems, setUpdatedItems] = useState(new Set()); // Menyimpan ID item yang diupdate

  useEffect(() => {
    const savedCart = localStorage.getItem(`cart-${userId}`);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [userId]);

  useEffect(() => {
    const fetchCartData = async () => {
      if (!userId) return;
  
      let localCart = [];
      const localStorageCart = localStorage.getItem(`cart-${userId}`);
  
      if (localStorageCart) {
        try {
          localCart = JSON.parse(localStorageCart);
        } catch (error) {
          console.error("Error parsing local cart:", error);
        }
      }
  
      try {
        const { data: cartData } = await axios.get(`http://localhost:3005/cart?userId=${userId}`);
  
        const productIds = new Set(localCart.map(item => item.productId));
        const combinedCart = [...localCart];
  
        // Tambahkan item baru dari API jika tidak ada di localStorage
        for (const item of cartData) {
          if (!productIds.has(item.productId)) {
            try {
              const { data: product } = await axios.get(`http://localhost:3005/products/${item.productId}`);
              combinedCart.push({ ...item, ...product, stock: product.stock });
            } catch (error) {
              console.error(`Error fetching product ${item.productId}:`, error);
              combinedCart.push(item); // Jika gagal mengambil detail produk, tetap tambahkan item
            }
          }
        }
  
        setCart(combinedCart);
        localStorage.setItem(`cart-${userId}`, JSON.stringify(combinedCart)); // Simpan gabungan ke localStorage
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
  
    fetchCartData();
  }, [userId]);
  

  useEffect(() => {
    if (updatedItems.size > 0) {
      updatedItems.forEach(async (id) => {
        const item = cart.find(i => i.id === id);
        if (item) {
          try {
            await axios.patch(`http://localhost:3005/cart/${id}`, {
              userId: userId,
              quantity: item.quantity
            });
          } catch (error) {
            console.error("Error updating quantity:", error);
          }
        }
      });

      setUpdatedItems(new Set());
    }
  }, [cart]);

  const updateQuantity = (id, change) => {
    const updatedCart = cart.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, Math.min(item.quantity + change, item.stock)) }
        : item
    );

    setCart(updatedCart);
    localStorage.setItem(`cart-${userId}`, JSON.stringify(updatedCart)); // Simpan perubahan kuantitas ke localStorage
    setUpdatedItems(prev => new Set(prev).add(id));
  };

  const totalPrice = cart.reduce(
    (sum, p) => sum + (parseInt(p.price.replace(/\D/g, '')) || 0) * Math.min(p.quantity, p.stock),
    0
  );

  return (
    <Stack flex={1} bg="#ffffff" width="100vw" minHeight="100vh">
      <Navbar />
      <Stack paddingTop={100} width="100%">
        <ScrollView showsVerticalScrollIndicator={false} padding={20}>
          {isMobile ? (
            <YStack space>
              <YStack space alignItems="center">
                {cart.map((item) => (
                  <XStack key={item.id} width="90%" padding={15} borderRadius={12} bg="#ffffff" borderWidth={2} borderColor="#ebebeb" alignItems="center" space>
                    <Image source={{ uri: item.image }} width={150} height={120} borderRadius={10} resizeMode="contain" />
                    <YStack flex={1}>
                      <Text fontSize={20} fontWeight="bold" color="#343434">{item.name}</Text>
                      <Text fontSize={16} color="#343434">Price: IDR {item.price}</Text>
                      <XStack space alignItems="center" marginTop={5}>
                        <Button size="$3" bg="#ff5733" onPress={() => updateQuantity(item.id, -1)}>
                          <Text color="#fff">−</Text>
                        </Button>
                        <Input size="105" textAlign="center" fontSize={16} value={(item.quantity > item.stock ? item.stock : item.quantity).toString()} editable={false} />
                        <Button size="$3" bg="#273aff" onPress={() => updateQuantity(item.id, 1)}>
                          <Text color="#fff">+</Text>
                        </Button>
                      </XStack>
                    </YStack>
                  </XStack>
                ))}
              </YStack>

              <YStack bg="#f5f5f5" padding={24} borderRadius={12} width="90%" alignSelf="center">
                <Text fontSize={22} fontWeight="bold">Order Summary</Text>
                <Text fontSize={18}>Total Items: {cart.reduce((sum, item) => sum + Math.min(item.quantity, item.stock), 0)}</Text>
                <Text fontSize={18}>Total Price: IDR {totalPrice.toLocaleString()}</Text>
                <Button bg="#273aff" marginTop={10}>
                  <Text color="#fff" fontSize={18}>Proceed to Checkout</Text>
                </Button>
              </YStack>
            </YStack>
          ) : (
            <XStack space justifyContent="center" width="100%">
              <YStack space alignItems="center" flex={2}>
                {cart.map((item) => (
                  <XStack
                    key={item.id}
                    width="100%"
                    padding={15}
                    borderRadius={12}
                    bg="#fff"
                    borderWidth={2}
                    borderColor="#ebebeb"
                    alignItems="center"
                    space
                  >
                    <Image
                      source={{ uri: item.image }}
                      width={100}
                      height={120}
                      borderRadius={10}
                      resizeMode="contain"
                    />
                    <YStack flex={1}>
                      <Text fontSize={20} fontWeight="bold" color="#343434">{item.name}</Text>
                      <Text fontSize={16} color="#343434">Price: IDR {item.price}</Text>
                      <XStack space alignItems="center" marginTop={5}>
                        <Button size="$3" bg="#ff5733" onPress={() => updateQuantity(item.id, -1)}>
                          <Text color="#fff">−</Text>
                        </Button>
                        <Input
                          width={150}
                          textAlign="center"
                          fontSize={16}
                          value={(item.quantity > item.stock ? item.stock : item.quantity).toString()}
                          editable={false}
                        />
                        <Button size="$3" bg="#273aff" onPress={() => updateQuantity(item.id, 1)}>
                          <Text color="#fff">+</Text>
                        </Button>
                      </XStack>
                    </YStack>
                  </XStack>
                ))}
              </YStack>

              <YStack bg="#f5f5f5" padding={24} borderRadius={12} width="30%" minWidth={320} alignSelf="flex-start">
                <Text fontSize={22} fontWeight="bold">Order Summary</Text>
                <Text fontSize={18}>Total Items: {cart.reduce((sum, item) => sum + Math.min(item.quantity, item.stock), 0)}</Text>
                <Text fontSize={18}>Total Price: IDR {totalPrice.toLocaleString()}</Text>
                <Button bg="#273aff" marginTop={10}>
                  <Text color="#fff" fontSize={18}>Proceed to Checkout</Text>
                </Button>
              </YStack>
            </XStack>
          )}
        </ScrollView>
      </Stack>
    </Stack>
  );
}