import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const OtpContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 14px 0;
`;

const SingleBox = styled.input`
  width: 44px;
  height: 52px;
  text-align: center;
  font-family: ${(props) => props.theme.typography.monoFont};
  font-size: 22px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.ink};
  background-color: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => (props.$filled ? props.theme.colors.red : props.theme.colors.border)};
  border-radius: ${(props) => props.theme.radii.button};
  outline: none;
  transition: all 0.15s ease;

  &:focus {
    border-color: ${(props) => props.theme.colors.red};
    background-color: ${(props) => props.theme.colors.white};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.redLight};
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

/**
 * 6-Box Isolated Numeric OTP Input
 * Supports auto-focus, fast single-digit typing, backspace navigation,
 * clipboard paste detection, and automatic callback upon 6 digits.
 */
export default function OtpInputBoxes({ value, onChange, onComplete, disabled }) {
  const inputRefs = useRef([]);

  // Ensure 6 digits representation
  const digits = (value || '').padEnd(6, '').slice(0, 6).split('');

  useEffect(() => {
    // Focus first empty box on mount
    const firstEmpty = digits.findIndex((d) => !d);
    const targetIdx = firstEmpty === -1 ? 0 : firstEmpty;
    inputRefs.current[targetIdx]?.focus();
  }, []);

  const handleChange = (index, char) => {
    // Only accept numeric digits
    const cleaned = char.replace(/\D/g, '');
    if (!cleaned && char !== '') return;

    const nextArr = [...digits];
    nextArr[index] = cleaned.slice(-1);
    const nextVal = nextArr.join('').trim();
    onChange(nextVal);

    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (nextVal.length === 6) {
      onComplete?.(nextVal);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    onChange(pastedData);
    if (pastedData.length === 6) {
      onComplete?.(pastedData);
      inputRefs.current[5]?.focus();
    } else {
      inputRefs.current[pastedData.length]?.focus();
    }
  };

  return (
    <OtpContainer onPaste={handlePaste}>
      {[0, 1, 2, 3, 4, 5].map((idx) => (
        <SingleBox
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digits[idx] || ''}
          $filled={Boolean(digits[idx])}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
        />
      ))}
    </OtpContainer>
  );
}
