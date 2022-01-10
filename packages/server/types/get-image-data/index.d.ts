declare module "get-image-data" {
  interface ImageData {
    data: Uint8ClampedArray;
    height: number;
    width: number;
  }

  type Callback = (err: Error | null, data: ImageData) => void;

  function ImageData(src: string, cb: Callback): void;

  export = ImageData;
}
