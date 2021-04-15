import {Template} from "../template";

export const login:Template = {
    subject: "Your login link for {{app.appName}}",
    bodyPlain:
`Please click the link below to sign-in at {{app.appName}}: 

{{app.exchangeCodeUrl}}{{challenge}}

The link in this e-mail expires in {{app.challengeLifetimeMinutes}} minutes.


If you haven't requested this e-mail you can simply ignore it.
If you repeatedly receive this e-mail unwanted over an extended period then contact us at: {{env.ADMIN_EMAIL}}.
`,
    bodyHtml:
`Please click the link below to sign-in at {{app.appName}}: <br/><br/>
<a href="{{app.exchangeCodeUrl}}{{challenge}}">Sign-in</a>
<br/>
<p style="color:darkgray;">The link in this e-mail expires in {{app.challengeLifetimeMinutes}} minutes.</p>
<p style="font-size: 0.8em; color:darkgray;">If you haven't requested this e-mail you can simply ignore it.<br/>
If you repeatedly receive this e-mail unwanted over an extended period then contact us at: {{env.ADMIN_EMAIL}}.</p>`
}