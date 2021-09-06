declare namespace NodeJS {
  interface ProcessEnv {
    SNAPSHOT_AWS_BUCKET_REGION: string;
    SNAPSHOT_AWS_ACCESS_KEY_ID: string;
    SNAPSHOT_AWS_SECRET_ACCESS_KEY: string;
    SNAPSHOT_AWS_BUCKET_NAME: string;
  }
}
