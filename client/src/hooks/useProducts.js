import { useState, useEffect, useCallback } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productServices';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);  
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (productData) => {
    try {
      const newProduct = await createProduct(productData);
      setProducts(prevProducts => [...prevProducts, newProduct]);
      return newProduct;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const editProduct = async (id, productData) => {
    try {
      const updatedProduct = await updateProduct(id, productData);
      setProducts(prevProducts =>
        prevProducts.map(product => (product.id === id ? updatedProduct : product))
      );
      return updatedProduct;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const removeProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return { products, loading, error, fetchProducts, addProduct, editProduct, removeProduct };
};

export default useProducts;
