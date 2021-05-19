import {Template} from "../template";


const txtTemplate =
`Welcome!

Please click the Link below to sign-in at {{app.appName}}. 
We're thrilled to have you on board.


{{app.exchangeCodeUrl}}{{challenge}}


Alternatively you can copy & paste the following code to your open browser window to authenticate:


{{challenge}}


The link in this e-mail expires in 2 minutes.
If you have any questions, feel free to contact us via Chat on Discord (https://discord.gg/SACzRXa35v).

-----
If you haven't requested this e-mail you can simply ignore it.
If you repeatedly receive this e-mail unwanted over an extended period then contact us at: lab@circles.land
`;


const htmlTemplate = `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

  <head>
    <meta charset="utf-8">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
    <!--[if mso]>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
    <style>
      td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}
    </style>
  <![endif]-->
    <style>
      @media (max-width: 600px) {
        .button {
          text-align: center !important;
          width: 100% !important;
        }
      }

      @media (prefers-color-scheme: dark) {

        body,
        .email-body,
        .email-body_inner,
        .email-content,
        .email-wrapper,
        .email-masthead,
        .email-footer {
          background-color: #ffffff !important;
          font-size: 16px !important;
        }

        p,
        ul,
        ol,
        blockquote,
        h1,
        h2,
        h3 {
          font-size: 16px !important;
        }

        .attributes_content {
          background-color: #ffffff !important;
        }
      }

      @media (prefers-color-scheme: dark) {
        a {
          color: #08a879;
          text-decoration: none;
        }

        .text-gradient {
          --tw-text-opacity: 1;
          background-image: linear-gradient(270deg, #003399, #003399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }

      @media (max-width: 600px) {
        .button {
          width: auto !important;
        }
      }

      @media (max-width: 600px) {
        .sm-w-full {
          width: 100% !important;
        }
      }
    </style>
  </head>

  <body style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; background-color: #f2f4f6;">
    <div role="article" aria-roledescription="email" aria-label="" lang="en">
      <table class="email-wrapper" style="font-family: Arial, -apple-system, 'Segoe UI', sans-serif; width: 100%;" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center">
            <table class="email-content" style="width: 100%;" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td align="center" class="email-masthead" style="font-size: 16px; padding-top: 16px; padding-bottom: 16px; text-align: center;">
                  <a href="https://circles.land" style="text-shadow: 0 1px 0 #ffffff; font-weight: 700; color: #a8aaaf; text-decoration: none;">
                    CirclesLand
                  </a>
                </td>
              </tr>
              <tr>
                <td class="email-body" style="width: 100%;">
                  <table align="center" class="email-body_inner sm-w-full" style="margin-left: auto; margin-right: auto; width: 570px;" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td style="padding: 45px;">
                        <div style="font-size: 16px;">
                          <h1 class="text-gradient" style="--tw-text-opacity: 1; background-image: linear-gradient(270deg, #0ad99c, #003399); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 700; font-size: 24px; margin-top: 0; text-align: left;">Welcome!</h1>
                          <p style="font-size: 16px; line-height: 24px; margin-top: 6px; margin-bottom: 20px;">
                            Please click the Button below to sign-in at <a href="https://circles.land" style="color: #0ad99c; text-decoration: none;">Circles.land</a>. <br>
                            We're thrilled to have you on board.
                          </p>
                          <table style="margin-top: 30px; margin-bottom: 30px; margin-left: auto; margin-right: auto; text-align: center; width: 100%;" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td align="center" style="font-size: 16px;">
                                <a href="{{action_url}}" class="button" target="_blank" style="display: inline-block; text-decoration: none; border-style: solid; border-width: 10px 18px; box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16); letter-spacing: 3px; border-radius: .5rem; text-transform: uppercase; --tw-bg-opacity: 1; background-color: #0ad99c; --tw-border-opacity: 1; border-color: #0ad99c; --tw-text-opacity: 1; color: #ffffff; font-weight: 700; width: auto;">Sign In</a>
                              </td>
                            </tr>
                          </table>
                          <p style="font-size: 16px; line-height: 24px; margin-top: 6px; margin-bottom: 20px;">
                            Alternatively you can copy & paste the following code to your open browser window to authenticate:
                          </p>
                          <table style="margin-bottom: 21px; width: 100%;" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td class="attributes_content" style="padding: 16px;">
                                <table style="width: 100%;" cellpadding="0" cellspacing="0" role="presentation">
                                  <tr>
                                    <td style="font-size: 16px;">
                                      <strong style="font-size: 16px;">XXXYSHASNDHDHD</strong>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                          <p style="font-size: 16px; line-height: 24px; margin-top: 6px; margin-bottom: 20px;">The link in this e-mail expires in 2 minutes.</p>
                          <p style="font-size: 16px; line-height: 24px; margin-top: 6px; margin-bottom: 20px;">
                            If you have any questions, feel free to contact us via <a href="{{live_chat_url}}" style="color: #0ad99c; text-decoration: none;">Chat</a> on Discord.
                          </p>
                          <table style="border-top-width: 1px; margin-top: 25px; padding-top: 25px; border-top-color: #eaeaec; border-top-style: solid;" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td>
                                <p style="font-size: 13px; line-height: 24px; margin-top: 6px; margin-bottom: 20px;">If you haven't requested this e-mail you can simply ignore it.</p>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <table align="center" class="email-footer sm-w-full" style="margin-left: auto; margin-right: auto; text-align: center; width: 570px;" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td align="center" style="font-size: 16px; padding: 45px;">
                        <p style="font-size: 13px; line-height: 24px; margin-top: 6px; margin-bottom: 20px; text-align: center; color: #a8aaaf;">&copy; 2021 CirclesLand. All rights reserved.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
`;

export const login:Template = {
    subject: "Your login link for {{app.appName}}",
    bodyPlain: txtTemplate,
    bodyHtml: htmlTemplate
}