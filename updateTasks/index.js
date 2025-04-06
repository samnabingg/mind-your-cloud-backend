const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    try {
        const data = JSON.parse(event.body);
        const { userID, taskID, title, description, dueDate, priority, tags } = data;

        const params = {
            TableName: 'Tasks',
            Key: { userID, taskID },
            UpdateExpression: 'SET #t = :title, description = :desc, dueDate = :due, priority = :prio, tags = :tg',
            ExpressionAttributeNames: {
                '#t': 'title'
            },
            ExpressionAttributeValues: {
                ':title': title,
                ':desc': description,
                ':due': dueDate,
                ':prio': priority,
                ':tg': tags || []
            }
        };

        await docClient.send(new UpdateCommand(params));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Task updated successfully' })
        };

    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to update task' })
        };
    }
};
