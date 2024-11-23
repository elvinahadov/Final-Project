import React, { useEffect, useState } from "react";
import useOrderStore from "../../store/orderStore";
import useProductStore from "../../store/prodStore";
import useAuthStore from "../../store/authStore";

const UserOrder = () => {
  const { orders, loading, error, fetchUserOrders } = useOrderStore();
  const { user } = useAuthStore();
  const { getProductById } = useProductStore();
  const [productData, setProductData] = useState({});

  useEffect(() => {
    if (user) {
      fetchUserOrders(user._id);
    }
  }, [user, fetchUserOrders]);

  useEffect(() => {
    if (orders?.length) {
      orders.forEach((order) => {
        order.products.forEach(async (item) => {
          try {
            const product = await getProductById(item.productId);
            setProductData((prevData) => ({
              ...prevData,
              [item.productId]: product,
            }));
          } catch (error) {
            console.error("Failed to fetch product data:", error);
          }
        });
      });
    }
  }, [orders, getProductById]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h2 className="text-xl font-bold">Your Orders</h2>
      {Array.isArray(orders) && orders.length > 0 ? (
        <ul className="mt-4">
          {orders.map((order) => (
            <li
              key={order._id}
              className="p-4 border border-gray-300 rounded mb-4"
            >
              <p>Total: ${order.totalPrice.toFixed(2)}</p>
              <p>Created at: {new Date(order.createdAt).toLocaleString()}</p>
              <ul className="mt-2">
                {order.products.map((item) => {
                  const product = productData[item.productId]; // Get product data from state
                  return product ? (
                    <li key={item._id} className="flex items-center">
                      <img
                        src={product.productPhoto?.secure_url}
                        alt={product.name}
                        className="w-12 h-12 object-cover mr-4"
                      />
                      <div>
                        <p>{product.name}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </li>
                  ) : (
                    <p>Loading product info...</p>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default UserOrder;
