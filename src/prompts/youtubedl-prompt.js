const prompts = require('prompts');
const { printErrorsAndExit } = require('../errors');

const youtubedlPrompt = async () => {
    const response = await prompts({
        type:    'number',
        name:    'YOUTUBEDL_INSTANCES',
        message: 'How many youtubedl instances should we use?',
        initial: 3,
        min:     1
    });

    if (Object.keys(response).length === 0) {
        printErrorsAndExit('Couldn\'t get YOUTUBEDL_INSTANCES input.');
    }

    return response.YOUTUBEDL_INSTANCES;
};

module.exports = youtubedlPrompt;
