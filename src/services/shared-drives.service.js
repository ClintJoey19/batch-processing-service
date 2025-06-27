import { createDrive, generateFolders, getDriveAccess } from "../lib/gdrive.js";
import { getTemplateById } from "../queries/template.query.js";

export const createSharedDrives = async (
  batchProcessId,
  payload,
  accessToken,
  refreshToken
) => {
  try {
    const gdrive = await getDriveAccess(accessToken, refreshToken);

    const { drives } = payload;

    await Promise.all(
      drives.map(async ({ name, templateId }) => {
        const drive = await createDrive(gdrive, name);

        if (templateId) {
          const template = await getTemplateById({
            id: templateId,
          });

          await generateFolders(
            gdrive,
            drive.data.id,
            template.structure.children
          );
        }

        return drive.data;
      })
    );
  } catch (error) {
    console.error(error.message);
    throw Error(error.message);
  }
};
