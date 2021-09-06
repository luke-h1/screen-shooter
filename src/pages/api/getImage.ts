/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable global-require */
import { S3 } from '@src/utils/S3';
import * as playwright from 'playwright-aws-lambda';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.body;

  if (!url || !url.trim()) {
    res.json({
      status: 'error',
      errror: 'Enter a valid URL',
    });
  }

  const browser = await playwright.launchChromium({
    headless: true,
  });

  try {
    const page = await browser.newPage({
      viewport: {
        width: 1920,
        height: 1080,
      },
    });

    await page.goto(url);

    page.waitForEvent('domcontentloaded');
    const image = await page.screenshot({
      type: 'png',
    });
    const fileName = `images/screen-snap-${`${Date.now()}.jpg`}`;

    let params;

    params = {
      Bucket: process.env.SNAPSHOT_AWS_BUCKET_NAME,
      Key: fileName,
      Body: image,
    };

    S3.upload(params, (e: any) => {
      if (e) {
        console.log(e);
        return res.json({
          status: 'error',
          error: e.message,
        });
      }
      params = {
        Bucket: process.env.SNAPSHOT_AWS_BUCKET_NAME,
        Key: fileName,
        Expires: 120, // expires in 2 hours
      };
      const URL = S3.getSignedUrl('getObject', params);
      res.status(200);
      res.json({
        status: 'ok',
        url: URL,
      });
      res.end(image);
    });
  } catch (error) {
    console.log(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
