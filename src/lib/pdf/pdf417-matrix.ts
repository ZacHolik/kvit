import PDF417 from 'pdf417-generator';

type Pdf417Generator = typeof PDF417 & {
  barcode_array?: {
    num_cols: number;
    num_rows: number;
    bcode: Array<Array<number | string>>;
  };
};

export type Pdf417Matrix = {
  numCols: number;
  numRows: number;
  rows: number[][];
};

/** Generate PDF417 matrix without node-canvas; renderer draws it as vector rects. */
export function generatePdf417Matrix(code: string): Pdf417Matrix | null {
  const generator = PDF417 as Pdf417Generator;
  const fakeCanvas = {
    width: 0,
    height: 0,
    getContext() {
      return {
        scale() {},
        fillRect() {},
        fillStyle: '#000',
      };
    },
  };

  generator.draw(
    code,
    fakeCanvas as unknown as HTMLCanvasElement,
    2,
    -1,
    1,
    '#000',
  );

  const barcode = generator.barcode_array;
  if (!barcode?.bcode?.length) {
    return null;
  }

  return {
    numCols: barcode.num_cols,
    numRows: barcode.num_rows,
    rows: barcode.bcode.map((row) => row.map((cell) => Number(cell))),
  };
}
