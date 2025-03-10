import React, { useState, useEffect } from 'react';
import { Stack, Image, Text, YStack, Button } from 'tamagui';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  let navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHomeDropdownOpen, setIsHomeDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [cartItems, setCartItems] = useState(localStorage.getItem("banyakCart"));
  const email = localStorage.getItem("email");
  const id = localStorage.getItem("id");
  const [products, setProducts] = useState([]);

  const handleLogout = () => {
    try {
      localStorage.clear(); // Menghapus semua data di localStorage
      navigate("/");
      window.location.reload(); // Me-refresh halaman
    } catch (error) {
      console.error("Error saat logout:", error);
    }
};

useEffect(() => {
  const getData = async () => {
    try {
      const response = await axios.get('http://localhost:3005/categories');
      setProducts(response.data);
      //console.log(JSON.stringify(response.data));
    } catch (error) {
      //console.log(error);
    }
  };
  getData();
}, []);


  return (
    <Stack
      id="Navbar2"
      bg="white"
      padding={15}
      shadow="lg"
      position="fixed"
      top={0}
      width="97%"
      left="1.5%"
      zIndex={100}
      marginTop={20}
      borderWidth={2}
      borderColor={"#ebebeb"}
      borderRadius={12}
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack flexDirection="row" alignItems="center">
        <Image source={{ uri: "../public/logo.png" }} width={80} height={50} marginLeft={20} />
        
        <Stack flexDirection="row" alignItems="center" gap={30} marginLeft={40}>

          <Stack position="relative">
            <Button bg="#fff" borderColor="#ebebeb" onPress={() => navigate("/")} style={{ fontSize: 18, fontWeight: 'bold', color: '#343434', cursor: "pointer" }} onClick={() => setIsHomeDropdownOpen(!isHomeDropdownOpen)}>
              Home 
            </Button>
          </Stack>
          
          {/* Category Dropdown */}
          <Stack position="relative">
            <Button bg="#fff" borderColor="#ebebeb" style={{ fontSize: 18, fontWeight: 'bold', color: '#343434', cursor: "pointer" }} onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}>
            Category <img src="https://cdn-icons-png.flaticon.com/512/32/32195.png" width="8" height="8" alt="Dropdown" />
            </Button>
            {isCategoryDropdownOpen && (
              <YStack position="absolute" top={30} bg="white" shadow="md" borderRadius={10} padding={12} width={140}>
                {
                  products.map((product) => (
                    <>
                    <Button bg="#fff" onPress={() => {navigate("/" + product.id); setIsCategoryDropdownOpen(false) }} style={{ marginBottom:10, padding: 8, cursor: "pointer", fontWeight: '500', color: '#333' }}>
                      {product.name}
                    </Button>
                    </>
                  ))
                }
                
              </YStack>
            )}
          </Stack>
        </Stack>
      </Stack>

      {/* Cart & User Icon */}
      <Stack flexDirection="row" alignItems="center">
        {/* Cart Icon */}
        <Stack position="relative" marginRight={20} >
          <img
            src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png"
            width="30"
            height="30"
            alt="Checkout Icon"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/cart/" + id)}
          />
          {cartItems > 0 && (
            <YStack position="absolute" top={-5} right={-10} bg="#273aff" borderRadius="50%" width={22} height={22} justifyContent="center" alignItems="center">
              <Text color="white" fontSize={12} fontWeight='bold'>{cartItems}</Text>
            </YStack>
          )}
        </Stack>

       {/* User Icon with Email and Dropdown */}
<Stack position="relative" flexDirection="row" alignItems="center">
  {/* Email Text */}
  <Text style={{ marginRight: 8, fontWeight: "500", color: "#333" }}>
    {!email ? "" : email.split("@")[0]}
  </Text>

  {/* User Icon */}
  <img
    src="https://cdn-icons-png.flaticon.com/128/9408/9408175.png"
    width="44"
    height="44"
    alt="User Icon"
    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    style={{ cursor: "pointer", marginTop: -4, marginRight: 2 }}
  />

  {/* Dropdown Menu */}
  {isDropdownOpen && (
    <YStack position="absolute" top={50} right={0} bg="white" shadow="md" borderRadius={10} padding={12} width={140}>
      {
        !email ? (
          <Text onPress={() => navigate("/login")} style={{ padding: 8, cursor: "pointer", fontWeight: "bold", color: "#343434" }}>
        Login
      </Text>
        ): (
          <Text onPress={() => handleLogout()} style={{ padding: 8, cursor: "pointer", fontWeight: "bold", color: "red" }}>
        Logout
      </Text>
        )
      }
      
    </YStack>
  )}
</Stack>

      </Stack>
    </Stack>
  );
};

export default Navbar;
