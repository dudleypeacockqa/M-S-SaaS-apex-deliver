/**
 * useUploadProgress Hook - Real-time file upload progress tracking
 *
 * Uses XMLHttpRequest for progress monitoring (Phase 2.2 - DEV-016)
 *
 * Features:
 * - Real-time progress percentage
 * - Upload speed calculation (bytes/sec)
 * - Estimated time remaining
 * - Upload cancellation
 * - Error handling
 *
 * @example
 * const { upload, progress, isUploading, cancel } = useUploadProgress();
 *
 * const handleUpload = () => {
 *   upload(file, '/api/upload', headers, onSuccess, onError);
 * };
 */

import { useState, useRef, useCallback } from 'react';

interface UploadProgress {
  progress: number;
  isUploading: boolean;
  error: string | null;
  uploadSpeed: number | null; // bytes per second
  estimatedTimeRemaining: number | null; // seconds
}

interface UseUploadProgressReturn extends UploadProgress {
  upload: (
    file: File,
    url: string,
    headers: Record<string, string>,
    onSuccess?: (response: any) => void,
    onError?: (error: Error) => void
  ) => void;
  cancel: () => void;
  reset: () => void;
}

export const useUploadProgress = (): UseUploadProgressReturn => {
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null);

  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const lastLoadedRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const reset = useCallback(() => {
    setProgress(0);
    setIsUploading(false);
    setError(null);
    setUploadSpeed(null);
    setEstimatedTimeRemaining(null);
    lastLoadedRef.current = 0;
    lastTimeRef.current = 0;
  }, []);

  const cancel = useCallback(() => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      setIsUploading(false);
    }
  }, []);

  const upload = useCallback(
    (
      file: File,
      url: string,
      headers: Record<string, string>,
      onSuccess?: (response: any) => void,
      onError?: (error: Error) => void
    ) => {
      // Reset state for new upload
      reset();
      setIsUploading(true);

      // Create new XMLHttpRequest
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;

      // Configure upload progress tracking
      xhr.upload.addEventListener('progress', (event: ProgressEvent) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);

          // Calculate upload speed
          const currentTime = Date.now();
          if (lastTimeRef.current > 0) {
            const timeDiff = (currentTime - lastTimeRef.current) / 1000; // seconds
            const bytesDiff = event.loaded - lastLoadedRef.current;

            if (timeDiff > 0) {
              const speed = bytesDiff / timeDiff; // bytes per second
              setUploadSpeed(speed);

              // Calculate estimated time remaining
              const bytesRemaining = event.total - event.loaded;
              const timeRemaining = bytesRemaining / speed; // seconds
              setEstimatedTimeRemaining(timeRemaining);
            }
          }

          lastLoadedRef.current = event.loaded;
          lastTimeRef.current = currentTime;
        }
      });

      // Handle successful upload
      xhr.addEventListener('load', () => {
        setIsUploading(false);

        if (xhr.status >= 200 && xhr.status < 300) {
          setProgress(100);
          try {
            const response = JSON.parse(xhr.responseText);
            if (onSuccess) {
              onSuccess(response);
            }
          } catch (err) {
            const parseError = new Error('Failed to parse server response');
            setError(parseError.message);
            if (onError) {
              onError(parseError);
            }
          }
        } else {
          // HTTP error response
          const httpError = new Error(`Upload failed with status ${xhr.status}`);
          setError(httpError.message);
          if (onError) {
            onError(httpError);
          }
        }
      });

      // Handle network errors
      xhr.addEventListener('error', () => {
        setIsUploading(false);
        const networkError = new Error('Network error occurred during upload');
        setError(networkError.message);
        if (onError) {
          onError(networkError);
        }
      });

      // Handle upload abort
      xhr.addEventListener('abort', () => {
        setIsUploading(false);
        setError('Upload cancelled');
      });

      // Prepare and send request
      xhr.open('POST', url, true);

      // Set headers
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      // Create FormData and send
      const formData = new FormData();
      formData.append('file', file);
      xhr.send(formData);
    },
    [reset]
  );

  return {
    progress,
    isUploading,
    error,
    uploadSpeed,
    estimatedTimeRemaining,
    upload,
    cancel,
    reset,
  };
};
