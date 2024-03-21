/* Amplify Params - DO NOT EDIT
    AUTH_LIBRARYPORTAL590F4AE7_USERPOOLID
    ENV
    REGION
Amplify Params - DO NOT EDIT */

const { CognitoIdentityServiceProvider } = require("aws-sdk");
const cognito = new CognitoIdentityServiceProvider();
const USER_POOL_ID = "ap-south-1_rAVCVKnN3";
const stripe = require("stripe")("sk_test_51ORYlmSFkgnN12a3GzPKjq4IdbZ9qPaZth9qlA94glG1VdFVQ15SkRTQP3JK36A4cOEGsXDEuTnfd3FlXygTbXux00NEIr4DDv");

const getUserEmail = async (event) => {
  const params = {
    UserPoolId: USER_POOL_ID,
    Username: event.identity.claims.username
  };
  const user = await cognito.adminGetUser(params).promise();
  const { Value: email } = user.UserAttributes.find((attr) => {
    if (attr.Name === "email") {
      return attr.Value;
    }
  });
  return email;
};


async function getCustomerIdByEmail(email) {
  try {
    const customers = await stripe.customers.list({ email: email });
    if (customers.data.length > 0) {
      return customers.data[0].id;
    } else {
      console.log('Customer not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
}

async function listSubscriptionStatusesByCustomerId(customerId) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId
    });
    if (subscriptions.data.length > 0) {
      return subscriptions.data[0].status;
    } else {
      console.log('No subscription found for the customer');
      return null;
    }
  } catch (error) {
    console.error('Error fetching subscription statuses:', error);
    return null;
  }
}

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const email = await getUserEmail(event);
  console.log(email)

  try {
    const customerId = await getCustomerIdByEmail(email);
    if (customerId) {
      console.log('Customer ID:', customerId);
      const subscriptionStatus = await listSubscriptionStatusesByCustomerId(customerId);
      if (subscriptionStatus) {
        console.log('Subscription Status:', subscriptionStatus);
        return subscriptionStatus
      } else {
        console.log('No subscription found for the customer.');
        return "Not Active"
      }
    } else {
      console.log('No customer found with the given email.');
      return "NO"
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
