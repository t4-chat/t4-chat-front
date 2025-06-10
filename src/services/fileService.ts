import { tokenService } from "~/openapi/requests/core/OpenAPI";

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
