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

    //Check if only mkey is provided to fetch the latest version of data
    if (event.mykey && !event.timestamp) {
      const params = {
        TableName: "vd-data-vault",
        ScanIndexForward: false,
        Limit: 1,
        KeyConditionExpression: "#key = :mykey",
        ExpressionAttributeNames:{
            "#key": "key"
        },
        ExpressionAttributeValues: {
            ":mykey": event.mykey
        }
    };
    documentClient.query(params, (err, data) => {
        if (err) {
            console.log(err)
        }
        callback(null, data.Items);
    })
    }

    //Check if both mykey and timestamp is provided &
    //Return the exact result if found with time stamp or return result one version lower than the specified timestamp
    else if (event.mykey && event.timestamp) {

      const params = {
          TableName: "vd-data-vault",
          ScanIndexForward: false,
          Limit: 1,
          KeyConditionExpression: "#key = :mykey AND #timestamp <= :timestamp",
          ExpressionAttributeNames:{
              "#key": "key",
              "#timestamp": "timestamp"
          },
          ExpressionAttributeValues: {
              ":mykey": event.mykey,
              ":timestamp": event.timestamp
          }
      };
      documentClient.query(params, (err, data) => {
          if (err) {
              console.log(err)
          }
          callback(null, data.Items);
      })
  }

   //Check if only mykey is provided to fetch latest value
   else {
    callback("Error : No Proper Input specified");
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