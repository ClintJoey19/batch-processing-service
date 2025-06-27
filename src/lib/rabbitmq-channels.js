import { connectToRabbitMQ } from "./rabbitmq.js";

let createSharedDrivesChannel;

export const getCreateSharedDrivesChannel = async () => {
  try {
    if (createSharedDrivesChannel) {
      console.log("Create shared drives channel created");
      return createSharedDrivesChannel;
    }

    const connection = await connectToRabbitMQ();

    createSharedDrivesChannel = connection.createChannel();
    console.log("Create shared drives channel created");

    return createSharedDrivesChannel;
  } catch (error) {
    console.error("Failed to create channel: ", error.message);
    throw Error(error.message);
  }
};

let createFoldersChannel;

export const getCreateFilesChannel = async () => {
  try {
    if (createFoldersChannel) {
      console.log("Create folders channel created");
      return createFoldersChannel;
    }

    const connection = await connectToRabbitMQ();

    createFoldersChannel = connection.createChannel();
    console.log("Create folders channel created");

    return createFoldersChannel;
  } catch (error) {
    console.error("Failed to create channel: ", error.message);
    throw Error(error.message);
  }
};

let addMembersChannel;

export const getAddMembersChannel = async () => {
  try {
    if (addMembersChannel) {
      console.log("Add members channel already created");
      return addMembersChannel;
    }

    const connection = await connectToRabbitMQ();

    addMembersChannel = connection.createChannel();
    console.log("Add members channel created");

    return addMembersChannel;
  } catch (error) {
    console.error("Failed to create channel: ", error.message);
    throw Error(error.message);
  }
};
