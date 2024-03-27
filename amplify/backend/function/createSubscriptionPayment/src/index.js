/* Amplify Params - DO NOT EDIT
	AUTH_LIBRARYPORTAL590F4AE7_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const { CognitoIdentityServiceProvider } = require("aws-sdk");
const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
const USER_POOL_ID = "ap-south-1_rAVCVKnN3";
const stripe = require("stripe")(
  "sk_test_51ORYlmSFkgnN12a3GzPKjq4IdbZ9qPaZth9qlA94glG1VdFVQ15SkRTQP3JK36A4cOEGsXDEuTnfd3FlXygTbXux00NEIr4DDv"
);

const getUserEmail = async (event) => {
  const params = {
    UserPoolId: USER_POOL_ID,
    Username: event.identity.claims.username,
  };
  const user = await cognitoIdentityServiceProvider
    .adminGetUser(params)
    .promise();
  const { Value: email } = user.UserAttributes.find((attr) => {
    if (attr.Name === "email") {
      return attr.Value;
    }
  });
  return email;
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  try {
    const userId = event.arguments.input;
    const { username } = event.identity.claims;
    const email = await getUserEmail(event);

    const customerCreation = await stripe.customers.create({
      name: username,
      email: email,
      description: "Subscription For Library BookStore",
      address: {
        line1: "NMAM Institute Of Technology",
        postal_code: "574110",
        city: "Nitte",
        state: "Udupi",
        country: "IN",
      },
    });

    const { url, customer } = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1Ow4HFSFkgnN12a3HZtJvy6f",
          quantity: 1,
        },
      ],
      customer: customerCreation.id,
      mode: "subscription",
      success_url: `http://localhost:5173/subscription-success/${userId}`,
      cancel_url: `http://localhost:5173/user/${userId}`,
    });

    return { url, customer };
  } catch (err) {
    throw new Error(err);
  }
};
