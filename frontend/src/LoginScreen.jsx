import React, { useState, useEffect } from 'react';
import { Stack, Unspaced, Input, Dialog, Button, Text, YStack, Image, Label, XStack } from 'tamagui';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from '@tamagui/animate-presence';
import { X } from '@tamagui/lucide-icons'

import axios from 'axios';

const LoginScreen = () => {
    let navigate = useNavigate();
    const [datannya, setDatanya] = useState({ email: '', password: '' });
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (name, value) => {
        //console.log("name: " + name);
        //console.log("value: " + value);
        setDatanya({
            ...datannya,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        //console.log(datannya);
        const response = await axios.post("http://localhost:3005/login", {
          email: datannya.email,
          password: datannya.password,
        });
        // setShowModal(true);
        // setMessage("Berhasi login!");
        // //console.log(response.data);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("id", response.data.user.id);
        localStorage.setItem("email", response.data.user.email);
        localStorage.setItem("role", response.data.user.role);

        const response2 = await axios.get("http://localhost:3005/cart?userId=" + response.data.user.id);
        const uniqueProductCount = new Set(response2.data.map(item => item.productId)).size;
        // //console.log("Cart data: " + JSON.stringify(response2.data.length));
        localStorage.setItem("banyakCart", uniqueProductCount);

        if(response.data.user.role == "admin")
        navigate("/admin");
        else
        navigate("/");
      } catch (error) {
        setShowModal(true);
        setMessage("Gagal Login!");
        console.error(error);
      }
    };
  return (
    <Stack
      flex={1}
      justifyContent="center"
      alignItems="center"
      bg="#fff"
      padding={20}
      minHeight="100vh"
      width="100vw"
    >
      {/* Modal Notifikasi dengan Animasi */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <Dialog.Portal>
          <AnimatePresence>
            {showModal && (
              <>
                <Dialog.Overlay
                  key="overlay"
                  bg="rgba(0,0,0,0.5)"
                  enterStyle={{ opacity: 0 }}
                  exitStyle={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 200 } }}
                />
                <Dialog.Content
                  bordered
                  elevate
                  key="content"
                  animateOnly={["transform", "opacity"]}
                  animation={[
                    "quicker",
                    {
                      opacity: {
                        overshootClamping: true,
                      },
                    },
                  ]}
                  enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                  exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                  gap="$4"
                >
                  <Dialog.Title>Login Fail!</Dialog.Title>
                  <Dialog.Description>
                    username / password invalid.
                  </Dialog.Description>

                  <XStack alignSelf="flex-end" gap="$4">
                    <Dialog.Close displayWhenAdapted asChild width={300}>
                      <Button
                        theme="accent"
                        aria-label="Close"
                        marginTop={2}
                        bg="#273aff"
                        pressStyle={{ bg: "$green10" }}
                        width={200}
                        maxWidth={300}
                        marginRight={22}
                        // padding={12}
                        color={"#ffffff"}
                        borderRadius={10}
                      >
                        OK
                      </Button>
                    </Dialog.Close>
                  </XStack>

                  {/* <Unspaced>
            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$3"
                right="$3"
                size="$2"
                circular
                icon={X}
              />
            </Dialog.Close>
          </Unspaced> */}
                </Dialog.Content>
              </>
            )}
          </AnimatePresence>
        </Dialog.Portal>
      </Dialog>

      <YStack
        width="100%"
        height="100vh"
        borderRadius={0}
        padding={25}
        bg="#ffffff"
        shadow="lg"
        alignItems="center"
        justifyContent="center"
      >
        <Image
          source={{ uri: "/logo.png" }}
          width={250}
          height={150}
          aspectRatio={1 / 1}
        />
        <Text
          fontSize={26}
          fontWeight="bold"
          color="#343434"
          textAlign="center"
        >
          Welcome Back!
        </Text>
        <Text color="#343434" textAlign="center" marginBottom={15}>
          Please login to continue
        </Text>
        <YStack alignItems="center" width="100%">
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Input
              borderColor="$color6"
              padding={12}
              borderRadius={10}
              width="90%"
              maxWidth={400}
              type="text"
              name="email"
              placeholder="Input Email"
              onChangeText={(text) => handleChange("email", text)}
              required
            />
            <Input
              secureTextEntry
              borderColor="$color6"
              marginTop={12}
              padding={12}
              borderRadius={10}
              width="90%"
              maxWidth={400}
              type="password"
              name="password"
              placeholder="Input Password"
              onChangeText={(text) => handleChange("password", text)}
              required
            />
            <Button
              marginTop={20}
              bg="#273aff"
              pressStyle={{ bg: "$green10" }}
              width="90%"
              maxWidth={400}
              padding={12}
              borderRadius={10}
            >
              <Text color="$color1" fontSize={16}>
                Sign In
              </Text>
            </Button>
          </form>
          <Text color="#343434" style={{ marginTop: 20 }} fontSize={14}>
              Don't have an account?{" "}
            </Text>
            <Button
              bg="#fff"
              alignSelf="center"
              style={{ alignSelf: "center" }}
              marginRight={10}
              onClick={() => navigate("/register")}
              color="#273aff"
              fontSize={14}
              marginTop={2}
            >
              Sign up here
            </Button>
        </YStack>
      </YStack>
    </Stack>
  );
};

export default LoginScreen;
