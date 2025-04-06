const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    try {
        const userID = event.queryStringParameters && event.queryStringParameters.userID;

        if (!userID) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing userID in query parameters' }),
            };
        }

        const params = {
            TableName: 'Tasks',
            KeyConditionExpression: 'userID = :uid',
            ExpressionAttributeValues: {
                ':uid': userID
            }
        };

        const data = await docClient.send(new QueryCommand(params));

        return {
            statusCode: 200,
            body: JSON.stringify(data.Items)
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch tasks' }),
        };
    }
};
