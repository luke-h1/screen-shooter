/* eslint-disable global-require */
import chromium from 'chrome-aws-lambda';

export default async function getBrowserInstance() {
  const executablePath = await chromium.executablePath;

  if (!executablePath) {
    //   At this stage we are running in a local environment
    const puppeteer = require('puppeteer');
    return puppeteer.launch({
      args: chromium.args,
      headless: true,
      defaultViewport: null,
      ignoreHTTPSErrors: true,
    });
  }
  await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
  return null;
}
