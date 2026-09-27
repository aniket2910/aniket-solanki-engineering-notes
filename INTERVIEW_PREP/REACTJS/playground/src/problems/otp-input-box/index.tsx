import { useState } from "react";
import "./otp.css";
import OtpBox from "./OtpBox";

/**
 * Demo wrapper shown in the playground. Keeps the demo-only state (the last
 * completed value) out of the reusable OtpBox component.
 *
 * IMPROVEMENT (wire up onComplete): the original comment claimed to keep the
 * "last completed value" but nothing consumed it — OtpBox had no way to hand
 * the code out. Now the parent owns the value via the onComplete callback,
 * which is exactly how a real login form would receive the OTP.
 */
const OTP_BOX_LENGTH: number = 6;

export default function OtpInputDemo() {
  const [completedOtp, setCompletedOtp] = useState<string>("");

  return (
    <div className="otp-demo">
      <OtpBox length={OTP_BOX_LENGTH} onComplete={setCompletedOtp} />
      {completedOtp && <p>Entered OTP: {completedOtp}</p>}
    </div>
  );
}
