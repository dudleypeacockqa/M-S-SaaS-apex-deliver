/**
 * TDD RED Phase: Tests for useUploadProgress hook (DEV-016 Phase 2.2)
 *
 * Tests real-time upload progress tracking using XMLHttpRequest
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useUploadProgress } from './useUploadProgress';

describe('useUploadProgress', () => {
  let mockXHR: any;
  let xhrInstance: any;

  beforeEach(() => {
    // Mock XMLHttpRequest
    xhrInstance = {
      open: vi.fn(),
      send: vi.fn(),
      setRequestHeader: vi.fn(),
      upload: {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      abort: vi.fn(),
      status: 0,
      responseText: '',
    };

    // Create constructor function for XMLHttpRequest mock
    mockXHR = vi.fn(function(this: any) {
      return xhrInstance;
    });
    global.XMLHttpRequest = mockXHR as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useUploadProgress());

      expect(result.current.progress).toBe(0);
      expect(result.current.isUploading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.uploadSpeed).toBeNull();
      expect(result.current.estimatedTimeRemaining).toBeNull();
    });
  });

  describe('File Upload', () => {
    it('should start upload and update progress', async () => {
      const { result } = renderHook(() => useUploadProgress());
      const mockFile = new File(['test content'], 'test.mp4', { type: 'video/mp4' });
      const mockUrl = '/api/podcasts/episodes/ep-123/upload-video';
      const mockHeaders = { 'Authorization': 'Bearer token' };

      act(() => {
        result.current.upload(mockFile, mockUrl, mockHeaders);
      });

      expect(result.current.isUploading).toBe(true);
      expect(xhrInstance.open).toHaveBeenCalledWith('POST', mockUrl, true);
      expect(xhrInstance.setRequestHeader).toHaveBeenCalledWith('Authorization', 'Bearer token');
    });

    it('should update progress during upload', async () => {
      const { result } = renderHook(() => useUploadProgress());
      const mockFile = new File(['test content'], 'test.mp4', { type: 'video/mp4' });

      act(() => {
        result.current.upload(mockFile, '/api/upload', {});
      });

      // Simulate progress event
      const progressCallback = xhrInstance.upload.addEventListener.mock.calls.find(
        (call: any[]) => call[0] === 'progress'
      )[1];

      act(() => {
        progressCallback({ loaded: 50, total: 100, lengthComputable: true });
      });

      await waitFor(() => {
        expect(result.current.progress).toBe(50);
      });
    });

    it('should calculate upload speed', async () => {
      const { result } = renderHook(() => useUploadProgress());
      const mockFile = new File(['test content'], 'test.mp4', { type: 'video/mp4' });

      act(() => {
        result.current.upload(mockFile, '/api/upload', {});
      });

      const progressCallback = xhrInstance.upload.addEventListener.mock.calls.find(
        (call: any[]) => call[0] === 'progress'
      )[1];

      // First progress event
      act(() => {
        progressCallback({ loaded: 1000000, total: 10000000, lengthComputable: true });
      });

      // Second progress event after 1 second (using Date.now mock)
      const originalDateNow = Date.now;
      Date.now = vi.fn(() => originalDateNow() + 1000);

      act(() => {
        progressCallback({ loaded: 2000000, total: 10000000, lengthComputable: true });
      });

      await waitFor(() => {
        expect(result.current.uploadSpeed).toBeGreaterThan(0);
      });

      Date.now = originalDateNow;
    });

    it('should estimate time remaining', async () => {
      const { result } = renderHook(() => useUploadProgress());
      const mockFile = new File(['test content'], 'test.mp4', { type: 'video/mp4' });

      act(() => {
        result.current.upload(mockFile, '/api/upload', {});
      });

      const progressCallback = xhrInstance.upload.addEventListener.mock.calls.find(
        (call: any[]) => call[0] === 'progress'
      )[1];

      // First progress event
      act(() => {
        progressCallback({ loaded: 2000000, total: 10000000, lengthComputable: true });
      });

      // Second progress event with time passed
      const originalDateNow = Date.now;
      Date.now = vi.fn(() => originalDateNow() + 1000);

      act(() => {
        progressCallback({ loaded: 4000000, total: 10000000, lengthComputable: true });
      });

      await waitFor(() => {
        expect(result.current.estimatedTimeRemaining).toBeGreaterThan(0);
      });

      Date.now = originalDateNow;
    });

    it('should handle successful upload', async () => {
      const { result } = renderHook(() => useUploadProgress());
      const mockFile = new File(['test content'], 'test.mp4', { type: 'video/mp4' });
      const onSuccess = vi.fn();

      act(() => {
        result.current.upload(mockFile, '/api/upload', {}, onSuccess);
      });

      // Simulate successful response
      const loadCallback = xhrInstance.addEventListener.mock.calls.find(
        (call: any[]) => call[0] === 'load'
      )[1];

      xhrInstance.status = 200;
      xhrInstance.responseText = JSON.stringify({ url: '/storage/video.mp4' });

      act(() => {
        loadCallback();
      });

      expect(result.current.isUploading).toBe(false);
      expect(result.current.progress).toBe(100);
      expect(onSuccess).toHaveBeenCalledWith({ url: '/storage/video.mp4' });
    });

    it('should handle upload errors', async () => {
      const { result } = renderHook(() => useUploadProgress());
      const mockFile = new File(['test content'], 'test.mp4', { type: 'video/mp4' });
      const onError = vi.fn();

      act(() => {
        result.current.upload(mockFile, '/api/upload', {}, undefined, onError);
      });

      // Simulate error
      const errorCallback = xhrInstance.addEventListener.mock.calls.find(
        (call: any[]) => call[0] === 'error'
      )[1];

      act(() => {
        errorCallback();
      });

      expect(result.current.isUploading).toBe(false);
      expect(result.current.error).toBeTruthy();
      expect(onError).toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      const { result } = renderHook(() => useUploadProgress());
      const mockFile = new File(['test content'], 'test.mp4', { type: 'video/mp4' });

      act(() => {
        result.current.upload(mockFile, '/api/upload', {});
      });

      const errorCallback = xhrInstance.addEventListener.mock.calls.find(
        (call: any[]) => call[0] === 'error'
      )[1];

      act(() => {
        errorCallback();
      });

      expect(result.current.error).toContain('Network error');
    });

    it('should handle HTTP error responses', async () => {
      const { result } = renderHook(() => useUploadProgress());
      const mockFile = new File(['test content'], 'test.mp4', { type: 'video/mp4' });

      act(() => {
        result.current.upload(mockFile, '/api/upload', {});
      });

      const loadCallback = xhrInstance.addEventListener.mock.calls.find(
        (call: any[]) => call[0] === 'load'
      )[1];

      xhrInstance.status = 500;
      xhrInstance.responseText = JSON.stringify({ error: 'Server error' });

      act(() => {
        loadCallback();
      });

      expect(result.current.error).toBeTruthy();
    });
  });

  describe('Upload Cancellation', () => {
    it('should cancel ongoing upload', async () => {
      const { result } = renderHook(() => useUploadProgress());
      const mockFile = new File(['test content'], 'test.mp4', { type: 'video/mp4' });

      act(() => {
        result.current.upload(mockFile, '/api/upload', {});
      });

      expect(result.current.isUploading).toBe(true);

      act(() => {
        result.current.cancel();
      });

      expect(xhrInstance.abort).toHaveBeenCalled();
      expect(result.current.isUploading).toBe(false);
    });

    it('should handle cancel when no upload in progress', () => {
      const { result } = renderHook(() => useUploadProgress());

      expect(() => {
        act(() => {
          result.current.cancel();
        });
      }).not.toThrow();
    });
  });

  describe('State Reset', () => {
    it('should reset state after upload', async () => {
      const { result } = renderHook(() => useUploadProgress());
      const mockFile = new File(['test content'], 'test.mp4', { type: 'video/mp4' });

      act(() => {
        result.current.upload(mockFile, '/api/upload', {});
      });

      const progressCallback = xhrInstance.upload.addEventListener.mock.calls.find(
        (call: any[]) => call[0] === 'progress'
      )[1];

      act(() => {
        progressCallback({ loaded: 50, total: 100, lengthComputable: true });
      });

      await waitFor(() => {
        expect(result.current.progress).toBe(50);
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.progress).toBe(0);
      expect(result.current.isUploading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.uploadSpeed).toBeNull();
      expect(result.current.estimatedTimeRemaining).toBeNull();
    });
  });

  describe('Multiple Files', () => {
    it('should handle multiple sequential uploads', async () => {
      const { result } = renderHook(() => useUploadProgress());
      const mockFile1 = new File(['content1'], 'test1.mp4', { type: 'video/mp4' });
      const mockFile2 = new File(['content2'], 'test2.mp4', { type: 'video/mp4' });

      // First upload
      act(() => {
        result.current.upload(mockFile1, '/api/upload', {});
      });

      const loadCallback1 = xhrInstance.addEventListener.mock.calls.find(
        (call: any[]) => call[0] === 'load'
      )[1];

      xhrInstance.status = 200;
      xhrInstance.responseText = JSON.stringify({ url: '/storage/video1.mp4' });

      act(() => {
        loadCallback1();
      });

      expect(result.current.isUploading).toBe(false);

      // Second upload
      act(() => {
        result.current.upload(mockFile2, '/api/upload', {});
      });

      expect(result.current.isUploading).toBe(true);
      expect(result.current.progress).toBe(0);
    });
  });
});
