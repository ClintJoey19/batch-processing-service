import prisma from "../lib/prisma.js";

export const getTemplateById = async (id) => {
  try {
    const template = await prisma.template.findUnique({
      where: {
        id,
      },
    });

    return template;
  } catch (error) {
    console.error(error.message);
    throw Error(error.message);
  }
};
