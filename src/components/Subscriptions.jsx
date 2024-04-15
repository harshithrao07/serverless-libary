import { generateClient } from "aws-amplify/api";
import {
  createSubscriptionPayment,
  processSubscriptions,
} from "../api/mutations";
import React, { useEffect, useState } from "react";

export default function Subscriptions() {
  const userId = localStorage.getItem("userId");
  const client = generateClient();
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function checkMembership() {
      const res = await client.graphql({
        query: processSubscriptions,
      });

      console.log(res);
      localStorage.setItem("status", res.data.processSubscriptions);
      setStatus(res.data.processSubscriptions);
    }

    checkMembership();
  }, []);

  const handleClick = async (e) => {
    const res = await client.graphql({
      query: createSubscriptionPayment,
      variables: {
        input: userId,
      },
    });
    const data = res.data.createSubscriptionPayment;
    localStorage.setItem("customer", data.customer);
    window.location.replace(data.url);
  };

  return (
    <div className="mt-1 md:mt-3 pb-1">
      {status === "active" ? (
        <div>
          <span className="font-bold rainbow-words text-2xl">
            Active Member
          </span>
          <p className="mt-2 text-sm text-black">
            You have access to exclusive PDF content. Enjoy the benefits of your
            membership!
          </p>
        </div>
      ) : status === "Not Active" ? (
        <div>
          <button onClick={handleClick} className="focus:outline-none">
            <span className="font-bold text-2xl transition duration-1000 transform-gpu hover:border-b-2 border-black">
              Get Membership Access
            </span>
          </button>
          <p className="mt-2 text-black text-sm">
            Gain access to exclusive PDF content by becoming a member!
          </p>
        </div>
      ) : (
        <span className="italic">Loading...</span>
      )}
    </div>
  );
}
