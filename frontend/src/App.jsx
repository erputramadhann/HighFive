import React, { useState, useEffect } from 'react';
import { Stack, Text, XStack, Button, Image, ScrollView, YStack } from 'tamagui';
import Navbar from './Navbar';
import axios from 'axios';
import { useWindowDimensions } from 'react-native';
import { useNavigate } from "react-router-dom";
import ImageSwiper from './ImageSwiper';
import { useParams } from "react-router";
import { motion } from "motion/react"

export default function App() {
  const [products, setProducts] = useState([]);
  const { width } = useWindowDimensions(); // Get dynamic screen width
  let navigate = useNavigate();

  // Adjust columns dynamically based on screen width
  const itemsPerRow = width > 1200 ? 5 : width > 900 ? 3 : width > 600 ? 2 : 1;
  const imageWidth = width / (itemsPerRow * 1.2); // Adjust image width based on columns
  let { categoryId } = useParams();
  
  useEffect(() => {
    const getData = async () => {
      try {
        //console.log("Ambil Product");
        let response;
        if(!categoryId)
           response = await axios.get('http://localhost:3005/products');
        else
         response = await axios.get('http://localhost:3005/products?categoryId=' + categoryId);
        setProducts(response.data);
      } catch (error) {
        //console.log(error);
      }
    };
    getData();
  }, [categoryId]);

  return (
    <Stack flex={1} bg="#ffffff" width="100vw" minHeight="100vh">
      <Navbar />
      <ImageSwiper/>
      <Stack paddingTop={100} width="100%">
        <ScrollView showsVerticalScrollIndicator={false} padding={20}>
        <YStack alignItems="center" width="100%">
  <XStack
    flexWrap="wrap"
    width="100%"
    justifyContent="flex-start"
    paddingHorizontal={0} 
    gap={10}
  >
    {products.map((product) => (
     <YStack
     key={product.id}
     width={`calc((100% - ${(itemsPerRow - 1) * 10}px) / ${itemsPerRow})`}
     minWidth={150}
     padding={10}
     borderRadius={10}
     bg="#ffffff"
     borderWidth={1}
     borderColor="#ebebeb"
     alignItems="center"
     flexShrink={0}
     hoverStyle={{
       scale: 1.04,
      //  shadowColor: "rgba(0, 0, 0, 0.1)",
      //  shadowOffset: { width: 0, height: 4 },
      //  shadowRadius: 10,
       shadowOpacity: 1,
     }}
     transition="transform 0.2s ease-in-out"
   >
     <Image
       source={{ uri: product.image }}
       width="100%"
       height={300}
       borderRadius={10}
       marginBottom={10}
     />
     <Text fontSize={16} fontWeight="bold" color="#343434" textAlign="center" width="100%">
       {product.name}
     </Text>
     <Text color="#343434" fontSize={13} marginBottom={15} textAlign="center" width="100%">
       IDR {product.price}
     </Text>
     <Button
       onPress={() => navigate(`/detail/${product.id}`)}
       bg="#273aff"
       width="100%"
       pressStyle={{ bg: "$green10" }}
       borderRadius={10}
     >
       <Text color="$color1" fontSize={14}>Add to Cart</Text>
     </Button>
   </YStack>
    ))}
  </XStack>
</YStack>

        </ScrollView>
      </Stack>
    </Stack>
  );
}