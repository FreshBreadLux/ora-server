const router = require('express').Router()
const aws = require('aws-sdk')
aws.config.region = 'us-east-2'
const s3 = new aws.S3()

module.exports = router

router.get('/', (req, res, next) => {
  const { fileName, fileType } = req.query
  const s3Params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  }
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err)
      next(err)
    }
    const returnData = {
      signedS3Request: data,
      targetUrl: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${fileName}`
    }
    return res.send(returnData)
  })
})
