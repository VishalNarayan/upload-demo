require("dotenv").config();
const path = require("path");
const express = require("express");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const app = express();
const port = process.env.PORT || 3000;

const bucketName = process.env.S3_BUCKET;
const region = process.env.AWS_REGION;

if (!bucketName || !region) {
  console.warn(
    "Missing S3_BUCKET or AWS_REGION. Presign endpoint will fail until set."
  );
}

const s3 = new S3Client({ region });

async function handlePresign(req, res) {
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
}

app.get("/presign", handlePresign);
app.get("/api/presign", handlePresign);

app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
