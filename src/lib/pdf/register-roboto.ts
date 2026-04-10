import path from 'path';

import { Font } from '@react-pdf/renderer';

let didRegister = false;

export const PDF_FONT_FAMILY = 'Roboto';

/** Registriraj Roboto (TTF) jednom po Node procesu — izbjegava dupli Font.register. */
export function registerRobotoPdfFont(): void {
  if (didRegister) {
    return;
  }
  didRegister = true;
  const dir = path.join(process.cwd(), 'public', 'fonts');
  Font.register({
    family: PDF_FONT_FAMILY,
    fonts: [
      {
        src: path.join(dir, 'Roboto-Regular.ttf'),
        fontWeight: 'normal',
      },
      {
        src: path.join(dir, 'Roboto-Bold.ttf'),
        fontWeight: 'bold',
      },
    ],
  });
}
