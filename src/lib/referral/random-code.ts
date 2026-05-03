const CHARSET = 'abcdefghijklmnopqrstuvwxyz0123456789';

export function randomReferralCode6(): string {
  let out = '';
  for (let i = 0; i < 6; i += 1) {
    out += CHARSET[Math.floor(Math.random() * CHARSET.length)]!;
  }
  return out;
}
