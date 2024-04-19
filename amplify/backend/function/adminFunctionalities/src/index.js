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
const AWS = require("aws-sdk");
const USER_POOL_ID = "ap-south-1_rAVCVKnN3";

const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  try {
    const { Parameter } = await new AWS.SSM()
      .getParameter({
        Name: "arn:aws:ssm:ap-south-1:252296902626:parameter/amplify/d3h7yvv3paeq66/dev/AMPLIFY_processSubscriptions_SECRET_STRIPE",
        WithDecryption: true,
      })
      .promise();

    const stripe = require("stripe")(Parameter.Value);

    // Task 1: Find all users in the user pool
    console.log("Fetching user list...");
    const userListParams = {
      UserPoolId: USER_POOL_ID,
      AttributesToGet: ["email"],
    };
    const userPoolUsers = await cognito.listUsers(userListParams).promise();
    const allUsers = userPoolUsers.Users.map((user) => ({
      email: user.Username,
      created: user.UserCreateDate,
    }));
    console.log("User list fetched:", allUsers);

    // Task 2: Retrieve all active customers from Stripe subscriptions
    console.log("Fetching active customers from Stripe...");
    const activeCustomers = await stripe.subscriptions.list({
      status: "active",
    });
    console.log("Active customers fetched:", activeCustomers.data);

    // Mapping customer IDs to emails
    const customerEmails = [];
    for (const subscription of activeCustomers.data) {
      try {
        const customer = await stripe.customers.retrieve(subscription.customer);
        customerEmails.push(customer.email);
        console.log(
          `Retrieved email for customer ${subscription.customer}: ${customer.email}`
        );
      } catch (error) {
        console.error(
          `Error retrieving email for customer ${subscription.customer}:`,
          error
        );
      }
    }

    console.log("Subscribed emails:", customerEmails);

    // Task 3: Check if the current user belongs to the Admin group in Cognito
    console.log("Checking admin status...");
    const currentUser = event.identity.claims.username; // Retrieving username from event.identity.claims
    const adminGroupParams = {
      UserPoolId: USER_POOL_ID,
      Username: currentUser,
    };
    const userGroups = await cognito
      .adminListGroupsForUser(adminGroupParams)
      .promise();
    console.log("User groups:", userGroups);
    const isAdmin = userGroups.Groups.some(
      (group) => group.GroupName === "Admin"
    );
    console.log("Is Admin:", isAdmin);

    // Return the response in the specified format
    const response = {
      allUsers: allUsers,
      subscribedUsers: customerEmails,
      isAdmin: isAdmin,
    };

    return response;
  } catch (error) {
    // Return error response
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error executing tasks.",
        error: error.message,
      }),
    };
  }
};
