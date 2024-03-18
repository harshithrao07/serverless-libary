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
    const { cartInput, userId } = event.arguments.input;
    const { username } = event.identity.claims;
    const email = await getUserEmail(event);


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
      }
    });

    console.log(cartInput)
    
    const { url } = await stripe.checkout.sessions.create({
      line_items: cartInput.map(item => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.title,
              images: [item.image]
            },
            unit_amount: item.price * 100
          },
          quantity: item.quantity,
        }
      }),
      client_reference_id: userId,
      customer: customer.id,
      mode: 'payment',
      success_url: `http://localhost:5173/success/${userId}`,
      cancel_url: `http://localhost:5173/user/${userId}`,
    });

    return url;
  } catch (err) {
    throw new Error(err);
  }

};
