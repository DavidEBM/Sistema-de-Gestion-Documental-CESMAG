import { NextRequest, NextResponse } from "next/server";
import { Readable } from "node:stream";
import { google } from "googleapis";

export async function POST(request: NextRequest) {
  try {
    const { name, mimeType, contentBase64, subfolder } = await request.json();
    const rawCredentials = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON;
    if (!rawCredentials || !name || !mimeType || !contentBase64) {
      return NextResponse.json({ error: "Google Drive no está configurado" }, { status: 503 });
    }

    const credentials = JSON.parse(rawCredentials);
    const auth = new google.auth.GoogleAuth({ credentials, scopes: ["https://www.googleapis.com/auth/drive.file"] });
    const drive = google.drive({ version: "v3", auth });

    let parentId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;
    if (subfolder) {
      const escapedFolder = subfolder.replace(/'/g, "\\'");
      const folderResponse = await drive.files.list({
        q: `name='${escapedFolder}' and mimeType='application/vnd.google-apps.folder' and trashed=false${parentId ? ` and '${parentId}' in parents` : ""}`,
        fields: "files(id)",
        spaces: "drive",
      });
      parentId = folderResponse.data.files?.[0]?.id ?? undefined;
      if (!parentId) {
        const createdFolder = await drive.files.create({
          requestBody: { name: subfolder, mimeType: "application/vnd.google-apps.folder", ...(process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID ? { parents: [process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID] } : {}) },
          fields: "id",
        });
        parentId = createdFolder.data.id ?? undefined;
      }
    }

    const media = Buffer.from(contentBase64, "base64");
    const created = await drive.files.create({
      requestBody: { name, ...(parentId ? { parents: [parentId] } : {}) },
      media: { mimeType, body: Readable.from(media) },
      fields: "id,name,webViewLink",
    });

    return NextResponse.json(created.data);
  } catch (error) {
    console.error("Drive upload failed", error);
    return NextResponse.json({ error: "No fue posible subir el archivo" }, { status: 500 });
  }
}
