import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    productId: "",
    name: "",
    price: "",
    featured: false,
    rating: "",
    company: "",
  });

  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products`,
        config
      );

      setProducts(response.data.products);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox" ? checked : value,
    });
  };

  const addProduct = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products`,
        {
          ...form,
          price: Number(form.price),
          rating: Number(form.rating),
        },
        config
      );

      setForm({
        productId: "",
        name: "",
        price: "",
        featured: false,
        rating: "",
        company: "",
      });

      fetchProducts();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to add product"
      );
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/products/${productId}`,
        config
      );

      fetchProducts();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="products-page">
      <nav>
        <h2>Product Management</h2>

        <button onClick={logout}>
          Logout
        </button>
      </nav>

      <div className="content">
        <div className="form-section">
          <h2>Add Product</h2>

          {error && (
            <p className="error">{error}</p>
          )}

          <form onSubmit={addProduct}>
            <input
              type="text"
              name="productId"
              placeholder="Product ID"
              value={form.productId}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />

            <input
              type="number"
              name="rating"
              placeholder="Rating (0-5)"
              value={form.rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
            />

            <input
              type="text"
              name="company"
              placeholder="Company"
              value={form.company}
              onChange={handleChange}
              required
            />

            <label>
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
              />

              Featured Product
            </label>

            <button type="submit">
              Add Product
            </button>
          </form>
        </div>

        <div className="product-section">
          <h2>All Products</h2>

          <div className="product-grid">
            {products.map((product) => (
              <div
                className="product-card"
                key={product.productId}
              >
                <h3>{product.name}</h3>

                <p>
                  Product ID:{" "}
                  {product.productId}
                </p>

                <p>
                  Company: {product.company}
                </p>

                <p>
                  Price: ₹{product.price}
                </p>

                <p>
                  Rating:{" "}
                  {product.rating?.$numberDecimal ||
                    product.rating}
                </p>

                <p>
                  Featured:{" "}
                  {product.featured
                    ? "Yes ⭐"
                    : "No"}
                </p>

                <button
                  onClick={() =>
                    deleteProduct(
                      product.productId
                    )
                  }
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;