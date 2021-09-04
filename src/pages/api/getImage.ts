/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable global-require */
import getBrowserInstance from '@src/utils/getBrowserInstance';
import { S3 } from '@src/utils/S3';
import { NextApiRequest, NextApiResponse } from 'next';

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
      Bucket: process.env.SNAPSHOT_AWS_BUCKET_NAME,
      Key: fileName,
      Body: imageBuffer,
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
      res.end();
    });
  } catch (error) {
    console.log(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
