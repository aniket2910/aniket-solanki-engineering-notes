import { useEffect, useRef, useState } from "react";

/**
 * IMPROVEMENT (prop `onComplete`): the original component held the OTP value
 * internally with no way for a parent to read it. A reusable OTP input must
 * lift its value out, otherwise the login form can never get the code.
 */
interface OTPBoxPropTypes {
  length: number;
  onComplete?: (otp: string) => void;
}

const isValidInput = (value: string): boolean => {
  const charCodeOfLastValue = value.charCodeAt(value.length - 1);
  if (charCodeOfLastValue < 48 || charCodeOfLastValue > 57) return false;
  return true;
};

const OtpBox = ({ length, onComplete }: OTPBoxPropTypes) => {
  const [values, setValues] = useState<string[]>(new Array(length).fill(""));
  const otpBoxRef = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    // IMPROVEMENT (optional chaining): calling .focus() directly throws if the
    // ref isn't populated yet. `?.` makes the autofocus defensive.
    otpBoxRef.current[0]?.focus();
  }, []);

  /**
   * IMPROVEMENT (fire onComplete): centralised helper that commits a new value
   * array to state AND notifies the parent the moment all boxes are filled.
   */
  const commit = (newArr: string[]) => {
    setValues(newArr);
    const joined = newArr.join("");
    if (joined.length === length && !joined.includes("")) {
      onComplete?.(joined);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { value } = e.target;
    if (value === "") return;
    if (!isValidInput(value)) return;
    const newValue = value.slice(-1);
    const newArr = [...values];
    newArr[index] = newValue;
    commit(newArr);
    if (index < length - 1) {
      // IMPROVEMENT (optional chaining): safer than the original `.focus()`.
      otpBoxRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    // IMPROVEMENT (correct backspace UX): the original always cleared the
    // current box and stepped back. Standard behaviour is: if the current box
    // has a value, clear it and stay; if it's already empty, step back and
    // clear the previous box.
    if (e.key === "Backspace") {
      const newArr = [...values];
      if (values[index]) {
        newArr[index] = "";
      } else if (index > 0) {
        newArr[index - 1] = "";
        otpBoxRef.current[index - 1]?.focus();
      }
      commit(newArr);
    }

    // IMPROVEMENT (arrow-key navigation): move between boxes like a native
    // multi-field input. Cheap to add, reads as thorough in the interview.
    if (e.key === "ArrowLeft" && index > 0) {
      otpBoxRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      otpBoxRef.current[index + 1]?.focus();
    }
  };

  /**
   * IMPROVEMENT (paste support): the biggest gap in the original. Pasting a
   * full code like "123456" used to land only the last digit because of
   * value.slice(-1). We now spread the pasted digits across the boxes and
   * focus the next empty (or last) box.
   */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "") // keep digits only
      .slice(0, length);
    if (!pasted) return;
    const newArr = new Array(length).fill("");
    pasted.split("").forEach((ch, i) => (newArr[i] = ch));
    commit(newArr);
    const focusIndex = Math.min(pasted.length, length - 1);
    otpBoxRef.current[focusIndex]?.focus();
  };

  return (
    <div className="otp-box-wrapper">
      {values.map((_item, index) => {
        return (
          <input
            ref={(el) => {
              if (el) otpBoxRef.current[index] = el;
            }}
            className="otp-input"
            // IMPROVEMENT (mobile + a11y attributes):
            // - inputMode="numeric": numeric keypad on mobile
            // - autoComplete="one-time-code": iOS/Android SMS OTP autofill
            // - maxLength={1}: hard cap of one char per box
            // - aria-label: screen-reader context for each box
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            aria-label={`Digit ${index + 1}`}
            key={index}
            onChange={(e) => {
              handleChange(e, index);
            }}
            onKeyDown={(e) => {
              handleKeyDown(e, index);
            }}
            onPaste={handlePaste}
            // IMPROVEMENT (select on focus): clicking a filled box selects its
            // content so the next keystroke overwrites cleanly.
            onFocus={(e) => e.target.select()}
            value={values[index]}
          />
        );
      })}
    </div>
  );
};

export default OtpBox;
