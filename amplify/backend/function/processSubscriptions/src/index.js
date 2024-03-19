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

async function createGroupIfNotExists(groupName) {
    try {
        // Check if the group already exists
        const existingGroups = await cognito.listGroups({
            UserPoolId: USER_POOL_ID
        }).promise();

        const isGroupExists = existingGroups.Groups.some(group => group.GroupName === groupName);

        if (!isGroupExists) {
            // If the group doesn't exist, create it
            await cognito.createGroup({
                GroupName: groupName,
                UserPoolId: USER_POOL_ID
            }).promise();

            console.log('Group created successfully:', groupName);
        } else {
            console.log('Group already exists:', groupName);
        }
    } catch (error) {
        console.error('Error creating group:', error);
        throw error;
    }
}

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    const { user, userId } = event.arguments.input;
    const email = await getUserEmail(event);
    console.log(email)
    try {
        // Check if the user is already a member of the group
        const groupData = await cognito.adminListGroupsForUser({
            Username: user,
            UserPoolId: USER_POOL_ID
        }).promise();

        const isAlreadyMember = groupData.Groups.some(group => group.GroupName === 'subscribed_members');

        if (isAlreadyMember) {
            console.log('User', user, 'is already a member of the "subscribed_members" group');
            return "YES";
        } else {
            if (userId) {
                // Create the group if it doesn't exist
                await createGroupIfNotExists('subscribed_members');

                // If the user is not already a member, add them to the group
                await cognito.adminAddUserToGroup({
                    UserPoolId: USER_POOL_ID,
                    Username: user,
                    GroupName: 'subscribed_members'
                }).promise();

                console.log('User added to group successfully');
                return "YES";
            } else {
                return "NO";
            }
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
