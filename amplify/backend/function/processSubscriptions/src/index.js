/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["SECRET_STRIPE"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
/* Amplify Params - DO NOT EDIT
    AUTH_LIBRARYPORTAL590F4AE7_USERPOOLID
    ENV
    REGION
Amplify Params - DO NOT EDIT */

const aws = require("aws-sdk");
const cognito = new aws.CognitoIdentityServiceProvider();
const USER_POOL_ID = "ap-south-1_rAVCVKnN3";
let stripe;

const getUserEmail = async (event) => {
  const params = {
    UserPoolId: USER_POOL_ID,
    Username: event.identity.claims.username,
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
      for (const customer of customers.data) {
        if (customer.description === "Subscription For Library BookStore") {
          return customer.id;
        }
      }
      console.log("Subscription not found for Library BookStore");
      return null;
    } else {
      console.log("Customer not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
  }
}

async function listSubscriptionStatusesByCustomerId(customerId) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
    });

    if (subscriptions.data.length > 0) {
      return subscriptions.data[0].status;
    } else {
      console.log("No subscription found for the customer");
      return null;
    }
  } catch (error) {
    console.error("Error fetching subscription statuses:", error);
    return null;
  }
}

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const email = await getUserEmail(event);
  console.log(email);

  const { Parameter } = await new aws.SSM()
    .getParameter({
      Name: "arn:aws:ssm:ap-south-1:252296902626:parameter/amplify/d3h7yvv3paeq66/dev/AMPLIFY_processSubscriptions_SECRET_STRIPE",
      WithDecryption: true,
    })
    .promise();

  stripe = require("stripe")(Parameter.Value);

  const customerId = await getCustomerIdByEmail(email);

  try {
    if (customerId) {
      console.log("Customer ID:", customerId);
      const subscriptionStatus = await listSubscriptionStatusesByCustomerId(
        customerId
      );
      if (subscriptionStatus) {
        console.log("Subscription Status:", subscriptionStatus);
        return subscriptionStatus;
      } else {
        console.log("No subscription found for the customer.");
        return "Not Active";
      }
    } else {
      console.log("No customer found with the given email.");
      return "Not Active";
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};
