import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, Card, Input, Dialog, Label, ScrollView, useWindowDimensions, Stack, Avatar } from 'tamagui';
import { Pencil, Trash, Plus } from '@tamagui/lucide-icons';
import axios from 'axios';
import Admin from './assets/admin.png';
import { useNavigate } from 'react-router';
import { CgOverflow } from 'react-icons/cg';
import { motion } from "motion/react"

const API_BASE_URL = "http://localhost:3005";

const AdminBatik = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const id = localStorage.getItem("id");
  const { width } = useWindowDimensions();
  const itemsPerRow = width > 1200 ? 5 : width > 900 ? 3 : width > 600 ? 2 : 1;
  const imageWidth = width / (itemsPerRow * 1.2);

  const initialProductState = {
    name: "",
    price: "",
    categoryId: "",
    image: "",
    description: "",
    stock: 0,
    userId: 4,
  };

  const [newProduct, setNewProduct] = useState(initialProductState);


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log("token: " + token);
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    
    if (role !== "admin" && !id) {
      navigate("/login")
    } else {
      fetchProducts();
      fetchCategories();
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleChange = (e, field) => {
    setSelectedProduct((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleNewProductChange = (e, field) => {
    setNewProduct((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`${API_BASE_URL}/products/${selectedProduct.id}`, selectedProduct);
      setProducts((prev) => prev.map((p) => (p.id === selectedProduct.id ? selectedProduct : p)));
      setModalOpen(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const yourToken = localStorage.getItem("accessToken")
        await axios.delete(`${API_BASE_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${yourToken}` }
        });
        setProducts((prev) => prev.filter((product) => product.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleAddProduct = async () => {
    try {
      const yourToken = localStorage.getItem("accessToken");
      if (!yourToken) {
        console.error("No token found. Please log in again.");
        return;
      }
  
      const response = await axios.post(
        `${API_BASE_URL}/products`,
        newProduct,
        {
          headers: { Authorization: `Bearer ${yourToken}` }
        }
      );
  
      setProducts((prev) => [...prev, response.data]);
      setAddModalOpen(false);
      setNewProduct(initialProductState);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };
  

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <View flexDirection="row" height="100vh">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <View width={250} backgroundColor="blue" padding={20} alignItems="center"
          style={{
            overflow: "hidden",
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            height: "100vh",
            zIndex: 1000
          }}
        >
          <Avatar circular size="$10">
            <Avatar.Image
              accessibilityLabel="Cam"
              src={{ uri: "/logo.png" }}
            />
            <Avatar.Fallback backgroundColor="$blue10" />
          </Avatar>
          <Text color="white" fontSize={18} fontWeight="bold" marginTop={10}>
            HighFive Admin
          </Text>
          <Button onClick={handleLogout} backgroundColor="white" color="black" marginTop={25}>
            Logout
          </Button>
        </View>
      </motion.div>

      {/* Content */}
      <View flex={1} padding={20} style={{ marginLeft: 220 }}>

        <ScrollView>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ flex: 1, padding: 10 }}
          >
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: 'center', fontSize: 25, fontWeight: 'bold', marginBottom: 10 }}
            >Our Available Products</motion.h2>

            {loading ? (
              <Text>Loading...</Text>
            ) : (
              <View alignItems="center" justifyContent="center" flexDirection="row" flexWrap="wrap" gap={20} style={{ overflow: "hidden" }}>
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card
                      key={product.id}
                      width={imageWidth * 1.1}
                      padding={15}
                      borderRadius={10}
                      backgroundColor="white"
                      shadowColor="gray"
                      overflow="hidden"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Stack alignItems="center" justifyContent="center">
                        <Image
                          width={imageWidth}
                          height={imageWidth}
                          borderRadius={10}
                          source={{ uri: product.image || 'https://via.placeholder.com/150' }}
                        />
                      </Stack>

                      <Text fontSize={16} fontWeight="bold" marginTop={10} textAlign="center">
                        {product.name}
                      </Text>

                      <View flexDirection="row" justifyContent="space-between" marginTop={10} width="100%">
                        <motion.div whileHover={{ scale: 1.2 }}>
                          <Pencil size={20} cursor="pointer" color="blue" onClick={() => handleEditClick(product)} />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.2 }}>
                          <Trash size={20} cursor="pointer" color="red" onClick={() => handleDeleteProduct(product.id)} />
                        </motion.div>
                      </View>
                    </Card>
                  </motion.div>

                ))}
              </View>
            )}
          </motion.div>
        </ScrollView>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            bg="#273aff"
            marginTop={20}
            style={{ marginLeft: 80, marginRight: 80 }}
            onClick={() => setAddModalOpen(true)}
          >
            <Plus size={20} />
            <Text color="white"> Add Product </Text>
          </Button>
        </motion.div>

        {/* Edit Modal */}
        <ProductFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          product={selectedProduct}
          onChange={handleChange}
          onSubmit={handleSaveChanges}
          categories={categories}
          title="Edit Product"
          size="small"
        />

        {/* Add Modal */}
        <ProductFormModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          product={newProduct}
          onChange={handleNewProductChange}
          onSubmit={handleAddProduct}
          categories={categories}
          title="Add New Product"
          size="small"
        />
      </View>
    </View>
  );
};

// Reusable Product Form Modal Component
const ProductFormModal = ({ isOpen, onClose, product, onChange, onSubmit, categories, title, size, disableCategory }) => {
  return (
    isOpen && (
      <Dialog open={isOpen} onOpenChange={onClose}>
        {/* Wrap overlay inside a View that covers only the content */}
        <View style={{
          position: "absolute",
          top: 0,
          left: "30px",
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 998
        }} />

        <Dialog.Content
          width={size === "small" ? 400 : "80vw"}
          maxWidth={size === "small" ? 400 : "none"}
          padding={size === "small" ? 20 : 40}
          borderRadius={10}
          backgroundColor="white"
          style={{
            position: "fixed",
            top: "50%",
            left: "35%",
            transform: "translate(-50%, -50%)",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            zIndex: 999
          }}
        >
          <Dialog.Title>{title}</Dialog.Title>

          <Label>Name:</Label>
          <Input value={product.name} onChange={(e) => onChange(e, 'name')} />

          <Label>Price:</Label>
          <Input value={product.price} onChange={(e) => onChange(e, 'price')} />

          <Label>Category:</Label>
          <select
            value={product.categoryId}
            disabled={disableCategory}
            onChange={(e) => onChange(e, 'categoryId')}
            style={{ fontSize: "16px", color: "black", padding: "10px", width: "100%", appearance: 'none', paddingRight: "25px", backgroundColor: "#ccc" }}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id} style={{ fontSize: "16px" }}>
                {category.name}
              </option>
            ))}
          </select>

          <Label>Image URL:</Label>
          <Input value={product.image} onChange={(e) => onChange(e, 'image')} />

          <Label>Description:</Label>
          <Input value={product.description} onChange={(e) => onChange(e, 'description')} />

          <Label>Stock:</Label>
          <Input value={product.stock} onChange={(e) => onChange(e, 'stock')} />

          <Button bg="#273aff" onClick={onSubmit} marginTop={10}>
            <Text color="white">Save</Text>
          </Button>
        </Dialog.Content>
      </Dialog>

    )
  );
};

export default AdminBatik;