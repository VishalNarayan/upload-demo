# Upload to S3 (Presigned URL)

This is a minimal example that serves a plain HTML page and generates presigned
S3 URLs for direct browser uploads.

## Setup

1. Install dependencies:
   - `npm install`
2. Configure AWS credentials and bucket:
   - Copy `.env.example` to `.env` and fill in values, or export env vars:
     - `AWS_REGION`
     - `S3_BUCKET`
     - `AWS_ACCESS_KEY_ID`
     - `AWS_SECRET_ACCESS_KEY`
     - `AWS_SESSION_TOKEN` (optional)
3. Run the server:
   - `npm start`
4. Open `http://localhost:3000/upload-demo` and upload a file.

## Deploy to Vercel (step by step)

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. Create a new Vercel project and import the repo.
3. In Vercel project settings, add environment variables:
   - `AWS_REGION`
   - `S3_BUCKET`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_SESSION_TOKEN` (optional)
4. Deploy the project.
5. Update your S3 bucket CORS `AllowedOrigins` to include:
   - Your Vercel domain, e.g. `https://your-project.vercel.app`
6. Open `https://your-domain.com/upload-demo` and upload a file.

## S3 CORS

Your bucket must allow browser PUT uploads. Example CORS config:

```
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedOrigins": ["http://localhost:3000"],
    "ExposeHeaders": []
  }
]
```
