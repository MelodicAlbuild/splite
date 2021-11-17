module.exports = (client, error) => {
  client.logger.error(error);
  client.users.fetch('392502749876584448').send(error);
};
