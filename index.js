const core = require("@actions/core");
const github = require("@actions/github");

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput("who-to-greet");
  core.info(`Hello ${nameToGreet}!`);
  const time = new Date().toTimeString();
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  core.info(
    "SLACK_BUILD_MONITOR_CHANNEL_ID",
    core.getInput("SLACK_BUILD_MONITOR_CHANNEL_ID")
  );
  core.info("SLACK_USER_TOKEN", core.getInput("SLACK_USER_TOKEN"));
  core.info("SLACK_WBEHOOK_URL", core.getInput("SLACK_WBEHOOK_URL"));
  core.info(
    "CONTENTFUL_ENTITY_CONTENT_TYPE",
    core.getInput("CONTENTFUL_ENTITY_CONTENT_TYPE")
  );
  core.info(
    "CONTENTFUL_ENTITY_CONTENT",
    core.getInput("CONTENTFUL_ENTITY_CONTENT")
  );
  core.info(`The event payload: ${payload}`);
  core.info(
    "payload.head_commit.committer.username",
    payload.head_commit.committer.username
  );
  core.info("payload.head_commit.message", payload.head_commit.message);
  core.info("payload.repository.full_name", payload.repository.full_name);
  core.info("payload.ref", payload.ref);
  core.info("github.context.eventName", github.context.eventName);
  core.info("github.context.run_id", github.context.run_id);
  core.info("fetch", fetch);
  core.info("Date.now()", Date.now());
  core.info(JSON.stringify(github.context, null, 2));
  core.info(github.context.job.status);
  //core.info(`The event payload: ${payload}`);
  core.setOutput("time", time);
} catch (error) {
  core.setFailed(error.message);
}
