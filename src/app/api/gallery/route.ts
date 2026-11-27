import { NextRequest, NextResponse } from "next/server";
import { getGoogleAccessToken } from "@/lib/googleDrive";

export interface GalleryFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  createdTime?: string;
}

interface DriveListResponse {
  files?: GalleryFile[];
  error?: {
    message?: string;
  };
}

// Light server-side cache (60s) to keep gallery responses fast while reflecting
// newly approved photos promptly.
const GALLERY_CACHE_TTL_MS = 60_000;
let galleryCache: { files: GalleryFile[]; expiresAt: number } | null = null;

export async function GET(req: NextRequest) {
  // Read searchParams outside try/catch so Next.js 16 Cache Components
  // cleanly marks this GET route dynamic without catching NEXT_PRERENDER_INTERRUPTED.
  const bypassCache = req.nextUrl.searchParams.get("refresh") === "1";

  try {
    const folderId = process.env.GOOGLE_PUBLIC_ALBUM_FOLDER_ID?.trim();
    if (!folderId) {
      return NextResponse.json(
        { error: "GOOGLE_PUBLIC_ALBUM_FOLDER_ID is not configured.", files: [] },
        { status: 500 }
      );
    }

    const now = Date.now();

    if (!bypassCache && galleryCache && galleryCache.expiresAt > now) {
      return NextResponse.json(
        { files: galleryCache.files },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          },
        }
      );
    }

    const accessToken = await getGoogleAccessToken();

    // Escape single quotes in folderId defensively
    const safeFolderId = folderId.replace(/'/g, "\\'");
    const query = `'${safeFolderId}' in parents and trashed = false and (mimeType contains 'image/' or mimeType contains 'video/')`;

    const params = new URLSearchParams({
      q: query,
      fields: "files(id,name,mimeType,thumbnailLink,createdTime)",
      orderBy: "createdTime desc",
      pageSize: "100",
      supportsAllDrives: "true",
      includeItemsFromAllDrives: "true",
    });

    const driveResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    const data = (await driveResponse.json().catch(() => ({}))) as DriveListResponse;

    if (!driveResponse.ok) {
      console.error("Google Drive gallery list error:", driveResponse.status, data.error?.message);
      return NextResponse.json(
        { error: "Failed to load gallery from Google Drive.", files: [] },
        { status: 502 }
      );
    }

    const files: GalleryFile[] = Array.isArray(data.files)
      ? data.files.map((file) => ({
          id: file.id,
          name: file.name,
          mimeType: file.mimeType,
          thumbnailLink: file.thumbnailLink,
          createdTime: file.createdTime,
        }))
      : [];

    galleryCache = {
      files,
      expiresAt: now + GALLERY_CACHE_TTL_MS,
    };

    return NextResponse.json(
      { files },
      {
        status: 200,
        headers: {
          "Cache-Control": bypassCache
            ? "no-store"
            : "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("/api/gallery error:", error);
    return NextResponse.json(
      { error: "Unable to load wedding gallery right now.", files: [] },
      { status: 500 }
    );
  }
}
