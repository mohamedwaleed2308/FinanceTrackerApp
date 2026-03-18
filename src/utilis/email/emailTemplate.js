export const emailTemplate = (code) => {
    return `
    html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Confirmation Email</title>

<style>
    body {
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        font-family: Arial, sans-serif;
    }

    .container {
        max-width: 500px;
        margin: 40px auto;
        background: #ffffff;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    h1 {
        color: #333333;
    }

    p {
        color: #666666;
        font-size: 16px;
        line-height: 1.5;
    }

    .otp-box {
        margin: 20px 0;
        padding: 15px;
        font-size: 28px;
        letter-spacing: 5px;
        background-color: #f0f8ff;
        border: 2px dashed #007bff;
        border-radius: 8px;
        font-weight: bold;
    }
    .otp-box h1{
       color: #0a0404;
    }

    .footer {
        margin-top: 20px;
        font-size: 12px;
        color: #999999;
    }
</style>

</head>

<body>

<div class="container">
    <h1>Email Confirmation</h1>

    <p>Hello,</p>
    <p>Thank you for signing up. Please use the verification code below to confirm your email address:</p>

    <div class="otp-box">
        <h1>${code}</h1>
    </div>

    <p>This code will expire in 2 hours.</p>

    <div class="footer">
        <p>If you didn’t request this, please ignore this email.</p>
    </div>
</div>

</body>
</html>
`
}