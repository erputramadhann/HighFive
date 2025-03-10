import { useState, useEffect } from "react";
import { YStack, XStack, Image, Button, Text, Theme, Card, ScrollView, AnimatePresence, Spinner, Input } from "tamagui";
import Navbar from "./Navbar";
import { useParams } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DetailProduk() {
    const navigate = useNavigate();

    const [selectedSize, setSelectedSize] = useState("");
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [quantity, setQuantity] = useState(1); // Tambahkan state untuk quantity
    const [errorMessage, setErrorMessage] = useState(""); // State untuk pesan error

    let { id } = useParams();
    const [data, setData] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        //console.log("ketelen");
        const userId = localStorage.getItem("id");
        const banyakCart = parseInt(localStorage.getItem("banyakCart")) || 0;
    
        if (!banyakCart) {
            localStorage.setItem("banyakCart", 1);
        } else {
            localStorage.setItem("banyakCart", banyakCart + 1);
        }
    
        if (!userId) {
            navigate("/login"); // Arahkan ke halaman login jika id kosong
            return;
        }
    
        try {
            //console.log("userId: " + userId);
            //console.log("data.id: " + data.id);
            //console.log("quantity: " + quantity);
    
            // Periksa apakah produk sudah ada di keranjang
            const cartResponse = await axios.get(`http://localhost:3005/cart?userId=${userId}`);
            const cartItems = cartResponse.data || [];
            const existingItem = cartItems.find(item => item.productId === data.id);
    
            if (existingItem) {
                // Jika produk sudah ada, update quantity-nya
                const updatedQuantity = existingItem.quantity + quantity;
                await axios.put(`http://localhost:3005/cart/${existingItem.id}`, {
                    userId: userId,
                    productId: data.id,
                    quantity: updatedQuantity
                });
            } else {
                // Jika belum ada, tambahkan produk baru
                await axios.post("http://localhost:3005/cart", {
                    userId: userId,
                    productId: data.id,
                    quantity: quantity
                });
            }
    
            navigate("/cart/" + userId);
        } catch (error) {
            console.error(error);
        }
    };
    

    
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get("http://localhost:3005/products/" + id);
                //console.log(response.data);
                setData(response.data);
            } catch (error) {
                //console.log(error);
            }
        };
        getData();
    }, [id]);

    // Simulate loading delay
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    // Fungsi untuk menambah quantity
    const handleIncrease = () => {
        if (quantity < data.stock) {
            setQuantity(quantity + 1);
            setErrorMessage(""); // Hapus pesan error jika valid
        } else {
            setErrorMessage("Jumlah tidak boleh melebihi stok!");
        }
    };

    // Fungsi untuk mengurangi quantity (min 1)
    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            setErrorMessage(""); // Hapus pesan error jika valid
        }
    };

    return (
        <Theme name="light">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Navbar />
                <YStack paddingTop={120} paddingBottom={20} justifyContent="center" alignItems="center" bg="#ffffff" minHeight="100vh" width="100vw">
                    <XStack gap="$6" flexWrap="wrap" width="auto" maxWidth={10000} justifyContent="center" alignItems="center">
                        
                        {/* Product Images */}
                        <YStack space="$4" justifyContent="center" alignItems="center" backgroundColor="transparent">
                            <AnimatePresence>
                                {loading && !data ? (
                                    <YStack space="$4" animation="bouncy">
                                        <Card width={310} height={450} backgroundColor="$gray5" borderRadius="20" />
                                    </YStack>
                                ) : (
                                    <YStack space="$4">
                                        <XStack space="$4">
                                            <Image
                                                source={{ uri: data.image }}
                                                width={650}
                                                height={650}
                                                borderRadius="20"
                                            />
                                        </XStack>
                                    </YStack>
                                )}
                            </AnimatePresence>
                        </YStack>

                        {/* Product Details */}
                        <YStack space="$3" flex={1} width={500} alignItems="justify">
                            <AnimatePresence>
                                {loading && !data ? (
                                    <YStack space="$3" animation="bouncy" opacity={0.6}>
                                        <Card width={100} height={24} backgroundColor="$gray5" borderRadius="$4" />
                                        <Card width={200} height={18} backgroundColor="$gray5" borderRadius="$4" />
                                        <Card width={300} height={18} backgroundColor="$gray5" borderRadius="$4" />
                                        <Spinner size="large" color="$black" />
                                    </YStack>
                                ) : (
                                    <>
                                        <Text fontSize="$12" fontWeight="700">
                                            {data.name}
                                        </Text>
                                        <Text fontSize="$8" fontWeight="600" onPress={() => setShowDetails(!showDetails)}>
                                            More Details {showDetails ? "▲" : "▼"}
                                        </Text>

                                        {showDetails && (
                                            <Card
                                                padding="$1"
                                                borderWidth={2}
                                                borderRadius="$1"
                                                borderColor="transparent"
                                                backgroundColor="transparent"
                                            >
                                                <Text color="$gray10" textAlign="justify">
                                                    {data.description}
                                                </Text>
                                            </Card>
                                        )}

                                        {/* Stock */}
                                        <Text fontWeight="600">Stock: {data.stock}</Text>

                                        {/* Quantity Input */}
                                        <YStack space="$2" marginTop="$2">
                                            <Text fontWeight="600">Quantity:</Text>
                                            <XStack space="$2" alignItems="center">
                                                <Button onPress={handleDecrease} disabled={quantity <= 1}>-</Button>
                                                <Input
                                                    value={String(quantity)}
                                                    textAlign="center"
                                                    width={50}
                                                    editable={false} // Biar user hanya bisa pakai tombol
                                                />
                                                <Button onPress={handleIncrease} disabled={quantity >= data.stock}>+</Button>
                                            </XStack>
                                            {errorMessage && (
                                                <Text color="red" fontSize="$6">{errorMessage}</Text>
                                            )}
                                        </YStack>

                                        {/* Sizes */}
                                        <YStack space="$2" marginTop="$2">
                                            <Text fontWeight="600">Available Sizes:</Text>
                                            <XStack space="$2">
                                                {["XS", "S", "M", "L", "XL", "XXL", "3XL"].map((size) => (
                                                    <Button
                                                        key={size}
                                                        borderColor={selectedSize === size ? "$blue10" : "$gray8"}
                                                        backgroundColor={selectedSize === size ? "$blue3" : "$gray3"}
                                                        onPress={() => setSelectedSize(size)}
                                                    >
                                                        {size}
                                                    </Button>
                                                ))}
                                            </XStack>
                                        </YStack>

                                        {/* Price */}
                                        <Text fontSize="$7" style={{ marginTop: 10, marginBottom: 20 }} fontWeight="700">
                                            IDR {data.price}
                                        </Text>

                                        {/* Actions */}
                                        <Card>
                                            <Button
                                                size="$5"
                                                backgroundColor="$black"
                                                color="$color1"
                                                borderRadius="$4"
                                                bg="#273aff"
                                                pressStyle={{ bg: "$green10" }}
                                                onPress={handleSubmit} // Panggil fungsi saat tombol ditekan
                                            >
                                                ADD TO CART
                                            </Button>
                                        </Card>
                                    </>
                                )}
                            </AnimatePresence>
                        </YStack>
                    </XStack>
                </YStack>
            </ScrollView>
        </Theme>
    );
}
