import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { listBookOrders, listOrders } from "../api/queries";

const Orders = () => {
  const [orderIds, setOrderIds] = useState([]);
  const [orders, setOrders] = useState(null);
  const client = generateClient();

  useEffect(() => {
    async function getOrderId() {
      try {
        const res = await client.graphql({
          query: listOrders,
          variables: {
            filter: {
              user: { eq: localStorage.getItem("username") },
            },
          },
        });

        const idsFromQuery = res.data.listOrders.items.map((order) => order.id);
        setOrderIds(idsFromQuery);
      } catch (error) {
        console.log(error);
      }
    }

    getOrderId();
  }, []);

  useEffect(() => {
    async function getBooksForOrders() {
      try {
        const fetchedOrders = [];

        for (const orderId of orderIds) {
          const res = await client.graphql({
            query: listBookOrders,
            variables: {
              filter: {
                order_id: {
                  eq: orderId,
                },
              },
            },
          });
          const bookOrders = res.data.listBookOrders.items;
          fetchedOrders.push(bookOrders);
        }

        const data = fetchedOrders.map((orders) => {
          const orderItems = orders.map((order) => ({
            id: order.book.id,
            title: order.book.title,
            description: order.book.description,
            image: order.book.image,
            author: order.book.author,
            quantity: order.quantity,
            price: order.book.price,
          }));

          return {
            createdAt: orders[0].createdAt,
            customer: orders[0].customer,
            id: orders[0].id,
            order_id: orders[0].order_id,
            items: orderItems,
          };
        });

        setOrders(data);
      } catch (error) {
        console.log(error);
      }
    }

    if (orderIds.length > 0) {
      getBooksForOrders();
    }
  }, [orderIds]);

  const renderOrderList = () => {
    if (orders.length > 0) {
      const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return sortedOrders.map((order, index) => {
        const date_added = new Date(order.createdAt).toLocaleString();
        let items = order.items;
        let total = items.reduce(
          (acc, item) => acc + item.quantity * item.price,
          0
        );

        const renderItems = items.map((item, index) => (
          <div className="flex items-center py-3" key={index}>
            <img alt={index} className="w-20" src={item.image} />
            <div className="flex flex-col justify-center ml-5">
              <span className="text-sm md:text-lg lg:text-xl font-bold">
                {item.title}&nbsp;
                <span className="font-bold lg:text-xl text-md md:text-lg italic text-primary-200">
                  x{item.quantity}
                </span>
              </span>
              <span className="text-sm text-gray-700">{item.author}</span>
              <span className="text-sm md:text-lg lg:text-xl">
                ₹{item.price}
              </span>
            </div>
          </div>
        ));

        const renderBillComponent = items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-4 lg:grid-cols-5 py-1 md:px-0 border-t border-black"
          >
            <span className="text-xs md:text-md lg:text-lg lg:col-span-2">
              {item.title}
            </span>
            <span className="text-xs md:text-md lg:text-lg flex justify-center">
              ₹{item.price}
            </span>
            <span className="text-xs md:text-md lg:text-lg flex justify-center">
              x{item.quantity}
            </span>
            <span className="text-xs md:text-md lg:text-lg flex justify-center">
              ₹{item.price * item.quantity}
            </span>
          </div>
        ));

        return (
          <div
            key={index}
            className="bg-orange-200 bg-opacity-50 my-5 p-5 md:rounded-xl"
          >
            <span className="text-lg lg:text-2xl">
              Order placed on{" "}
              <span className="font-bold text-primary-200">{date_added}</span>
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 md:mt-3 lg:mt-0">
              <div>{renderItems}</div>
              <div className="p-3 md:p-5 bg-white rounded-xl">
                <span className="text-lg lg:text-2xl font-bold">
                  Your past bill:
                </span>
                <div className="grid grid-cols-4 lg:grid-cols-5 mt-3 md:mt-5">
                  <span className="text-xs md:text-md lg:text-lg lg:col-span-2 font-bold">
                    Name
                  </span>
                  <span className="text-xs md:text-md lg:text-lg flex justify-center font-bold">
                    Price
                  </span>
                  <span className="text-xs md:text-md lg:text-lg flex justify-center font-bold">
                    Quantity
                  </span>
                  <span className="text-xs md:text-md lg:text-lg flex justify-center font-bold">
                    Total Cost
                  </span>
                </div>
                <div>{renderBillComponent}</div>
                <div className="grid grid-cols-4 lg:grid-cols-5 border-t border-black">
                  <span className="col-start-4 lg:col-start-5 text-lg lg:text-2xl font-bold text-center border-b border-black">
                    ₹{total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      });
    } else {
      return (
        <div className="flex flex-col col-span-3 items-center justify-center">
          <span className="text-xl mt-3 md:text-4xl">No orders placed yet</span>
          <span className="text-2xl mt-1 md:text-6xl md:mt-5">(ᴗ_ ᴗ。)</span>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col">
      <div className="pb-4 md:px-16">
        {orders == null ? (
          <div className="flex justify-center italic">
            <span className="text-xl">Loading....</span>
          </div>
        ) : (
          <>
            <span className="text-xl ml-5 md:ml-0 md:text-2xl pb-1 border-b-2 border-primary-100">
              Your past orders:
            </span>
            {renderOrderList()}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;
