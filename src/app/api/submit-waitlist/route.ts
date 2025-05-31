import { NextResponse } from 'next/server';
import { google } from 'googleapis';

type WaitlistFormData = {
  name?: string;
  email?: string;
  role?: string;
  explanation: string;
  socialPost?: string;
};

export async function POST(request: Request) {
  // 1. Grab the raw text
  const rawBody = await request.text();
  console.log('⚙️ Raw incoming body:', rawBody);

  let formData: WaitlistFormData;

  // 2. Try parsing directly as JSON
  try {
    formData = JSON.parse(rawBody);
  } catch (firstError) {
    console.warn('⚠️ First JSON.parse failed:', firstError);

    // 3. Attempt simple transform from JS‐object‐literal (unquoted keys/values) → valid JSON:
    //    a) Strip surrounding single quotes, if present
    //    b) Wrap bare keys in double quotes
    //    c) Wrap bare values (until comma or closing brace) in double quotes
    const trimmed = rawBody.trim();
    const withoutQuotes =
      trimmed.startsWith(`'`) && trimmed.endsWith(`'`)
        ? trimmed.slice(1, -1)
        : trimmed;

    // 3.a) Wrap unquoted keys:  { name: → {"name":
    const keyQuoted = withoutQuotes.replace(
      /([{\s,])([A-Za-z0-9_]+)\s*:/g,
      '$1"$2":'
    );

    // 3.b) Wrap unquoted values:  :"someValue",  or :"someValue"}  →  :"someValue",
    //     This pattern looks for any colon followed by characters up to a comma or closing brace, as long as they’re not already in quotes.
    const fullyQuoted = keyQuoted.replace(
      /:"?([^",\{\}]+)"?(?=[,}])/g,
      ':"$1"'
    );

    console.log('🔄 Transformed to valid JSON candidate:', fullyQuoted);

    // 3.c) Try parsing again
    try {
      formData = JSON.parse(fullyQuoted);
    } catch (secondError) {
      console.warn('❌ Second JSON.parse also failed:', secondError);
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      );
    }
  }

  // 4. Basic validation
  if (!formData.explanation) {
    return NextResponse.json(
      { error: 'Explanation is required' },
      { status: 400 }
    );
  }
  if (
    formData.socialPost &&
    !/^https?:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/\w+\/status\/\d+$/i.test(
      formData.socialPost
    )
  ) {
    return NextResponse.json(
      { error: 'Invalid Twitter/X URL format' },
      { status: 400 }
    );
  }

  // 5. Append to Google Sheets
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID!;
    const timestamp = new Date().toISOString();

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            timestamp,
            formData.name || '',
            formData.email || '',
            formData.role || 'user',
            formData.explanation,
            formData.socialPost || '',
          ],
        ],
      },
    });

    return NextResponse.json({ success: true });
  } catch (sheetError) {
    console.error('❌ Failed to write to Google Sheet:', sheetError);
    return NextResponse.json(
      { error: 'Failed to submit form to Google Sheets' },
      { status: 500 }
    );
  }
}
