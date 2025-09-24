import api from '../config/api';

const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createProduct = async (productData) => {
  try {
    const headers = {};
    if (productData instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data';
    }
    const response = await api.post('/products', productData, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateProduct = async (id, productData) => {
  try {
    const headers = {};
    if (productData instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data';
    }
    const response = await api.put(`/products/${id}`, productData, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
