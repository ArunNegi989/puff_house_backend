export const generateForgotPasswordTemplate = ({
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

<title>Reset Your Password</title>

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

background:#ffffff;

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
#8f2cff,
#b148ff,
#d46cff
);

padding:46px 35px;

text-align:center;

}

.logo{

display:inline-block;

width:74px;

height:74px;

border-radius:50%;

background:#ffffff;

color:#8f2cff;

line-height:74px;

font-size:30px;

font-weight:700;

margin-bottom:18px;

}

.brand{

font-size:34px;

font-weight:700;

color:#fff;

margin-bottom:10px;

}

.subtitle{

font-size:15px;

line-height:1.8;

color:rgba(255,255,255,.95);

max-width:430px;

margin:auto;

}

/* ===========================
CONTENT
=========================== */

.content{

padding:46px 36px;

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
RESET CARD
=========================== */

.resetCard{

background:#faf7ff;

border:1px solid #ece5ff;

border-radius:18px;

padding:34px;

text-align:center;

margin-bottom:34px;

}

.badge{

display:inline-block;

padding:8px 18px;

background:#ede9fe;

color:#7c3aed;

border-radius:999px;

font-size:12px;

font-weight:700;

letter-spacing:.08em;

margin-bottom:18px;

}

.title{

font-size:26px;

font-weight:700;

margin-bottom:14px;

color:#111827;

}

.lock{

font-size:58px;

margin:18px 0;

}

.text{

font-size:15px;

line-height:1.8;

color:#6b7280;

margin-bottom:26px;

}

.otp{

display:inline-block;

padding:18px 34px;

background:#fff;

border:2px dashed #8f2cff;

border-radius:14px;

font-size:40px;

font-weight:800;

letter-spacing:12px;

color:#8f2cff;

margin-bottom:18px;

}

.expire{

font-size:14px;

color:#6b7280;

line-height:1.8;

}

.warning{

background:#fff7ed;

border-left:5px solid #f59e0b;

border-radius:14px;

padding:24px;

margin-bottom:32px;

}

.warning h3{

font-size:18px;

margin-bottom:12px;

color:#111827;

}

.warning p{

font-size:15px;

line-height:1.9;

color:#4b5563;

}

.security{

background:#f9fafb;

border-radius:16px;

padding:26px;

border:1px solid #ececec;

margin-bottom:32px;

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

font-size:15px;

line-height:1.9;

margin-bottom:10px;

color:#4b5563;

}

.buttonWrap{

text-align:center;

margin:38px 0;

}

.button{

display:inline-block;

padding:16px 34px;

background:#8f2cff;

color:#ffffff !important;

text-decoration:none;

font-size:15px;

font-weight:700;

border-radius:999px;

}

.footer{

padding:34px;

background:#fafafa;

border-top:1px solid #ececec;

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

.title{

font-size:22px;

}

.otp{

font-size:30px;

letter-spacing:8px;

padding:16px 22px;

}

.button{

width:100%;

text-align:center;

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

Secure Password Recovery

</div>

</div>

<div class="content">

<div class="greeting">

Hi ${name},

</div>

<div class="description">

We received a request to reset the password associated with your Puff House account.

If this was you, use the verification code below to continue.

</div>

<div class="resetCard">

<div class="badge">

PASSWORD RESET

</div>

<div class="title">

Reset Verification Code

</div>

<div class="lock">

🔒

</div>

<div class="text">

Enter the following One-Time Password to securely reset your password.

</div>

<div class="otp">

${otp}

</div>

<div class="expire">

This code expires in <strong>10 minutes</strong>.

</div>

</div>

<div class="warning">

<h3>

Didn't request this?

</h3>

<p>

If you did not request a password reset, you can safely ignore this email.

Your account will remain secure and no changes will be made.

</p>

</div>

<div class="security">

<h3>

Security Tips</h3>

<ul>

<li>Never share this OTP with anyone.</li>

<li>Puff House will never ask for your password.</li>

<li>Use this OTP only on the official Puff House website.</li>

<li>If you suspect suspicious activity, change your password immediately after logging in.</li>

</ul>

</div>
<div class="buttonWrap">

<a
href="${process.env.CLIENT_URL}/reset-password"
class="button"
>

Reset Password

</a>

</div>

<div
style="
padding:28px;
border-radius:18px;
background:#f9fafb;
border:1px solid #ececec;
margin-bottom:34px;
"
>

<h3
style="
font-size:20px;
color:#111827;
margin-bottom:16px;
"
>

Need Help?

</h3>

<p
style="
font-size:15px;
line-height:1.9;
color:#6b7280;
margin-bottom:22px;
"
>

If you're having trouble accessing your account,
our support team is always here to help.

</p>

<table
width="100%"
cellpadding="0"
cellspacing="0"
border="0"
>

<tr>

<td
style="
padding:10px 0;
font-size:15px;
color:#374151;
"
>

📧 support@puffhouse.com

</td>

</tr>

<tr>

<td
style="
padding:10px 0;
font-size:15px;
color:#374151;
"
>

📞 +1 (219) 509-3047

</td>

</tr>

<tr>

<td
style="
padding:10px 0;
font-size:15px;
color:#374151;
"
>

🕒 Tuesday – Friday

10:00 AM – 7:00 PM EST

</td>

</tr>

<tr>

<td
style="
padding-top:10px;
font-size:15px;
line-height:1.8;
color:#374151;
"
>

📍 818 Country Sq Plaza<br>

Hebron, Indiana 46341<br>

United States

</td>

</tr>

</table>

</div>

</div>

<div class="footer">

<table
width="100%"
cellpadding="0"
cellspacing="0"
border="0"
>

<tr>

<td
align="center"
style="padding-bottom:18px;"
>

<div
style="
display:inline-block;
width:58px;
height:58px;
line-height:58px;
border-radius:50%;
background:#8f2cff;
color:#ffffff;
font-size:24px;
font-weight:700;
"
>

PH

</div>

</td>

</tr>

<tr>

<td
align="center"
style="
font-size:22px;
font-weight:700;
color:#111827;
padding-bottom:10px;
"
>

Puff House

</td>

</tr>

<tr>

<td
align="center"
style="
font-size:14px;
line-height:1.9;
color:#6b7280;
padding-bottom:24px;
"
>

Premium Smoking Accessories

</td>

</tr>

<tr>

<td
align="center"
style="padding-bottom:26px;"
>

<a
href="${process.env.CLIENT_URL}"
style="
display:inline-block;
padding:14px 28px;
background:#8f2cff;
color:#ffffff;
text-decoration:none;
border-radius:999px;
font-size:14px;
font-weight:700;
"
>

Visit Puff House

</a>

</td>

</tr>

<tr>

<td
align="center"
style="
font-size:13px;
line-height:1.8;
color:#9ca3af;
padding-bottom:14px;
"
>

818 Country Sq Plaza,
Hebron,
Indiana 46341,
United States

</td>

</tr>

<tr>

<td
align="center"
style="
font-size:13px;
line-height:1.8;
color:#9ca3af;
padding-bottom:14px;
"
>

support@puffhouse.com

&nbsp; | &nbsp;

+1 (219) 509-3047

</td>

</tr>

<tr>

<td
align="center"
style="
font-size:12px;
line-height:1.9;
color:#b0b0b0;
padding-top:18px;
border-top:1px solid #ececec;
"
>

© ${new Date().getFullYear()} Puff House.

All Rights Reserved.

<br><br>

This email was sent because a password reset request
was initiated for your account.

If you did not request this password reset,
please ignore this email.

</td>

</tr>

</table>

</div>

</div>

</body>

</html>

`;
};