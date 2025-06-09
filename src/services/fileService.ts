import { api } from "./api";
import { tokenService } from "./tokenService";

export interface FileUploadResponse {
  file_id: string;
  filename: string;
  content_type: string;
  size: number;
}

export interface FileInfo {
  filename: string;
  contentType: string;
  blob: Blob;
}

export class FileService {
  private getAuthHeaders(): HeadersInit {
    return {
      Authorization: `Bearer ${tokenService.getToken()}`,
    };
  }

  async uploadFile(file: File): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/api/files/upload`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    return await response.json();
  }

  async getFile(fileId: string): Promise<FileInfo> {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/api/files/${fileId}`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch file with status: ${response.status}`);
    }

    const blob = await response.blob();
    const contentType = blob.type || "application/octet-stream";

    // Extract filename from Content-Disposition header if available
    let filename = `file-${fileId}`;
    const contentDisposition = response.headers.get("Content-Disposition");
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch?.[1]) {
        filename = filenameMatch[1];
      } else {
        const filenameMatch = contentDisposition.match(/filename=([^;]+)/);
        if (filenameMatch?.[1]) {
          filename = filenameMatch[1].trim();
        }
      }
    }

    return {
      filename,
      contentType,
      blob,
    };
  }

  getFileUrl(fileId: string): string {
    // Note: This doesn't include auth headers, so it's not secure for direct use
    return `${import.meta.env.VITE_REACT_APP_API_URL}/api/files/${fileId}`;
  }

  // Function to get a secure URL for an image with auth token
  async getImagePreviewUrl(fileId: string): Promise<string> {
    try {
      const { blob } = await this.getFile(fileId);
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Failed to get image preview:", error);
      throw error;
    }
  }

  // Function to check if a file is an image based on its filename or content type
  isImageFile(filename: string, contentType?: string): boolean {
    if (contentType?.startsWith("image/")) {
      return true;
    }

    const extension = filename.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
      extension || "",
    );
  }

  // Function to download a file and trigger a download dialog
  async downloadFile(fileId: string): Promise<void> {
    try {
      const { blob, filename } = await this.getFile(fileId);

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download file:", error);
      throw error;
    }
  }
}

export const fileService = new FileService();
