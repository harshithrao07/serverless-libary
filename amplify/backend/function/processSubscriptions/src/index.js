const stripe = require("stripe")("sk_test_51ORYlmSFkgnN12a3GzPKjq4IdbZ9qPaZth9qlA94glG1VdFVQ15SkRTQP3JK36A4cOEGsXDEuTnfd3FlXygTbXux00NEIr4DDv");
const { CognitoIdentityServiceProvider } = require("aws-sdk");
const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
const USER_POOL_ID = "ap-south-1_rAVCVKnN3";

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

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    try {
        const { lookup_key, userId } = event.arguments.input;
        const email = await getUserEmail(event);

        const prices = await stripe.prices.list({
            lookup_keys: [lookup_key],
            expand: ['data.product'],
        });

        const { url, id } = await stripe.checkout.sessions.create({
            billing_address_collection: 'auto',
            customer_email: email,
            line_items: [
                {
                    price: prices.data[0].id,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `http://localhost:5173/subscription-success/${userId}`,
            cancel_url: `http://localhost:5173/user/${userId}`,
        });


        return { url, id };
    } catch (error) {
        throw new Error(error);
    }
};
