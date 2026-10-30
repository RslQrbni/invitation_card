import { NextRequest, NextResponse } from "next/server";

export interface RsvpRequestBody {
  name?: string;
  attending?: string;
  guests?: number | string;
  message?: string;
}

export async function POST(req: NextRequest) {
  try {
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();

    if (
      !webhookUrl ||
      webhookUrl === "PASTE_GOOGLE_SCRIPT_WEB_APP_URL_HERE" ||
      webhookUrl.includes("PASTE_GOOGLE_SCRIPT_WEB_APP_URL_HERE")
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "GOOGLE_SHEETS_WEBHOOK_URL is not configured. Please set a valid Google Apps Script Web App URL in your .env.local file.",
        },
        { status: 500 }
      );
    }

    let body: RsvpRequestBody;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const { name, attending, guests, message } = body;

    // 1. Validate Name
    const trimmedName = typeof name === "string" ? name.trim() : "";
    if (!trimmedName) {
      return NextResponse.json(
        { success: false, error: "Name is required." },
        { status: 400 }
      );
    }
    if (trimmedName.length > 120) {
      return NextResponse.json(
        { success: false, error: "Name must be 120 characters or fewer." },
        { status: 400 }
      );
    }

    // 2. Validate Attending
    if (typeof attending !== "string") {
      return NextResponse.json(
        { success: false, error: "Attendance choice is required." },
        { status: 400 }
      );
    }

    const lowerAttending = attending.trim().toLowerCase();
    let normalizedAttending: "Yes" | "No";

    if (lowerAttending === "yes" || lowerAttending === "joyfully accepts" || lowerAttending === "true") {
      normalizedAttending = "Yes";
    } else if (lowerAttending === "no" || lowerAttending === "regretfully declines" || lowerAttending === "false") {
      normalizedAttending = "No";
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Attendance must be either 'Yes' or 'No'.",
        },
        { status: 400 }
      );
    }

    // 3. Validate Guests (number, default 1 if Yes, 0 if No, clamped between 0 and 20)
    let parsedGuests: number;
    if (normalizedAttending === "No") {
      parsedGuests = 0;
    } else {
      const rawGuests = Number(guests);
      if (isNaN(rawGuests) || rawGuests < 1) {
        parsedGuests = 1;
      } else {
        parsedGuests = Math.min(Math.max(Math.floor(rawGuests), 1), 20);
      }
    }

    // 4. Validate Message
    const trimmedMessage = typeof message === "string" ? message.trim().slice(0, 1500) : "";

    // Prepare sanitized payload for Google Sheets Webhook
    const payload = {
      timestamp: new Date().toISOString(),
      name: trimmedName,
      attending: normalizedAttending,
      guests: parsedGuests,
      message: trimmedMessage,
    };

    // Forward the payload to Google Sheets Apps Script Webhook
    // Next.js acts as server-side proxy preventing Iranian ISP blocks & CORS issues
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error("Google Sheets webhook error:", response.status, errorText);
      return NextResponse.json(
        {
          success: false,
          error: `Google Sheets returned an error (${response.status}). Please check your Apps Script deployment.`,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "RSVP recorded successfully.",
        data: payload,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("RSVP route exception:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while processing your RSVP. Please try again.",
      },
      { status: 500 }
    );
  }
}
