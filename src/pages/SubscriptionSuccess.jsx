import React, { useEffect } from 'react'
import { generateClient } from "aws-amplify/api";
import { processSubscriptions } from '../api/mutations';

const SubscriptionSuccess = () => {
  const client = generateClient()

  const payload = {
    user: localStorage.getItem("username"),
    userId: localStorage.getItem("userId")
  }

  useEffect(() => {
    async function checkMembership() {
      console.log(payload)
      const res = await client.graphql({
        query: processSubscriptions,
        variables: {
          input: payload
        }
      })

      console.log(res)
    }

    checkMembership()
  }, [])

  return (
    <div>SubscriptionSuccess</div>
  )
}

export default SubscriptionSuccess  