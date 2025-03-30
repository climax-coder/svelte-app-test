declare namespace App {
  interface Locals {
    userid: string;
  }
}

declare module '$env/static/private' {
  export const UPLOAD_DIR: string;
} 