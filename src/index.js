const channelPrompt = require("./prompts/channel-prompt");
const { ensureConfigsAreLoaded } = require("./environment");
const { downloadClips } = require("./clip-downloader");
const { fetchClips } = require("./clip-fetcher");
const { load, api } = require("./api");
const cliProgress = require("cli-progress");
const prompts = require("prompts");
const ora = require("ora");

let apiSpinner;
const downloadBar = new cliProgress.SingleBar(
  {},
  cliProgress.Presets.shades_classic
);

async function fetchUserId(name) {
  const user = await api().users(name);

  return user.data.data[0].id;
}

const download = async () => {
  await ensureConfigsAreLoaded();

  const channel = await channelPrompt();

  await load();

  /**
   * API fetching phase
   */

  let totalBatches = 0;
  let finishedBatches = 0;
  if (!apiSpinner) {
    apiSpinner = ora("Paginating API, please wait...").start();
  }

  function onBatchGenerated(count) {
    totalBatches = count;
  }

  function onBatchFinished() {
    finishedBatches++;
  }

  function onCountUpdate(total) {
    apiSpinner.text = `Paginating API, found ${total} clips, ${finishedBatches}/${totalBatches} please wait...`;
  }

  const id = await fetchUserId(channel);
  const clips = await fetchClips(
    id,
    onBatchGenerated,
    onBatchFinished,
    onCountUpdate
  );
  const clipCount = Object.values(clips).length;

  apiSpinner.succeed("Finished API pagination.");
  apiSpinner = null;

  /**
   * Confirmation phase
   */

  const confirmation = await prompts({
    type: "confirm",
    name: "value",
    message: `Found ${clipCount} clips to download, download now?`,
    initial: true,
  });

  if (!confirmation.value) {
    console.log("Bye!");
    process.exit(0);
  }

  /**
   * Download phase
   */

  downloadBar.start(clipCount, 0);

  const finished = await downloadClips(Object.values(clips), (count) =>
    downloadBar.update(count)
  );

  downloadBar.stop();

  console.log(`Finished download of ${finished} out of ${clipCount}!`);
};

module.exports = {
  download,
};
