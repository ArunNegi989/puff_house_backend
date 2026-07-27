export const generateReplyTemplate = ({

    customerName,

    subject,

    replyMessage,

}) => {

    return `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width,initial-scale=1.0"
/>

<title>${subject}</title>

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

color:#222;

padding:40px 15px;

-webkit-font-smoothing:antialiased;

}

.wrapper{

max-width:640px;

margin:auto;

background:#ffffff;

border-radius:18px;

overflow:hidden;

box-shadow:

0 20px 60px rgba(0,0,0,.08);

}

/* ===================================
HEADER
=================================== */

.header{

background:

linear-gradient(
135deg,
#8f2cff,
#b148ff,
#d46cff
);

padding:42px 32px;

text-align:center;

}

.brand{

font-size:32px;

font-weight:700;

color:#fff;

letter-spacing:.02em;

margin-bottom:8px;

}

.subtitle{

font-size:15px;

color:rgba(255,255,255,.92);

line-height:1.7;

max-width:420px;

margin:auto;

}

/* ===================================
CONTENT
=================================== */

.content{

padding:42px 36px;

}

.greeting{

font-size:26px;

font-weight:700;

color:#111827;

margin-bottom:14px;

}

.intro{

font-size:15px;

line-height:1.9;

color:#4b5563;

margin-bottom:34px;

}

/* ===================================
REPLY CARD
(Body Part-2 me ayega)
=================================== */

.replyCard{

background:#faf7ff;

border-left:5px solid #8f2cff;

border-radius:14px;

padding:28px;

margin-bottom:34px;

}

/* ===================================
FOOTER
(Part-3)
=================================== */

.footer{

padding:30px;

background:#fafafa;

border-top:1px solid #ececec;

}

/* ===================================
RESPONSIVE
=================================== */

@media(max-width:640px){

body{

padding:18px;

}

.header{

padding:34px 24px;

}

.brand{

font-size:28px;

}

.content{

padding:28px 22px;

}

.greeting{

font-size:22px;

}

.logo{

width:56px;
height:56px;
line-height:56px;
font-size:24px;

}

}

</style>

</head>

<body>

<div class="wrapper">

<div class="header">


<div class="brand">

Puff House

</div>

<div class="subtitle">

Premium Smoking Accessories

Customer Support Team

</div>

</div>

<div class="content">

<div class="greeting">

Hi ${customerName},

</div>

<div class="intro">

Thank you for contacting <strong>Puff House</strong>.

We truly appreciate you reaching out to us.

Our support team has carefully reviewed your inquiry, and below is our response.

</div>

<div class="replyCard">

<div
style="
display:inline-block;
padding:8px 16px;
border-radius:999px;
background:#ede9fe;
color:#7c3aed;
font-size:12px;
font-weight:700;
letter-spacing:.08em;
margin-bottom:18px;
"
>

OFFICIAL RESPONSE

</div>

<h2
style="
font-size:22px;
color:#111827;
margin-bottom:16px;
"
>

${subject}

</h2>

<div
style="
font-size:15px;
line-height:1.9;
color:#374151;
white-space:pre-wrap;
"
>

${replyMessage}

</div>

</div>

<div
style="
padding:26px;
border-radius:16px;
background:#f9fafb;
border:1px solid #ececec;
margin-bottom:34px;
"
>

<h3
style="
font-size:18px;
margin-bottom:14px;
color:#111827;
"
>

Need more help?

</h3>

<p
style="
font-size:15px;
line-height:1.8;
color:#6b7280;
margin-bottom:18px;
"
>

If you have any additional questions or require further assistance,
simply reply to this email or contact our support team.

We're always happy to help.

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
color:#374151;
line-height:1.8;
"
>

📍
818 Country Sq Plaza<br>

Hebron, Indiana 46341<br>

United States

</td>

</tr>

</table>

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
style="
padding-bottom:18px;
"
>

<div
style="
display:inline-block;
width:54px;
height:54px;
line-height:54px;
border-radius:50%;
background:#8f2cff;
color:#ffffff;
font-size:22px;
font-weight:700;
text-align:center;
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
font-size:20px;
font-weight:700;
color:#111827;
padding-bottom:8px;
"
>

Puff House Customer Support

</td>

</tr>

<tr>

<td
align="center"
style="
font-size:14px;
line-height:1.8;
color:#6b7280;
padding-bottom:26px;
"
>

Thank you for choosing Puff House.

We appreciate your trust and look forward to serving you again.

</td>

</tr>

<tr>

<td
align="center"
style="
padding-bottom:24px;
"
>

<a
href="https://puffhouse.com"
style="
text-decoration:none;
display:inline-block;
padding:14px 26px;
border-radius:999px;
background:#8f2cff;
color:#ffffff;
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
padding-bottom:12px;
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
line-height:1.8;
color:#b0b0b0;
padding-top:18px;
border-top:1px solid #ececec;
"
>

© ${new Date().getFullYear()} Puff House.

All Rights Reserved.

<br><br>

This email was sent in response to your customer support request.

Please do not reply to this automated confirmation unless instructed by our support team.

</td>

</tr>

</table>

</div>

</div>

</body>

</html>

`;

};