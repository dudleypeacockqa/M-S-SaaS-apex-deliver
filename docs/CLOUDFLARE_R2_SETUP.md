# Cloudflare R2 Storage Setup Guide

## Overview

Cloudflare R2 is an S3-compatible object storage service with zero egress fees. We'll use it for storing:
- Deal documents and attachments
- User uploads
- Data room files
- Financial statement PDFs
- Generated reports

---

## ✅ Credentials Added

Your R2 credentials have been added to `.env`:

### Account API Token (Administrative)
```env
R2_ACCOUNT_ACCESS_KEY_ID=c05733b67baa67c3d45e946829ece6cb
R2_ACCOUNT_SECRET_ACCESS_KEY=88e8cc08e1949e7b52b3b62680695de9f7ce640b04a6385b72557c1c68377099
```
**Use for**: Creating buckets, managing permissions, administrative tasks

### User API Token (Application) ⭐ RECOMMENDED
```env
R2_ACCESS_KEY_ID=fc23212e9240e3fdb61f90bde1c3844f
R2_SECRET_ACCESS_KEY=c0ccf727fd530d84c56f82a9433fb619f56099897b9eb73760dae9ddcd05872c
```
**Use for**: Application file uploads/downloads, day-to-day operations

### Endpoints
```env
R2_ENDPOINT_URL=https://8424f73b33106452fa180d53b6cc128b.r2.cloudflarestorage.com
R2_ENDPOINT_URL_EU=https://8424f73b33106452fa180d53b6cc128b.eu.r2.cloudflarestorage.com
```

---

## 🪣 Create Your First Bucket

### Option 1: Using Cloudflare Dashboard (Easiest)

1. Go to: https://dash.cloudflare.com
2. Navigate to **R2** → **Overview**
3. Click **Create bucket**
4. Name it: `ma-saas-documents`
5. Choose location: **Automatic** or **European Union** (for GDPR compliance)
6. Click **Create bucket**

### Option 2: Using AWS CLI (S3-compatible)

```bash
# Install AWS CLI if not already installed
# pip install awscli

# Configure AWS CLI for R2
aws configure set aws_access_key_id fc23212e9240e3fdb61f90bde1c3844f
aws configure set aws_secret_access_key c0ccf727fd530d84c56f82a9433fb619f56099897b9eb73760dae9ddcd05872c

# Create bucket
aws s3 mb s3://ma-saas-documents \
  --endpoint-url https://8424f73b33106452fa180d53b6cc128b.r2.cloudflarestorage.com

# List buckets
aws s3 ls \
  --endpoint-url https://8424f73b33106452fa180d53b6cc128b.r2.cloudflarestorage.com
```

### Option 3: Using Python (boto3)

```python
import boto3

# Create R2 client
s3_client = boto3.client(
    's3',
    endpoint_url='https://8424f73b33106452fa180d53b6cc128b.r2.cloudflarestorage.com',
    aws_access_key_id='fc23212e9240e3fdb61f90bde1c3844f',
    aws_secret_access_key='c0ccf727fd530d84c56f82a9433fb619f56099897b9eb73760dae9ddcd05872c',
    region_name='auto'
)

# Create bucket
s3_client.create_bucket(Bucket='ma-saas-documents')
print("Bucket created successfully!")
```

---

## 🔧 Integration with Your Application

### Install Required Packages

```bash
# Backend
cd backend
pip install boto3

# Add to requirements.txt
echo "boto3>=1.28.0" >> requirements.txt
```

### Create R2 Service (Python/FastAPI)

Create: `backend/app/services/r2_storage_service.py`

```python
"""
Cloudflare R2 Storage Service
Handles file uploads, downloads, and management
"""
import os
from typing import BinaryIO, Optional
import boto3
from botocore.exceptions import ClientError

class R2StorageService:
    def __init__(self):
        self.client = boto3.client(
            's3',
            endpoint_url=os.getenv('R2_ENDPOINT_URL'),
            aws_access_key_id=os.getenv('R2_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('R2_SECRET_ACCESS_KEY'),
            region_name=os.getenv('R2_REGION', 'auto')
        )
        self.bucket_name = os.getenv('R2_BUCKET_NAME', 'ma-saas-documents')

    def upload_file(
        self,
        file: BinaryIO,
        key: str,
        content_type: Optional[str] = None,
        metadata: Optional[dict] = None
    ) -> str:
        """
        Upload file to R2
        Returns: Public URL of uploaded file
        """
        extra_args = {}
        if content_type:
            extra_args['ContentType'] = content_type
        if metadata:
            extra_args['Metadata'] = metadata

        self.client.upload_fileobj(
            file,
            self.bucket_name,
            key,
            ExtraArgs=extra_args
        )

        return f"{os.getenv('R2_ENDPOINT_URL')}/{self.bucket_name}/{key}"

    def download_file(self, key: str) -> bytes:
        """Download file from R2"""
        response = self.client.get_object(Bucket=self.bucket_name, Key=key)
        return response['Body'].read()

    def delete_file(self, key: str) -> bool:
        """Delete file from R2"""
        try:
            self.client.delete_object(Bucket=self.bucket_name, Key=key)
            return True
        except ClientError:
            return False

    def generate_presigned_url(
        self,
        key: str,
        expiration: int = 3600
    ) -> str:
        """Generate presigned URL for temporary access"""
        return self.client.generate_presigned_url(
            'get_object',
            Params={'Bucket': self.bucket_name, 'Key': key},
            ExpiresIn=expiration
        )

# Singleton instance
r2_storage = R2StorageService()
```

### Example: File Upload Endpoint

Create: `backend/app/api/routes/uploads.py`

```python
from fastapi import APIRouter, UploadFile, File, Depends
from app.services.r2_storage_service import r2_storage
from app.api.dependencies.auth import get_current_user

router = APIRouter()

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user)
):
    """
    Upload a document to R2 storage
    """
    # Generate unique filename
    filename = f"deals/{current_user.organization_id}/{file.filename}"

    # Upload to R2
    url = r2_storage.upload_file(
        file.file,
        key=filename,
        content_type=file.content_type,
        metadata={
            'uploaded_by': current_user.id,
            'organization': current_user.organization_id
        }
    )

    return {
        "filename": file.filename,
        "url": url,
        "key": filename
    }
```

---

## 🔒 Security Best Practices

### 1. Bucket Permissions

Configure bucket to be **private by default**:

```bash
# In Cloudflare Dashboard:
# R2 → Buckets → ma-saas-documents → Settings
# Set: "Public Access" = Disabled
```

### 2. Use Presigned URLs for Downloads

Instead of public URLs, generate temporary presigned URLs:

```python
# Generate URL valid for 1 hour
download_url = r2_storage.generate_presigned_url(
    key="deals/123/contract.pdf",
    expiration=3600
)
```

### 3. Organize Files by Organization

Use folder structure:
```
ma-saas-documents/
├── deals/
│   ├── org-uuid-1/
│   │   ├── deal-uuid-1/
│   │   │   ├── contract.pdf
│   │   │   └── financials.xlsx
│   │   └── deal-uuid-2/
│   └── org-uuid-2/
├── users/
│   ├── user-uuid-1/
│   │   └── avatar.jpg
└── generated/
    └── reports/
        └── report-uuid-1.pdf
```

---

## 📊 Monitoring & Usage

### Check Storage Usage

```python
import boto3

s3_client = boto3.client(
    's3',
    endpoint_url=os.getenv('R2_ENDPOINT_URL'),
    aws_access_key_id=os.getenv('R2_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('R2_SECRET_ACCESS_KEY')
)

# List all objects in bucket
response = s3_client.list_objects_v2(Bucket='ma-saas-documents')

total_size = sum(obj['Size'] for obj in response.get('Contents', []))
print(f"Total storage used: {total_size / 1024 / 1024:.2f} MB")
```

### Cloudflare Dashboard Metrics

1. Go to: https://dash.cloudflare.com → R2
2. View:
   - Storage usage (GB)
   - Class A operations (writes)
   - Class B operations (reads)
   - Egress (FREE with R2! 🎉)

---

## 💰 Pricing

**Cloudflare R2 Advantages**:
- ✅ **Zero egress fees** (vs AWS S3's expensive egress)
- ✅ Cheaper storage than S3
- ✅ S3-compatible API

**Current pricing** (as of 2024):
- Storage: $0.015/GB/month
- Class A operations (writes): $4.50/million requests
- Class B operations (reads): $0.36/million requests
- Egress: **FREE** 🎉

**Example costs**:
- 100 GB storage: ~$1.50/month
- 1 million file uploads: ~$4.50
- 10 million downloads: ~$3.60
- Bandwidth: **$0** (vs $900+ on AWS S3!)

---

## 🚀 Next Steps

### 1. Create Bucket (Choose one method above)
- ✅ Dashboard (easiest)
- ✅ AWS CLI
- ✅ Python script

### 2. Update Environment Variables

If you named your bucket differently, update `.env`:
```env
R2_BUCKET_NAME=your-bucket-name
```

### 3. Test Connection

```python
# backend/test_r2_connection.py
from app.services.r2_storage_service import r2_storage

# List buckets
print(r2_storage.client.list_buckets())
```

### 4. Integrate with Document Routes

Update your document upload/download routes to use R2 instead of local storage.

### 5. Add to Render Environment Variables

In Render Dashboard → Backend Service → Environment:
```
R2_ACCESS_KEY_ID=fc23212e9240e3fdb61f90bde1c3844f
R2_SECRET_ACCESS_KEY=c0ccf727fd530d84c56f82a9433fb619f56099897b9eb73760dae9ddcd05872c
R2_ENDPOINT_URL=https://8424f73b33106452fa180d53b6cc128b.r2.cloudflarestorage.com
R2_BUCKET_NAME=ma-saas-documents
R2_REGION=auto
```

---

## 🔗 Resources

- **Cloudflare R2 Docs**: https://developers.cloudflare.com/r2/
- **S3 API Compatibility**: https://developers.cloudflare.com/r2/api/s3/
- **boto3 Documentation**: https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html
- **Pricing Calculator**: https://r2-calculator.cloudflare.com/

---

## 📝 Summary

✅ **Credentials Added** to `.env` file
⏳ **Next**: Create bucket `ma-saas-documents`
⏳ **Then**: Integrate R2 service into your application
⏳ **Finally**: Update Render environment variables

Your R2 setup is almost complete! Just create the bucket and integrate the service. 🎉
