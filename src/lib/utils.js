export const parseMessage = (message) => {
  return JSON.parse(message.content.toString());
};
