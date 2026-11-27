import { NextRequest, NextResponse } from "next/server";
import { getGoogleAccessToken } from "@/lib/googleDrive";

interface GetUploadUrlBody {
  fileName?: string;
  mimeType?: string;
}

const ALLOWED_MIME_PREFIXES = ["image/", "video/"];

function sanitizeFileName(rawName: string): string {
  // Remove path traversal characters and control characters, keep Unicode names intact
  const cleaned = rawName
    .replace(/[/\\?%*:|"<>]/g, "_")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim();

  if (!cleaned) {
    return `wedding-upload-${Date.now()}`;
  }

  return cleaned.slice(0, 200);
}

export async function POST(req: NextRequest) {
  try {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID?.trim();
    if (!folderId) {
      return NextResponse.json(
        { error: "GOOGLE_DRIVE_FOLDER_ID is not configured." },
        { status: 500 }
      );
    }

    let body: GetUploadUrlBody;
    try {
      body = (await req.json()) as GetUploadUrlBody;
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const rawFileName = typeof body.fileName === "string" ? body.fileName.trim() : "";
    const rawMimeType = typeof body.mimeType === "string" ? body.mimeType.trim() : "";

    if (!rawFileName) {
      return NextResponse.json(
        { error: "fileName is required." },
        { status: 400 }
      );
    }

    const mimeType = rawMimeType || "application/octet-stream";
    const isAllowedMime =
      ALLOWED_MIME_PREFIXES.some((prefix) => mimeType.toLowerCase().startsWith(prefix)) ||
      mimeType === "application/octet-stream";

    if (!isAllowedMime) {
      return NextResponse.json(
        { error: "Only image and video uploads are supported." },
        { status: 400 }
      );
    }

    const safeFileName = sanitizeFileName(rawFileName);
    const accessToken = await getGoogleAccessToken();

    // Forward the browser's Origin header so Google Drive attaches matching
    // CORS headers to the resumable upload session URL for direct PUT uploads.
    const requestOrigin = req.headers.get("origin") || req.nextUrl.origin;

    const driveHeaders: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
      "X-Upload-Content-Type": mimeType,
    };

    if (requestOrigin) {
      driveHeaders.Origin = requestOrigin;
    }

    const driveResponse = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true",
      {
        method: "POST",
        headers: driveHeaders,
        body: JSON.stringify({
          name: safeFileName,
          mimeType,
          parents: [folderId],
        }),
        cache: "no-store",
      }
    );

    if (!driveResponse.ok) {
      const errorText = await driveResponse.text().catch(() => "");
      console.error("Google Drive resumable upload init error:", driveResponse.status, errorText);
      return NextResponse.json(
        { error: "Could not initialize upload with Google Drive. Please try again." },
        { status: 502 }
      );
    }

    const uploadUrl = driveResponse.headers.get("location");
    if (!uploadUrl) {
      console.error("Google Drive resumable upload response missing Location header.");
      return NextResponse.json(
        { error: "Upload URL was not returned by Google Drive." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { uploadUrl },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("/api/get-upload-url error:", error);
    return NextResponse.json(
      { error: "Unable to prepare upload right now. Please try again." },
      { status: 500 }
    );
  }
}
