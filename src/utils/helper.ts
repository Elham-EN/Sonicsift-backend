// Generate 6 digit OTP
export function generateToken(length = 6): string {
  let otp: string = "";
  for (let i = 0; i < length; i++) {
    const digit = Math.floor(Math.random() * 10);
    otp += digit;
  }
  return otp;
}
