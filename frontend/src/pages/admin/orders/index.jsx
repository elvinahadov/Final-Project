import React, { useEffect } from "react";
import { toast } from "react-toastify";
import useOrderStore from "../../../store/orderStore";

const Orders = () => {
  const { orders, loading, fetchAllOrders, updateOrderStatus } = useOrderStore();

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      await fetchAllOrders();
    } catch (error) {
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">All Orders</h1>
      {loading ? (
        <p className="text-center">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg hidden sm:table">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Order ID</th>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Total Price</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b text-center">
                  <td className="px-4 py-2 text-left">{order._id}</td>
                  <td className="px-4 py-2 text-left">{order.userId.name}</td>
                  <td className="px-4 py-2 text-left">${order.totalPrice}</td>
                  <td className="px-4 py-2 text-left">{order.paymentStatus}</td>
                  <td className="px-4 py-2 text-left">
                    <select
                      value={order.paymentStatus}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="bg-black text-white py-1 px-3 rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Stackable Card-like Layout for Smaller Screens */}
          <div className="sm:hidden grid grid-cols-1 gap-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-4 rounded-lg shadow border"
              >
                <h2 className="text-lg font-bold">Order ID: {order._id}</h2>
                <p>
                  <strong>User:</strong> {order.userId.name}
                </p>
                <p>
                  <strong>Total Price:</strong> ${order.totalPrice}
                </p>
                <p>
                  <strong>Status:</strong> {order.paymentStatus}  {/* Corrected to paymentStatus */}
                </p>
                <div className="sm:flex sm:items-center sm:justify-start">
                  <select
                    value={order.paymentStatus}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="bg-black text-white py-1 px-3 rounded w-auto sm:w-full"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;