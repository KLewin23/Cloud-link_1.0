// const keys = require("./keys");
// const OAuth2Client = require("google-auth-library").OAuth2Client;
// const open = require("open");
// const http = require("http");
// const url = require("url");
// const destroyer = require("server-destroy");
// const { google } = require("googleapis");
//
// function getAuthenticatedClient() {
//     return new Promise((resolve, reject) => {
//         const oAuth2Client = new OAuth2Client(
//             keys.installed.client_id,
//             keys.installed.client_secret,
//             keys.installed.redirect_uris[1]
//         );
//
//         // Generate the url that will be used for the consent dialog.
//         const authorizeUrl = oAuth2Client.generateAuthUrl({
//             access_type: "offline",
//             scope: "https://www.googleapis.com/auth/userinfo.profile"
//         });
//
//         const server = http
//             .createServer(async (req, res) => {
//                 const qs = new url.URL(req.url, "http://localhost:3000")
//                     .searchParams;
//                 const token = await oAuth2Client.getToken(qs.get("code"));
//                 res.end();
//                 server.destroy();
//                 oAuth2Client.setCredentials(token.tokens);
//                 resolve(oAuth2Client);
//             })
//             .listen(3000, () => {
//                 open(authorizeUrl, { wait: false }).then(cp => cp.unref());
//             });
//         destroyer(server);
//     });
// }
//
// getAuthenticatedClient().then(auth => {
//     google.oauth2('v2').userinfo.v2.me.get({auth: auth}
// }).catch(err => console.log(err));
