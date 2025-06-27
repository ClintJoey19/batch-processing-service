import prisma from "../lib/prisma.js";

export const createBatchProcessLog = async (
  batchProcessId,
  tag,
  description
) => {
  try {
    const log = await prisma.batchProcessLog.create({
      data: {
        tag,
        description,
        batchProcess: {
          connect: {
            id: batchProcessId,
          },
        },
      },
    });

    return log;
  } catch (error) {
    console.error(error.message);
    throw Error(error.message);
  }
};

export const updateBatchProcessLog = async (id, newData) => {
  try {
    const updatedLog = await prisma.batchProcessLog.update({
      where: {
        id,
      },
      data: {
        ...newData,
      },
    });

    return updatedLog;
  } catch (error) {
    console.error(error.message);
    throw Error(error.message);
  }
};
