"""S3/R2-compatible storage service for production file management."""
import hashlib
import logging
import uuid
from typing import BinaryIO, Optional

import boto3
from botocore.config import Config
from botocore.exceptions import ClientError

from app.core.config import get_settings

logger = logging.getLogger(__name__)


class S3StorageService:
    """
    S3-compatible storage service for Cloudflare R2 or AWS S3.
    Implements same interface as StorageService for easy switching.
    """

    def __init__(self):
        """Initialize S3/R2 client with configuration from settings."""
        settings = get_settings()

        # Get S3/R2 configuration from environment
        self.endpoint_url = getattr(settings, 'R2_ENDPOINT_URL', None)
        self.access_key_id = getattr(settings, 'R2_ACCESS_KEY_ID', None)
        self.secret_access_key = getattr(settings, 'R2_SECRET_ACCESS_KEY', None)
        self.bucket_name = getattr(settings, 'R2_BUCKET_NAME', 'ma-saas-documents')
        self.region = getattr(settings, 'R2_REGION', 'auto')

        if not all([self.endpoint_url, self.access_key_id, self.secret_access_key]):
            raise ValueError(
                "S3/R2 storage requires R2_ENDPOINT_URL, R2_ACCESS_KEY_ID, "
                "and R2_SECRET_ACCESS_KEY to be configured"
            )

        # Initialize boto3 client with S3v4 signature
        self.client = boto3.client(
            's3',
            endpoint_url=self.endpoint_url,
            aws_access_key_id=self.access_key_id,
            aws_secret_access_key=self.secret_access_key,
            region_name=self.region,
            config=Config(
                signature_version='s3v4',
                s3={'addressing_style': 'path'}  # Required for R2
            )
        )

        logger.info(f"S3StorageService initialized with bucket: {self.bucket_name}")

    def generate_file_key(
        self,
        organization_id: str,
        deal_id: str,
        filename: str,
        user_id: str
    ) -> str:
        """
        Generate unique, encrypted storage key for file.

        Args:
            organization_id: Organization UUID
            deal_id: Deal UUID
            filename: Original filename
            user_id: Uploader UUID

        Returns:
            SHA256 hash-based storage key
        """
        unique_string = f"{organization_id}/{deal_id}/{filename}/{user_id}/{uuid.uuid4()}"
        return hashlib.sha256(unique_string.encode()).hexdigest()

    def _get_s3_key(self, organization_id: str, file_key: str) -> str:
        """
        Generate S3 object key with organization isolation.

        Args:
            organization_id: Organization UUID
            file_key: File storage key

        Returns:
            S3 object key (e.g., "org-uuid/file-key")
        """
        return f"{organization_id}/{file_key}"

    async def save_file(
        self,
        file_key: str,
        file_stream: BinaryIO,
        organization_id: str
    ) -> str:
        """
        Upload file to S3/R2 storage.

        Args:
            file_key: Unique storage key
            file_stream: File binary stream
            organization_id: Organization UUID

        Returns:
            S3 URI as string (s3://bucket/org-id/file-key)

        Raises:
            IOError: If upload fails
        """
        s3_key = self._get_s3_key(organization_id, file_key)

        try:
            # Upload file to S3/R2
            self.client.upload_fileobj(
                file_stream,
                self.bucket_name,
                s3_key,
                ExtraArgs={
                    'ContentType': self._guess_content_type(file_key),
                    'Metadata': {
                        'organization_id': organization_id,
                        'file_key': file_key
                    }
                }
            )

            logger.info(f"File uploaded successfully: s3://{self.bucket_name}/{s3_key}")
            return f"s3://{self.bucket_name}/{s3_key}"

        except ClientError as e:
            error_code = e.response['Error']['Code']
            error_msg = e.response['Error']['Message']
            logger.error(f"S3 upload failed ({error_code}): {error_msg}")
            raise IOError(f"Failed to upload file to S3: {error_msg}")
        except Exception as e:
            logger.error(f"Unexpected error during S3 upload: {str(e)}")
            raise IOError(f"Failed to save file {file_key}: {str(e)}")

    async def get_file_path(
        self,
        file_key: str,
        organization_id: str
    ) -> str:
        """
        Get presigned URL for file access.

        Note: Unlike local storage, returns presigned URL instead of Path.

        Args:
            file_key: Storage key
            organization_id: Organization UUID

        Returns:
            Presigned URL for temporary access

        Raises:
            FileNotFoundError: If file doesn't exist
        """
        s3_key = self._get_s3_key(organization_id, file_key)

        try:
            # Check if file exists
            self.client.head_object(Bucket=self.bucket_name, Key=s3_key)

            # Generate presigned URL (valid for 1 hour)
            url = self.client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': s3_key
                },
                ExpiresIn=3600  # 1 hour
            )

            return url

        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                raise FileNotFoundError(f"File not found in S3: {file_key}")
            raise

    async def get_presigned_url(
        self,
        file_key: str,
        organization_id: str,
        expiration: int = 3600
    ) -> str:
        """
        Generate presigned URL for temporary file access.

        Args:
            file_key: Storage key
            organization_id: Organization UUID
            expiration: URL expiration time in seconds (default: 1 hour)

        Returns:
            Presigned URL string

        Raises:
            FileNotFoundError: If file doesn't exist
        """
        s3_key = self._get_s3_key(organization_id, file_key)

        try:
            # Verify file exists first
            self.client.head_object(Bucket=self.bucket_name, Key=s3_key)

            # Generate presigned URL
            url = self.client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': s3_key
                },
                ExpiresIn=expiration
            )

            logger.info(f"Generated presigned URL for {s3_key} (expires in {expiration}s)")
            return url

        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                raise FileNotFoundError(f"File not found in S3: {file_key}")
            raise

    async def delete_file(
        self,
        file_key: str,
        organization_id: str
    ) -> bool:
        """
        Delete file from S3/R2 storage.

        Args:
            file_key: Storage key
            organization_id: Organization UUID

        Returns:
            True if deleted, False if file didn't exist
        """
        s3_key = self._get_s3_key(organization_id, file_key)

        try:
            # Check if file exists first
            self.client.head_object(Bucket=self.bucket_name, Key=s3_key)

            # Delete the object
            self.client.delete_object(Bucket=self.bucket_name, Key=s3_key)

            logger.info(f"File deleted from S3: {s3_key}")
            return True

        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                logger.warning(f"File not found for deletion: {s3_key}")
                return False
            raise

    async def file_exists(
        self,
        file_key: str,
        organization_id: str
    ) -> bool:
        """
        Check if file exists in S3/R2 storage.

        Args:
            file_key: Storage key
            organization_id: Organization UUID

        Returns:
            True if file exists, False otherwise
        """
        s3_key = self._get_s3_key(organization_id, file_key)

        try:
            self.client.head_object(Bucket=self.bucket_name, Key=s3_key)
            return True
        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                return False
            raise

    def get_file_size(
        self,
        file_key: str,
        organization_id: str
    ) -> int:
        """
        Get file size in bytes from S3/R2.

        Args:
            file_key: Storage key
            organization_id: Organization UUID

        Returns:
            File size in bytes

        Raises:
            FileNotFoundError: If file doesn't exist
        """
        s3_key = self._get_s3_key(organization_id, file_key)

        try:
            response = self.client.head_object(Bucket=self.bucket_name, Key=s3_key)
            return response['ContentLength']
        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                raise FileNotFoundError(f"File not found in S3: {file_key}")
            raise

    def _guess_content_type(self, file_key: str) -> str:
        """
        Guess content type from file extension.

        Args:
            file_key: File storage key

        Returns:
            MIME type string
        """
        import mimetypes
        content_type, _ = mimetypes.guess_type(file_key)
        return content_type or 'application/octet-stream'
