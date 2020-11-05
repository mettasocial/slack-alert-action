const core = require("@actions/core");
const github = require("@actions/github");

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput("who-to-greet");
  console.log(`Hello ${nameToGreet}!`);
  const time = new Date().toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(
    "SLACK_BUILD_MONITOR_CHANNEL_ID",
    core.getInput("SLACK_BUILD_MONITOR_CHANNEL_ID")
  );
  console.log("SLACK_USER_TOKEN", core.getInput("SLACK_USER_TOKEN"));
  console.log("SLACK_WBEHOOK_URL", core.getInput("SLACK_WBEHOOK_URL"));
  console.log(
    "CONTENTFUL_ENTITY_CONTENT_TYPE",
    core.getInput("CONTENTFUL_ENTITY_CONTENT_TYPE")
  );
  console.log(
    "CONTENTFUL_ENTITY_CONTENT",
    core.getInput("CONTENTFUL_ENTITY_CONTENT")
  );
  console.log(`The event payload: ${payload}`);
  console.log(
    "payload.head_commit.committer.username",
    payload.head_commit.committer.username
  );
  console.log("payload.head_commit.message", payload.head_commit.message);
  console.log("payload.repository.full_name", payload.repository.full_name);
  console.log("payload.ref", payload.ref);
  console.log("github.context.eventName", github.context.eventName);
  console.log("github.context.run_id", github.context.run_id);
  console.log("fetch", fetch);
  console.log("Date.now()", Date.now());
  console.log(JSON.stringify(github.context, null, 2));
  console.log(github.context.job.status);
  //console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
