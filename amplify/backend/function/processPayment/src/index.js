const { CognitoIdentityServiceProvider } = require("aws-sdk");
const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
const USER_POOL_ID = "ap-south-1_rAVCVKnN3";
const stripe = require("stripe")("sk_test_51ORYlmSFkgnN12a3GzPKjq4IdbZ9qPaZth9qlA94glG1VdFVQ15SkRTQP3JK36A4cOEGsXDEuTnfd3FlXygTbXux00NEIr4DDv");

const getUserEmail = async (event) => {
  const params = {
    UserPoolId: USER_POOL_ID,
    Username: event.identity.claims.username
  };
  const user = await cognitoIdentityServiceProvider.adminGetUser(params).promise();
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
    const { id, cartInput, total, paymentIntent } = event.arguments.input;
    const { username } = event.identity.claims;
    const email = await getUserEmail(event);

    const paymentIntents = await stripe.paymentIntents.confirm(
      paymentIntent
    );

    // await stripe.charges.create({
    //   amount: total * 100,
    //   currency: "usd",
    //   source: token,
    //   description: `Order ${new Date()} by ${username} with ${email}`
    // });

    // const session = await stripe.checkout.sessions.create({
    //   line_items: cartInput.map(item => {
    //     return {
    //       price_data: {
    //         currency: "usd",
    //         product_data: {
    //           name: item.title,
    //           images: [item.image]
    //         },
    //         unit_amount: item.price * 100
    //       },
    //       quantity: item.quantity,
    //     }
    //   }),
    //   client_reference_id: email,
    //   mode: 'payment',
    //   success_url: `http://localhost:5173/`,
    //   cancel_url: `http://localhost:5173/books`,
    // });

    // console.log(session)

    return { id, cartInput, total, username, email };
  } catch (err) {
    throw new Error(err);
  }

};
