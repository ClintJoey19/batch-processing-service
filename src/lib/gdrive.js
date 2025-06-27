import { google } from "googleapis";
import { v4 as uuid } from "uuid";
import {
  createBatchProcessLog,
  updateBatchProcessLog,
} from "../queries/batch-process-log.query.js";

export async function getDriveAccess(accessToken, refreshToken) {
  try {
    const CLIENT_ID = process.env.GOOGLE_ID;
    const CLIENT_SECRET = process.env.GOOGLE_SECRET;

    const auth = new google.auth.OAuth2({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    });

    auth.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const drive = google.drive({
      version: "v3",
      auth: auth,
    });

    // log connected to gdrive

    return drive;
  } catch (error) {
    console.log(error.message);
    throw Error(error.message);
  }
}

export const getMembers = async (drive, fileId) => {
  try {
    const response = await drive.permissions.list({
      fileId: fileId,
      fields: "permissions(id, emailAddress, role)",
      supportsAllDrives: true,
    });

    const members = response.data.permissions.map((permission) => ({
      id: permission.id,
      emailAddress: permission.emailAddress,
      role: permission.role,
    }));

    return members;
  } catch (error) {
    console.log(error.message);
    throw Error(error.message);
  }
};

export const createDrive = async (gdrive, driveName, batchProcessId) => {
  try {
    const log = await createBatchProcessLog(
      batchProcessId,
      "CREATE",
      `Create ${driveName} drive`
    );

    const drive = await gdrive.drives.create({
      requestBody: {
        name: driveName,
      },
      requestId: uuid(),
    });

    await updateBatchProcessLog(log.id, {
      status: "completed",
      completedAt: Date.now(),
    });

    return drive.data;
  } catch (error) {
    console.log(error.message);

    await updateBatchProcessLog(log.id, {
      status: "error",
    });

    throw Error(error.message);
  }
};

export const createFolder = async (
  gdrive,
  parentId,
  folder,
  batchProcessId
) => {
  try {
    const { name } = folder;

    const metadata = {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    };

    const log = await createBatchProcessLog(
      batchProcessId,
      "CREATE",
      `Create ${folder} folder`
    );

    const newFolder = await gdrive.files.create({
      requestBody: metadata,
      requestId: uuid(),
      fields: "id",
      supportsAllDrives: true,
    });

    await updateBatchProcessLog(log.id, {
      status: "completed",
      completedAt: Date.now(),
    });

    return newFolder.data;
  } catch (error) {
    console.error(error.message);

    await updateBatchProcessLog(log.id, {
      status: "error",
    });

    throw Error(error.message);
  }
};

export const generateFolders = async (gdrive, parentId, folders) => {
  try {
    folders.forEach(async (folder) => {
      const newFolder = await createFolder(gdrive, parentId, folder);

      // log that a folder has been created

      if (folder.children) {
        await generateFolders(gdrive, newFolder.id, folder.children);
      }
    });
  } catch (error) {
    console.log(error.message);
    throw Error(error.message);
  }
};
