/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable global-require */
import chromium from 'chrome-aws-lambda';
import AWS from 'aws-sdk';
import { NextApiRequest, NextApiResponse } from 'next';

const S3 = new AWS.S3({
  signatureVersion: 's3v4',
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function getBrowserInstance() {
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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.body;

  if (!url || !url.trim()) {
    res.json({
      status: 'error',
      errror: 'Enter a valid URL',
    });
  }

  let browser = null;

  try {
    browser = await getBrowserInstance();

    const page = await browser.newPage();

    await page.goto(url);

    const imageBuffer = await page.screenshot();

    const fileName = `images/screen-snap-${`${Date.now()}.jpg`}`;

    let params;

    params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: imageBuffer,
    };

    S3.upload(params, (e: any, data: any) => {
      if (e) {
        console.log(e);
        return res.json({
          status: 'error',
          error: e.message,
        });
      }
      params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Expires: 120, // expires in 2 hours
      };
      const URL = S3.getSignedUrl('getObject', params);
      res.status(200);
      res.json({
        status: 'ok',
        url: URL,
      });
      res.end();
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.end();
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
