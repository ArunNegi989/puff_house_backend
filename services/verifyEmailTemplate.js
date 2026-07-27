export const generateVerifyEmailTemplate = ({
    name,
    otp,
}) => {
    return `
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8"/>

<meta
name="viewport"
content="width=device-width, initial-scale=1.0"
/>

<title>Email Verification</title>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
}

body{

background:#f4f5f8;

font-family:
Arial,
Helvetica,
sans-serif;

padding:40px 15px;

color:#222;

-webkit-font-smoothing:antialiased;

}

.wrapper{

max-width:650px;

margin:auto;

background:#fff;

border-radius:20px;

overflow:hidden;

box-shadow:
0 20px 60px rgba(0,0,0,.08);

}

/* ===========================
HEADER
=========================== */

.header{

background:
linear-gradient(
135deg,
#7b2cff,
#9f47ff,
#c36dff
);

padding:46px 35px;

text-align:center;

}

.logo{

display:inline-block;

width:74px;

height:74px;

border-radius:50%;

background:#fff;

line-height:74px;

font-size:28px;

font-weight:700;

color:#7b2cff;

margin-bottom:20px;

}

.brand{

font-size:34px;

font-weight:700;

color:#fff;

margin-bottom:12px;

}

.subtitle{

color:rgba(255,255,255,.92);

font-size:15px;

line-height:1.8;

max-width:450px;

margin:auto;

}

/* ===========================
CONTENT
=========================== */

.content{

padding:48px 38px;

}

.greeting{

font-size:28px;

font-weight:700;

margin-bottom:18px;

color:#111827;

}

.description{

font-size:15px;

line-height:1.9;

color:#4b5563;

margin-bottom:34px;

}

/* ===========================
OTP CARD
=========================== */

.otpCard{

background:

linear-gradient(
180deg,
#fcfbff,
#f6f1ff
);

border:1px solid #ece5ff;

border-radius:18px;

padding:35px;

text-align:center;

margin-bottom:34px;

}

.badge{

display:inline-block;

padding:9px 18px;

background:#ede9fe;

color:#7c3aed;

border-radius:999px;

font-size:12px;

font-weight:700;

letter-spacing:.08em;

margin-bottom:20px;

}

.title{

font-size:26px;

font-weight:700;

color:#111827;

margin-bottom:18px;

}

.otp{

display:inline-block;

padding:18px 34px;

border-radius:14px;

background:#fff;

border:2px dashed #8f2cff;

font-size:42px;

font-weight:800;

letter-spacing:12px;

color:#7b2cff;

margin:18px 0;

}

.expire{

margin-top:18px;

font-size:14px;

color:#6b7280;

line-height:1.8;

}

.notice{

background:#fff7ed;

border-left:5px solid #f59e0b;

padding:24px;

border-radius:14px;

margin-bottom:30px;

}

.notice h3{

font-size:18px;

margin-bottom:12px;

color:#111827;

}

.notice p{

font-size:15px;

line-height:1.9;

color:#4b5563;

}

.security{

background:#f9fafb;

border-radius:16px;

padding:26px;

border:1px solid #ececec;

margin-bottom:34px;

}

.security h3{

font-size:18px;

margin-bottom:14px;

color:#111827;

}

.security ul{

padding-left:18px;

}

.security li{

margin-bottom:12px;

line-height:1.8;

font-size:15px;

color:#4b5563;

}

.buttonWrap{

text-align:center;

margin:36px 0;

}

.button{

display:inline-block;

padding:16px 36px;

background:#8f2cff;

color:#fff !important;

text-decoration:none;

border-radius:999px;

font-size:15px;

font-weight:700;

}

.footer{

background:#fafafa;

border-top:1px solid #ececec;

padding:34px;

text-align:center;

}

.footerBrand{

font-size:24px;

font-weight:700;

margin-bottom:12px;

color:#111827;

}

.footerText{

font-size:14px;

line-height:1.9;

color:#6b7280;

max-width:450px;

margin:auto;

}

.copyright{

margin-top:26px;

padding-top:22px;

border-top:1px solid #ececec;

font-size:12px;

color:#9ca3af;

line-height:1.8;

}

@media(max-width:640px){

body{

padding:18px;

}

.header{

padding:34px 22px;

}

.content{

padding:28px 22px;

}

.brand{

font-size:28px;

}

.greeting{

font-size:24px;

}

.otp{

font-size:32px;

letter-spacing:8px;

padding:16px 24px;

}

.title{

font-size:22px;

}

}

</style>

</head>

<body>

<div class="wrapper">

<div class="header">

<div class="logo">

PH

</div>

<div class="brand">

Puff House

</div>

<div class="subtitle">

Premium Smoking Accessories

<br>

Email Verification

</div>

</div>

<div class="content">

<div class="greeting">

Hi ${name},

</div>

<div class="description">

Thank you for creating your Puff House account.

To protect your account and complete registration, please verify your email address using the One-Time Password below.

</div>

<div class="otpCard">

<div class="badge">

EMAIL VERIFICATION

</div>

<div class="title">

Your Verification Code

</div>

<div class="otp">

${otp}

</div>

<div class="expire">

This verification code will expire in <strong>10 minutes</strong>.

</div>

</div>

<div class="notice">

<h3>

Important

</h3>

<p>

Never share this verification code with anyone.

Puff House will never ask for your OTP by phone, email, or message.

</p>

</div>

<div class="security">

<h3>

Security Tips

</h3>

<ul>

<li>Use this OTP only on the official Puff House website.</li>

<li>If you did not create this account, safely ignore this email.</li>

<li>Your verification code can only be used once.</li>

<li>After expiration, you'll need to request a new OTP.</li>

</ul>

</div>

<div class="buttonWrap">

<a
href="${process.env.CLIENT_URL}/verify-email"
class="button"
>

Verify Email

</a>

</div>

<div class="footer">

<div class="footerBrand">

Puff House

</div>

<div class="footerText">

Thank you for joining Puff House.

We're excited to have you with us.

</div>

<div class="copyright">

© ${new Date().getFullYear()} Puff House.

All Rights Reserved.

<br><br>

This is an automated email.

Please do not reply directly to this message.

</div>

</div>

</div>

</div>

</body>

</html>
`;
};