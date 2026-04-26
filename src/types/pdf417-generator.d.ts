declare module 'pdf417-generator' {
  const PDF417: {
    barcode_array?: {
      num_cols: number;
      num_rows: number;
      bcode: Array<Array<number | string>>;
    };
    draw: (
      code: string,
      canvas: HTMLCanvasElement,
      aspectratio?: number,
      ecl?: number,
      devicePixelRatio?: number,
      lineColor?: string,
    ) => void;
  };
  export = PDF417;
}
