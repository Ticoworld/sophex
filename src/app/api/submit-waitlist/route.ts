import { google } from 'googleapis';
import { NextResponse } from 'next/server';

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

    // 3. Attempt simple transform from JS-object-literal
    const trimmed = rawBody.trim();
    const withoutQuotes =
      trimmed.startsWith(`'`) && trimmed.endsWith(`'`)
        ? trimmed.slice(1, -1)
        : trimmed;

    const keyQuoted = withoutQuotes.replace(
      /([{\s,])([A-Za-z0-9_]+)\s*:/g,
      '$1"$2":'
    );
    const fullyQuoted = keyQuoted.replace(
      /:"?([^",\{\}]+)"?(?=[,}])/g,
      ':"$1"'
    );
    console.log('🔄 Transformed to valid JSON candidate:', fullyQuoted);

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