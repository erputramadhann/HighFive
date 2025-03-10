import React, { useState } from 'react';
import { Stack, Input, Dialog, Button, Text, YStack, Image, XStack } from 'tamagui';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from '@tamagui/animate-presence';
import axios from 'axios';

const RegisterScreen = () => {
    let navigate = useNavigate();
    const [datanya, setDatanya] = useState({ email: '', password: '' });
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (name, value) => {
        setDatanya({
            ...datanya,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post("http://localhost:3005/register", {
                email: datanya.email,
                password: datanya.password,
                role: "customer"
            });

            setMessage("Registrasi berhasil!");
            setShowModal(true);

            // Tunggu beberapa detik lalu redirect ke halaman login
            setTimeout(() => {
                setShowModal(false);
                navigate("/login");
            }, 2000);
        } catch (error) {
            setMessage("Registrasi gagal! Periksa kembali data yang dimasukkan.");
            setShowModal(true);
            console.error(error);
        }
    };

    return (
        <Stack flex={1} justifyContent="center" alignItems="center" padding={20} minHeight="100vh" width="100vw">
            {/* Modal Notifikasi */}
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
                                    animateOnly={['transform', 'opacity']}
                                    animation={[
                                        'quicker',
                                        { opacity: { overshootClamping: true } },
                                    ]}
                                    enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                                    exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                                    gap="$4"
                                >
                                    <Dialog.Title>{message}</Dialog.Title>

                                    <XStack alignSelf="flex-end" gap="$4">
                                        <Dialog.Close asChild width={300}>
                                            <Button
                                                theme="accent"
                                                aria-label="Close"
                                                marginTop={2}
                                                bg="#273aff"
                                                pressStyle={{ bg: "$green10" }}
                                                width={200}
                                                maxWidth={300}
                                                marginRight={22}
                                                color={"#ffffff"}
                                                borderRadius={10}
                                            >
                                                OK
                                            </Button>
                                        </Dialog.Close>
                                    </XStack>
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
                    source={{ uri: '/logo.png' }}
                    width={250}
                    height={150}
                    aspectRatio={1 / 1}
                />

                <Text fontSize={26} fontWeight="bold" color="#343434" textAlign="center">
                    Hello Fellas!
                </Text>
                <Text color="#343434" textAlign="center" marginBottom={15}>
                    Come on, register your account first
                </Text>

                <YStack alignItems="center" width="100%">
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <Input
                            placeholder="Email"
                            borderColor="$color6"
                            borderRadius={10}
                            width="90%"
                            maxWidth={400}
                            type="email"
                            required
                            onChange={(e) => handleChange("email", e.target.value)}
                        />
                        <Input
                            secureTextEntry
                            placeholder="Password"
                            type="password"
                            name="password"
                            borderColor="$color6"
                            marginTop={12}
                            borderRadius={10}
                            width="90%"
                            maxWidth={400}
                            required
                            onChange={(e) => handleChange("password", e.target.value)}
                        />

                        <Button
                            marginTop={20}
                            bg="#273aff"
                            pressStyle={{ bg: '$green10' }}
                            width="90%"
                            maxWidth={400}
                            padding={12}
                            borderRadius={10}
                        >
                            <Text color="$color1" fontSize={16}>Sign Up</Text>
                        </Button>
                    </form>
                    <Text color="#343434" style={{ marginTop: 20 }} fontSize={14}>
                    Already have an account? {" "}
            </Text>
            <Button
              bg="#fff"
              alignSelf="center"
              style={{ alignSelf: "center" }}
              marginRight={10}
              onClick={() => navigate("/login")}
              color="#273aff"
              fontSize={14}
              marginTop={2}
            >
              Log in here
            </Button>
                </YStack>
            </YStack>

        </Stack>
    );
};

export default RegisterScreen;