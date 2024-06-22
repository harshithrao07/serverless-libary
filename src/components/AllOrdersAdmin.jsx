import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { listBookOrders, listOrders } from "../api/queries";

const AllOrdersAdmin = () => {
  const client = generateClient();
  const [orders, setOrders] = useState([]);
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    async function getOrders() {
      try {
        const res = await client.graphql({
          query: listOrders,
        });
        const orderData = res.data.listOrders.items.map((order) => ({
          id: order.id,
          customer: order.user,
        }));
        setOrderData(orderData);
      } catch (error) {
        console.log(error);
      }
    }

    getOrders();
  }, []);

  useEffect(() => {
    async function getBooksForOrders() {
      try {
        const fetchedOrders = [];

        for (const orderInfo of orderData) {
          const res = await client.graphql({
            query: listBookOrders,
            variables: {
              filter: {
                order_id: {
                  eq: orderInfo.id,
                },
              },
            },
          });
          const bookOrders = res.data.listBookOrders.items;
          fetchedOrders.push({
            ...orderInfo,
            books: bookOrders,
          });
        }

        setOrders(fetchedOrders);
      } catch (error) {
        console.log(error);
      }
    }

    if (orderData.length > 0) {
      getBooksForOrders();
    }
  }, [orderData]);

  return (
    <div>
      <header className="form-header">
        <span className="text-4xl font-bold text-primary-200 mt-3">
          All Orders
        </span>
      </header>
      <div>
        {orders
          .sort(
            (a, b) =>
              new Date(b.books[0].createdAt) - new Date(a.books[0].createdAt)
          ) // Sorting orders by createdAt in descending order
          .map((order) => (
            <div
              key={order.id}
              className="border border-gray-300 rounded-md shadow-md p-4 mb-4"
            >
              <h3 className="text-lg font-semibold">Order ID: {order.id}</h3>
              <p className="text-gray-600">
                Customer: <span className="font-bold">{order.customer}</span>
              </p>
              <p className="text-gray-600">
                Created At:{" "}
                <span className="font-bold">
                  {new Date(order.books[0].createdAt).toLocaleString()}
                </span>
              </p>
              <ul className="mt-4">
                {order.books.map((bookOrder) => (
                  <li key={bookOrder.id} className="flex items-center mb-2">
                    <img
                      src={bookOrder.book.image}
                      alt={bookOrder.book.title}
                      className="w-16 h-16 object-cover rounded mr-4"
                    />
                    <div className="text-left">
                      <p className="text-lg font-semibold">
                        {bookOrder.book.title}
                      </p>
                      <p className="text-gray-600">
                        Quantity: {bookOrder.quantity}
                      </p>
                      {/* Add more book order details if needed */}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AllOrdersAdmin;
