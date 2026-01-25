const path = require("path");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const bucketName = process.env.S3_BUCKET;
const region = process.env.AWS_REGION;

if (!bucketName || !region) {
  console.warn(
    "Missing S3_BUCKET or AWS_REGION. Presign endpoint will fail until set."
  );
}

const s3 = new S3Client({ region });

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const filename = req.query.filename;
    const contentType = req.query.contentType || "application/octet-stream";

    if (!filename) {
      return res.status(400).json({ error: "filename is required" });
    }

    const safeName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `${Date.now()}-${safeName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 });

    return res.json({ url, key });
  } catch (error) {
    console.error("Presign error:", error);
    return res.status(500).json({ error: "Failed to create presigned URL" });
  }
};
