declare module 'pdf417-generator' {
  const PDF417: {
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
