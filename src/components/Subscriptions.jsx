import { generateClient } from "aws-amplify/api";
import {
  createSubscriptionPayment,
  processSubscriptions,
} from "../api/mutations";
import React, { useEffect, useState } from "react";

export default function Subscriptions() {
  const userId = localStorage.getItem("userId");
  const client = generateClient();
  const [status, setStatus] = useState("Not Active")

  useEffect(() => {
    async function checkMembership() {
      let res
      if (localStorage.getItem("customer")) {
        res = await client.graphql({
          query: processSubscriptions,
          variables: {
            input: localStorage.getItem("customer"),
          },
        });
      } else {
        res = await client.graphql({
          query: processSubscriptions
        });
      }
      console.log(res);
      localStorage.setItem("status", res.data.processSubscriptions);
      setStatus(res.data.processSubscriptions)
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
      {status == "active" ? (
        <span className="">Active Member</span>
      ) : (
        <button onClick={handleClick}>Get Membership Access</button>
      )}
    </div>
  );
}
