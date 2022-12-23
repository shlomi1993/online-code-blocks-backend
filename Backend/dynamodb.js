// Written by Shlomi Ben-Shushan.

const AWS = require('aws-sdk');
const config = require('./config.json');
const uuid = require('uuid');

AWS.config.update(config);

const dbClient = new AWS.DynamoDB.DocumentClient();
const table = 'CodeBlocks';

const cors = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

module.exports.getBlock = (res, id) => {
    let params = {
        TableName: table,
        Key: {
            block_id: id
        }
    };
    dbClient.get(params, (err, data) => {
        if (err) {
            res.set(cors);
            res.json({ 'message': 'server side error.', statusCode: 500, error: err })
        } else {
            res.set(cors);
            res.json(data.Item)
        }
    });
}

module.exports.getAllBlocks = (res) => {
  let params = {
    TableName: table,
  };
  dbClient.scan(params, (err, data) => {
      if (err) {
          res.set(cors);
          res.json({ 'message': 'server side error.', statusCode: 500, error: err })
      } else {
          res.set(cors);
          res.json(data.Items)
      }
  });
}

module.exports.putBlock = (res, title) => {
    let id = uuid.v1();
    let newBlock = {
        block_id: id,
        block_name: title,
        code: ''
    }
    let params = {
        TableName: table,
        Item: newBlock
    };
    dbClient.put(params, (err, data) => {
        if (err) {
            res.set(cors);
            res.json({ 'message': 'server side error.', statusCode: 500, error: err });
        } else {
            res.set(cors);
            res.json({ 'message': 'success.', statusCode: 200, block: newBlock });
        }
    });
}

module.exports.updateBlock = (res, id, name, code) => {
    let params = {
        TableName: table,
        Key: {
            block_id: id,
        },
        UpdateExpression: 'set code = :c',
        ExpressionAttributeValues: {
            ':c' : code,
        }
    };
    dbClient.update(params, (err, data) => {
        if (err) {
            res.set(cors);
            res.json({ 'message': 'server side error.', statusCode: 500, error: err });
        } else {
            res.set(cors);
            res.json({ 'message': `block "${name}" (id: ${id}) successfully updated.` , statusCode: 200 });
        }
    });
}

module.exports.deleteBlock = (res, id) => {
    let params = {
        TableName: table,
        Key: {
            block_id: id,
        },
    };
    dbClient.delete(params, (err, data) => {
        if (err) {
            res.set(cors);
            res.json({ 'message': 'server side error', statusCode: 500, error: err });
        } else {
            res.set(cors);
            res.json({ 'message': `block ${id} successfully deleted.` , statusCode: 200 });
        }
    });
}
