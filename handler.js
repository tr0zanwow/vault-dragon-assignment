'use strict';
//Imports
const AWS = require('aws-sdk');

//AWS DynamoDB configurations
AWS.config.update({
    region: "ap-south-1"
});
var documentClient = new AWS.DynamoDB.DocumentClient({
    region: "ap-south-1"
});

//Get Data module - GET Param Handling
module.exports.getKey = (event, context, callback) => {
    if (event.mykey == "") {
        callback("Error : No Input specified");
    } else {

        const temp1 = {
            TableName: "vault-dragon-data",
            Key: {
                key: event.mykey
            }
        };
        documentClient.get(temp1, (err, data) => {
            if (err) {
                console.log(err)
            }
            callback(null, data);
        })
    }
};

//Set Data Module - POST Param Handling
module.exports.setKey = async (event, context, callback) => {
    const temp2 = {
        TableName: "vault-dragon-data",
        Item: {
            key: event.mykey,
            timeStamp: event.timestamp,
            value: event.value
        }
    };
    try {
        const data = await documentClient.put(temp2).promise();
        callback(null, data);
    } catch (error) {
        callback("Problem adding Data")
    }
};