const { v4: uuidv4 } = require('uuid');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

// Create low-level and document clients
const dynamoClient = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(dynamoClient);

exports.handler = async (event) => {
    try {
        const data = JSON.parse(event.body);
        const taskId = uuidv4();

        const params = {
            TableName: 'Tasks',
            Item: {
                userId: data.userId,
                taskId: taskId,
                title: data.title,
                description: data.description,
                dueDate: data.dueDate,
                priority: data.priority,
                tags: data.tags || [],
                createdAt: new Date().toISOString()
            }
        };

        await docClient.send(new PutCommand(params));

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Task created', taskId }),
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to create task' }),
        };
    }
};
