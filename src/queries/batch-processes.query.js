import prisma from "../lib/prisma.js";

export const updateBatchProcess = async (id, newData) => {
  try {
    const updatedBatchProcess = await prisma.batchProcess.update({
      where: {
        id,
      },
      data: {
        ...newData,
      },
    });

    return updatedBatchProcess;
  } catch (error) {
    console.error(error.message);
    throw Error(error.message);
  }
};
