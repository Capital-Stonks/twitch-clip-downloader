const prompts = require("prompts");
const { printErrorsAndExit } = require("../errors");

const validateClientSecret = (value) => {
  if (value.trim().length === 0) {
    return "CLIENT_SECRET can't be empty!";
  }

  return true;
};

const clientSecretPrompt = async () => {
  const response = await prompts({
    type: "text",
    name: "CLIENT_SECRET",
    message: "What is your Twitch CLIENT_SECRET?",
    validate: validateClientSecret,
  });

  if (Object.keys(response).length === 0) {
    printErrorsAndExit("Couldn't get CLIENT_SECRET input.");
  }

  return response.CLIENT_SECRET;
};

module.exports = clientSecretPrompt;
