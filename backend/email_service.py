"""
Faculty Guard - Layer 2 Application / Email Delivery Service
Dispatches transactional 2FA verification passcodes using the Resend API.
Accepts dynamic user email input with zero hardcoded email addresses.
"""

import os
import sys
import json
import random
import urllib.request
import urllib.error

# API Key provided for Resend transactional email delivery
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "re_Fym65TtT_1CTGye44epG4NrJjebgKmFvD")

def generate_six_digit_code() -> str:
    """Generates a random, secure 6-digit numeric OTP."""
    return str(random.randint(100000, 999999))

def send_verification_email(to_email: str, otp_code: str = None) -> dict:
    """
    Sends a 6-digit MFA verification code to whatever email address the user inputs.
    Uses the Resend REST API so it works across any standard Python environment.
    """
    if not to_email or not to_email.strip():
        raise ValueError("Recipient email address cannot be empty.")
    
    # Generate a fresh 6-digit code if not provided
    if not otp_code:
        otp_code = generate_six_digit_code()

    recipient_email = to_email.strip().lower()
    api_url = "https://api.resend.com/emails"
    
    # Email HTML body formatted for faculty two-step verification
    html_content = f"""
    <div style="font-family: sans-serif; max-width: 460px; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">
        <h2 style="color: #111;">Faculty Guard Security</h2>
        <p>Your one-time passcode for two-step verification is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #c8102e; margin: 16px 0;">
            {otp_code}
        </div>
        <p style="font-size: 12px; color: #666;">This code expires in 5 minutes. If you did not request this, contact IT.</p>
    </div>
    """

    payload = {
        "from": "onboarding@resend.dev",
        "to": recipient_email,
        "subject": f"Faculty Guard Passcode: {otp_code}",
        "html": html_content
    }

    # Prepare HTTP headers with Bearer token authentication and User-Agent
    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json",
        "User-Agent": "resend-python/2.0.0"
    }

    req = urllib.request.Request(
        api_url, 
        data=json.dumps(payload).encode("utf-8"), 
        headers=headers, 
        method="POST"
    )

    try:
        # Execute the HTTP POST request to Resend
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode("utf-8"))
            print(f"[SUCCESS] Email delivered to {recipient_email}. Message ID: {result.get('id')}")
            return {"status": "success", "id": result.get("id"), "otp_code": otp_code, "to": recipient_email}
    except urllib.error.HTTPError as err:
        err_response = err.read().decode("utf-8")
        print(f"[ERROR] HTTP {err.code}: {err_response}")
        return {"status": "error", "message": err_response, "otp_code": otp_code, "to": recipient_email}

if __name__ == "__main__":
    # Prompt the user interactively or accept via command line argument:
    # Example usage: python3 backend/email_service.py user@institution.edu
    if len(sys.argv) > 1 and sys.argv[1].strip():
        user_input_email = sys.argv[1].strip()
    else:
        user_input_email = input("Enter recipient faculty email address: ").strip()

    if not user_input_email:
        print("Error: No email provided.")
        sys.exit(1)

    print(f"Sending verification code to user-entered email: {user_input_email}...")
    send_verification_email(user_input_email)
