(function () {
  "use strict";

  var APP_PATH = "/filebrowser-quantum/ui";
  var APP_URL = APP_PATH + "/?v=2.0.5";
  var HEALTH_URL = APP_PATH + "/health?v=2.0.5";
  var READY_TIMEOUT_MS = 25000;
  var POLL_MS = 400;

  var frame = document.getElementById("appFrame");
  var loading = document.getElementById("loading");
  var errorPanel = document.getElementById("error");
  var errorDetail = document.getElementById("errorDetail");
  var retryButton = document.getElementById("retry");
  var openDirect = document.getElementById("openDirect");

  var settled = false;
  var attemptToken = 0;
  var lastHealth = "health check not completed";
  var frameError = "";

  function looksLikeBrowserError(text) {
    return /HTTP ERROR|ERR_[A-Z_]+|未获授权|无法访问|网页无法|This page isn.t working|The server responded with/i.test(text || "");
  }

  function frameRendered() {
    var doc;
    try {
      doc = frame.contentDocument;
    } catch (error) {
      frameError = "the embedded page is cross-origin";
      return false;
    }
    if (!doc || !doc.body) {
      frameError = "the embedded page did not load a document";
      return false;
    }
    var bodyText = (doc.body.innerText || "").trim();
    if (looksLikeBrowserError(bodyText)) {
      frameError = "the browser rejected the embedded page";
      return false;
    }
    var app = doc.getElementById("app");
    if (app && app.childElementCount > 0) {
      frameError = "";
      return true;
    }
    if (bodyText.length > 0 && doc.querySelector("form, input, button")) {
      frameError = "";
      return true;
    }
    frameError = "the embedded page is still empty";
    return false;
  }

  async function probeHealth() {
    try {
      var response = await fetch(HEALTH_URL, {
        cache: "no-store",
        credentials: "include",
        headers: { "Accept": "application/json" }
      });
      lastHealth = "health check returned HTTP " + response.status;
      if (!response.ok) {
        return false;
      }
      var text = await response.text();
      var data = null;
      try {
        data = JSON.parse(text);
      } catch (error) {
        data = null;
      }
      if (data && (data.message === "ok" || data.status === "ok")) {
        lastHealth = "health check returned ok";
        return true;
      }
      lastHealth = "health check returned an unexpected body: " + text.slice(0, 80);
      return false;
    } catch (error) {
      lastHealth = "health check failed: " + error.message;
      return false;
    }
  }

  function markReady() {
    if (settled) {
      return;
    }
    settled = true;
    loading.hidden = true;
    errorPanel.hidden = true;
  }

  function showError() {
    if (settled) {
      return;
    }
    settled = true;
    loading.hidden = true;
    errorPanel.hidden = false;
    errorDetail.textContent =
      "The app did not render within " + (READY_TIMEOUT_MS / 1000) + " seconds. " +
      lastHealth + "; " + (frameError || "the embedded page did not report readiness") + ". " +
      "Check the filebrowserquantum-system service and its log, then retry.";
  }

  async function tick(token, deadline) {
    if (settled || token !== attemptToken) {
      return;
    }
    var healthOk = await probeHealth();
    if (settled || token !== attemptToken) {
      return;
    }
    var rendered = frameRendered();
    if (healthOk && rendered) {
      markReady();
      return;
    }
    if (Date.now() >= deadline) {
      showError();
      return;
    }
    window.setTimeout(function () {
      tick(token, deadline);
    }, POLL_MS);
  }

  function start() {
    attemptToken += 1;
    settled = false;
    lastHealth = "health check not completed";
    frameError = "";
    errorPanel.hidden = true;
    loading.hidden = false;
    var token = attemptToken;
    var deadline = Date.now() + READY_TIMEOUT_MS;
    frame.src = APP_URL + "&retry=" + token;
    tick(token, deadline);
  }

  frame.addEventListener("load", function () {
    if (attemptToken > 0 && !settled) {
      window.setTimeout(function () {
        tick(attemptToken, Date.now() + READY_TIMEOUT_MS);
      }, 100);
    }
  });

  retryButton.addEventListener("click", start);
  openDirect.href = APP_URL;
  start();
}());
