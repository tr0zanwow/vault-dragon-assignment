'use strict';

const AWS = require('aws-sdk');

AWS.config.update({region: "ap-south-1"});

module.exports.getKey = (event, context,  callback) => {
if(event.mykey === "")
{
callback("Error : No Input specified");
}
else{
var documentClient = new AWS.DynamoDB.DocumentClient({region : "ap-south-1"});

const temp1 = {
  TableName: "vault-dragon-data",
  Key: {
    key: event.mykey
  }
};

  documentClient.get(temp1,(err,data) =>{
    if(err){
      console.log(err)
    }
    callback(null,data);
  })
}
};

module.exports.setKey = (event, context,  callback) => {
  if(event.mykey === "")
  {
  callback("Error : No Input specified");
  }
  else{
  var documentClient = new AWS.DynamoDB.DocumentClient({region : "ap-south-1"});
  
  const temp1 = {
    TableName: "vault-dragon-data",
    Key: {
      key: event.mykey
    }
  };
  
    documentClient.get(temp1,(err,data) =>{
      if(err){
        console.log(err)
      }
      callback(null,data);
    })
  }
  };