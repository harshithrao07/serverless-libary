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

/*
 * Get the total price of the order
 * Charge the customer
 */
exports.handler = async (event) => {
  try {
    const { cartInput, userId } = event.arguments.input;
    const { username } = event.identity.claims;
    const email = await getUserEmail(event);

    const { Parameter } = await new aws.SSM()
      .getParameter({
        Name: "arn:aws:ssm:ap-south-1:252296902626:parameter/amplify/d3h7yvv3paeq66/dev/AMPLIFY_processPayment_SECRET_STRIPE",
        WithDecryption: true,
      })
      .promise();


    const stripe = require("stripe")(Parameter.Value);

    const customer = await stripe.customers.create({
      name: username,
      email: email,
      description: "Library BookStore",
      address: {
        line1: "NMAM Institute Of Technology",
        postal_code: "574110",
        city: "Nitte",
        state: "Udupi",
        country: "IN",
      },
    });

    console.log(cartInput);

    const { url } = await stripe.checkout.sessions.create({
      line_items: cartInput.map((item) => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.title,
              images: [item.image],
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        };
      }),
      client_reference_id: userId,
      customer: customer.id,
      mode: "payment",
      success_url: `https://dc4802yfw21du.cloudfront.net/success/${userId}`,
      cancel_url: `https://dc4802yfw21du.cloudfront.net/user/${userId}`,
    });

    return url;
  } catch (error) {
    console.error("An error occurred:", error);
    throw new Error("An error occurred while processing the request.");
  }
};
