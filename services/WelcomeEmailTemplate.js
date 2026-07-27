export const generateWelcomeTemplate = ({
    name,
}) => {

return `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8"/>

<meta
name="viewport"
content="width=device-width, initial-scale=1.0"
/>

<title>Welcome to Puff House</title>

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

/* ================= HEADER ================= */

.header{

background:
linear-gradient(
135deg,
#8f2cff,
#b148ff,
#d46cff
);

padding:50px 35px;

text-align:center;

}

.logo{

width:78px;

height:78px;

line-height:78px;

border-radius:50%;

background:#fff;

display:inline-block;

font-size:30px;

font-weight:700;

color:#8f2cff;

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

}

/* ================= CONTENT ================= */

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

margin-bottom:36px;

}

/* ================= SUCCESS ================= */

.successCard{

background:#f5fff8;

border:1px solid #c9f5d8;

border-radius:18px;

padding:34px;

text-align:center;

margin-bottom:36px;

}

.successIcon{

font-size:60px;

margin-bottom:18px;

}

.successTitle{

font-size:28px;

font-weight:700;

margin-bottom:14px;

color:#111827;

}

.successText{

font-size:15px;

line-height:1.9;

color:#6b7280;

}

.features{

background:#fafafa;

border-radius:18px;

padding:30px;

border:1px solid #ececec;

margin-bottom:34px;

}

.features h2{

font-size:22px;

margin-bottom:18px;

color:#111827;

}

.feature{

margin-bottom:18px;

font-size:15px;

line-height:1.9;

color:#4b5563;

}

.buttonWrap{

text-align:center;

margin:36px 0;

}

.button{

display:inline-block;

padding:16px 36px;

border-radius:999px;

background:#8f2cff;

color:#fff !important;

text-decoration:none;

font-weight:700;

font-size:15px;

}

.footer{

background:#fafafa;

padding:34px;

border-top:1px solid #ececec;

text-align:center;

}

.footerBrand{

font-size:22px;

font-weight:700;

margin-bottom:12px;

color:#111827;

}

.footerText{

font-size:14px;

line-height:1.9;

color:#6b7280;

}

@media(max-width:640px){

body{

padding:18px;

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

.successTitle{

font-size:24px;

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

Premium Smoking Accessories

</div>

</div>

<div class="content">

<div class="greeting">

Welcome, ${name}! 🎉

</div>

<div class="description">

Your Puff House account has been successfully created.

We're excited to have you join our growing community.

</div>

<div class="successCard">

<div class="successIcon">

🎊

</div>

<div class="successTitle">

Account Created Successfully

</div>

<div class="successText">

You can now explore premium products,
manage your profile,
save multiple addresses,
track orders,
and enjoy a seamless shopping experience.

</div>

</div>

<div class="features">

<h2>

What's Next?

</h2>

<div class="feature">

✅ Verify your email address.

</div>

<div class="feature">

✅ Complete your profile.

</div>

<div class="feature">

✅ Save your delivery address.

</div>

<div class="feature">

✅ Start shopping premium products.

</div>

</div>

<div class="buttonWrap">

<a
href="${process.env.CLIENT_URL}"
class="button"
>

Start Shopping

</a>

</div>

<div
style="
padding:30px;
border-radius:18px;
background:#faf7ff;
border:1px solid #ece5ff;
margin-bottom:34px;
"
>

<h2
style="
font-size:22px;
color:#111827;
margin-bottom:18px;
"
>

Why You'll Love Puff House

</h2>

<div
style="
font-size:15px;
line-height:2;
color:#4b5563;
"
>

<div>⭐ Premium quality smoking accessories</div>

<div>🚚 Fast & Secure Shipping</div>

<div>🎁 Exclusive Member Rewards</div>

<div>❤️ Wishlist & Saved Products</div>

<div>📦 Easy Order Tracking</div>

<div>🔒 Secure Checkout Experience</div>

</div>

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

<h2
style="
font-size:20px;
margin-bottom:16px;
color:#111827;
"
>

Need Help?

</h2>

<p
style="
font-size:15px;
line-height:1.9;
color:#6b7280;
margin-bottom:22px;
"
>

Our support team is always available to help you with
orders, products, rewards, or your account.

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
color:#fff;
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
style="padding-bottom:24px;"
>

<a
href="${process.env.CLIENT_URL}"
style="
display:inline-block;
padding:14px 30px;
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
line-height:1.8;
color:#b0b0b0;
padding-top:18px;
border-top:1px solid #ececec;
"
>

© ${new Date().getFullYear()} Puff House.

All Rights Reserved.

<br><br>

Thank you for joining the Puff House family.

We look forward to serving you with the best products and customer experience.

</td>

</tr>

</table>

</div>

</div>

</body>

</html>

`;

};