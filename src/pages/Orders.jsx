import React, { useEffect } from 'react'
import { generateClient } from "aws-amplify/api";
import { listOrders } from '../api/queries';

const Orders = () => {

  const client = generateClient()

  useEffect(() => {
    async function getOrderId() {
      const res = await client.graphql({
        query: listOrders,
        variables: {
          filter: {
            user: { eq: sessionStorage.getItem("user") }
          }
        }
      })
    }

  }, [])


  // const renderOrderList = () => {
  //   if (orders) {
  //     orders = orders.order.reverse()
  //     return orders.map((order, index) => {
  //       const date_added = new Date(order.date_added).toLocaleString()
  //       let items = order.items
  //       let total = items.reduce((acc, item) => acc + item.quantity * item.price, 0);

  //       const renderItems = items.map((item, index) => (
  //         <div className="flex items-center py-3" key={index}>
  //           <img alt={index} className="w-20 rounded-xl" src={item.imageUrl} />
  //           <div className="flex flex-col justify-center ml-5">
  //             <span className="text-sm md:text-lg lg:text-xl font-bold">{item.name.split(' ').slice(0, 3).join(' ')}&nbsp;<span className="font-bold lg:text-xl text-md md:text-lg italic text-primary-200">x{item.quantity}</span></span>
  //             <span className="text-sm text-gray-700">{item.brand}</span>
  //             <span className="text-sm md:text-lg lg:text-xl">${item.price}</span>
  //           </div>
  //         </div>
  //       ))

  //       const renderBillComponent = items.map((item, index) => (
  //         <div key={index} className="grid grid-cols-4 lg:grid-cols-5 py-1 md:px-0 border-t border-black">
  //           <span className="text-xs md:text-md lg:text-lg lg:col-span-2">{item.name}</span>
  //           <span className="text-xs md:text-md lg:text-lg flex justify-center">${item.price}</span>
  //           <span className="text-xs md:text-md lg:text-lg flex justify-center">x{item.quantity}</span>
  //           <span className="text-xs md:text-md lg:text-lg flex justify-center">${item.price * item.quantity}</span>
  //         </div>
  //       ))

  //       return (
  //         <div key={index} className="bg-orange-100 bg-opacity-50 my-5 p-5 md:rounded-xl">
  //           <span className="text-lg lg:text-2xl">Order placed on <span className="font-bold text-primary-200">{date_added}</span></span>
  //           <div className="grid grid-cols-1 md:grid-cols-2 md:mt-3 lg:mt-0">
  //             <div>
  //               {renderItems}
  //             </div>
  //             <div className="p-3 md:p-5 bg-white rounded-xl">
  //               <span className="text-lg lg:text-2xl font-bold">Your past bill:</span>
  //               <div className="grid grid-cols-4 lg:grid-cols-5 mt-3 md:mt-5">
  //                 <span className="text-xs md:text-md lg:text-lg lg:col-span-2 font-bold">Name</span>
  //                 <span className="text-xs md:text-md lg:text-lg flex justify-center font-bold">Price</span>
  //                 <span className="text-xs md:text-md lg:text-lg flex justify-center font-bold">Quantity</span>
  //                 <span className="text-xs md:text-md lg:text-lg flex justify-center font-bold">Total Cost</span>
  //               </div>
  //               <div>
  //                 {renderBillComponent}
  //               </div>
  //               <div className="grid grid-cols-4 lg:grid-cols-5 border-t border-black">
  //                 <span className="col-start-4 lg:col-start-5 text-lg lg:text-2xl font-bold text-center border-b border-black">${total}</span>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       )
  //     })
  //   } else {
  //     return (
  //       <div className="flex flex-col col-span-3 items-center justify-center">
  //         <span className="text-xl mt-3 md:text-4xl">No orders placed yet</span>
  //         <span className="text-2xl mt-1 md:text-6xl md:mt-5">(ᴗ_ ᴗ。)</span>
  //       </div>
  //     )
  //   }

  // }


  return (
    <div className="flex flex-col">
      <div className="pb-4 md:px-16">
        <span className="text-xl ml-5 md:ml-0 md:text-2xl pb-1 border-b-2 border-orange-100">Your past orders:</span>
        {renderOrderList}
      </div>
    </div>
  )
}

export default Orders