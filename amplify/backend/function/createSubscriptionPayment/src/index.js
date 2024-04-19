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
const cognitoIdentityServiceProvider = new aws.CognitoIdentityServiceProvider();
const USER_POOL_ID = "ap-south-1_rAVCVKnN3";

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

    const { Parameter } = await new aws.SSM()
      .getParameter({
        Name: "arn:aws:ssm:ap-south-1:252296902626:parameter/amplify/d3h7yvv3paeq66/dev/AMPLIFY_createSubscriptionPayment_SECRET_STRIPE",
        WithDecryption: true,
      })
      .promise();

    const stripe = require("stripe")(Parameter.Value);

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
      success_url: `https://dc4802yfw21du.cloudfront.net/subscription-success/${userId}`,
      cancel_url: `https://dc4802yfw21du.cloudfront.net/user/${userId}`,
    });

    return { url, customer };
  } catch (err) {
    throw new Error(err);
  }
};
