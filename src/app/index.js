import {
  getCreateSharedDrivesChannel,
  getCreateFilesChannel,
  getAddMembersChannel,
} from "../lib/rabbitmq-channels.js";
import { parseMessage } from "../lib/utils.js";
import { createSharedDrives } from "../services/shared-drives.service.js";

const startSharedDrivesConsumer = async () => {
  try {
    const channel = await getCreateSharedDrivesChannel();

    const queue = "createSharedDrives";

    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, async (msg) => {
      if (msg) {
        const { batchProcessId, payload, accessToken, refreshToken } =
          parseMessage(msg);

        await createSharedDrives(
          batchProcessId,
          payload,
          accessToken,
          refreshToken
        );
      }
    });

    // todo: acknowledge the queues for automatic deletion
  } catch (error) {
    console.error(error.message);
    throw Error(error.message);
  }
};

const startCreateFoldersConsumer = async () => {
  try {
    const channel = await getCreateFilesChannel();

    const queue = "createFolders";

    // consumer for createFiles queue
    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, (msg) => {
      if (msg) {
        console.log("Files: ", parseMessage(msg));
      }
    });
  } catch (error) {
    console.error(error.message);
    throw Error(error.message);
  }
};

const startAddMembersConsumer = async () => {
  try {
    const channel = await getAddMembersChannel();

    const queue = "addMembers";

    // consumer for createFiles queue
    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, (msg) => {
      if (msg) {
        console.log("Members: ", parseMessage(msg));
      }
    });
  } catch (error) {
    console.error(error.message);
    throw Error(error.message);
  }
};

startSharedDrivesConsumer();

// startCreateFoldersConsumer();

// startAddMembersConsumer();
