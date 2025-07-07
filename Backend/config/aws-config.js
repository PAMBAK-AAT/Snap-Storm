

// This imports the AWS SDK for JavaScript, which allows interaction with AWS services like S3, DynamoDB, etc.
const AWS = require("aws-sdk");

// Sets the AWS region to "ap-south-1" (which is Mumbai, India). This ensures that all S3 requests go to this specific region.
AWS.config.update({ region: "ap-south-1"});

// Creates an S3 service object, which will be used to interact with S3 operations like uploading, deleting, or fetching files.
const s3 = new AWS.S3();

// Stores the name of the S3 bucket you want to use. The bucket must already exist in ap-south-1.
const S3_BUCKET = "snap-storm-bucket";



// Exports s3 (the S3 object) and S3_BUCKET (the bucket name). This allows other files in the project to import and use these settings.
module.exports = { s3, S3_BUCKET };


