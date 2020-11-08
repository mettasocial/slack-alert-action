const core = require("@actions/core");
const github = require("@actions/github");
const fetch = require("node-fetch");

function getenvNameByRef(ref) {
  if (ref === "develop") {
    return "development";
  }
  if (ref === "master" || ref === "main" || ref === "staging" || ref.includes("staging")) {
    return "staging";
  }
  if (ref.includes("production")) {
    return "production";
  }
}

async function sendMessage() {
  try {
    // create all variables
    const { context } = github;
    const { payload } = context;
    const EVENT_NAME = context.eventName;
    const SLACK_BUILD_MONITOR_CHANNEL_ID = core.getInput(
      "SLACK_BUILD_MONITOR_CHANNEL_ID"
    );
    const SLACK_BUILDBOT_TOKEN = core.getInput("SLACK_BUILDBOT_TOKEN");
    const SLACK_WBEHOOK_URL = core.getInput("SLACK_WBEHOOK_URL");
    const JOB_STATUS = core.getInput("JOB_STATUS");
    const GITHUB_REF = getenvNameByRef(payload.ref.split("/").pop());
    const GITHUB_REPOSITORY = payload.repository.full_name.split("/").pop();
    const GITHUB_RUN_ID = context.runId;
    //create basic template for json slack message
    let jsonMessage = {
      channel: SLACK_BUILD_MONITOR_CHANNEL_ID,
      username: "Mettasocial Build bot",
      icon_url: "https://ibb.co/nsDLmjH",
      attachments: [
        {
          color: "#FF0000",
          as_user: false,
          pretext: `Last build is ${JOB_STATUS} on project ${GITHUB_REPOSITORY} / environment ${GITHUB_REF}`,
          title: `Build is ${JOB_STATUS} on project ${GITHUB_REPOSITORY} / environment ${GITHUB_REF}`,
          title_link: `https://github.com/${GITHUB_REPOSITORY}`,
          fields: [],
          footer: "Metta Social Solutions Pvt. Ltd.",
          footer_icon:
            "https://cdn.mettasocial.com/logos/64_without_name_color.png",
          ts: Date.now(),
        },
      ],
    };
    // set color
    if (JOB_STATUS.toLowerCase() === "success") {
      jsonMessage.attachments[0].color = "#36A64F";
    } else if (JOB_STATUS.toLowerCase() === "failure") {
      jsonMessage.attachments[0].color = "#FF0000";
    }
    if (EVENT_NAME === "workflow_dispatch") {
      const CONTENTFUL_ENTITY_CONTENT_TYPE = core.getInput(
        "CONTENTFUL_ENTITY_CONTENT_TYPE"
      );
      const CONTENTFUL_ENTITY_CONTENT = core.getInput(
        "CONTENTFUL_ENTITY_CONTENT"
      );
      jsonMessage.attachments[0].fields = [
        {
          title: `Title of changed Content: ${CONTENTFUL_ENTITY_CONTENT}`,
          value: `Contentful content type changed : ${CONTENTFUL_ENTITY_CONTENT_TYPE}`,
          short: false,
        },
      ];
    } else {
      const COMMIT_MESSAGE = payload.head_commit.message.trim();
      const GITHUB_ACTOR = payload.head_commit.committer.username;
      jsonMessage.attachments[0].fields = [
        {
          title: "Last commit by",
          value: GITHUB_ACTOR,
          short: true,
        },
        {
          title: "Last commit message Says",
          value: COMMIT_MESSAGE,
          short: true,
        },
      ];
    }
    jsonMessage.attachments[0].fields.push({
      title: "Check the pipeline link below for more details",
      value: `https://github.com/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`,
      short: false,
    });
    await fetch(`${SLACK_WBEHOOK_URL}`, {
      headers: {
        Authorization: `Bearer ${SLACK_BUILDBOT_TOKEN}`,
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(jsonMessage),
      method: "POST",
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

sendMessage();
