const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    try {
        const data = JSON.parse(event.body);
        const { userID, taskID } = data;

        if (!userID || !taskID) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'userID and taskID are required' })
            };
        }

        const params = {
            TableName: 'Tasks',
            Key: { userID, taskID }
        };

        await docClient.send(new DeleteCommand(params));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Task deleted successfully' })
        };

    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to delete task' })
        };
    }
};
