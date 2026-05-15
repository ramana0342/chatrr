import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLOUD_CLIENT_ID,
    process.env.GOOGLE_CLOUD_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_CLOUD_REFRESH_TOKEN
});

const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

export const commonEmailSender = async ({ to, subject, html, replyTo }) => {
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
        `From: Ramana Portfolio <${process.env.APP_EMAIL}>`,
        `To: ${to}`,
        replyTo ? `Reply-To: ${replyTo}` : '',
        `Content-Type: text/html; charset=utf-8`,
        `Mime-Version: 1.0`,
        `Subject: ${utf8Subject}`,
        '',
        html,
    ];

    const message = messageParts.filter(line => line !== '').join('\n');
    const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    return await gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: encodedMessage },
    });
};