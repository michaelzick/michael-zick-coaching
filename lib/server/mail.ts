import { connect, type NetConnectOpts, type Socket } from 'node:net';
import nodemailer from 'nodemailer';
import type { SMTPTransportOptions } from 'nodemailer/lib/smtp-transport';

const SMTP_HOST = 'smtp-relay.brevo.com';
const CONNECT_TIMEOUT_MS = 15_000;

export function getBrevoTransportOptions(
  credentials: { userName: string; password: string },
  connectSocket: (options: NetConnectOpts) => Socket = connect,
): SMTPTransportOptions {
  return {
    host: SMTP_HOST,
    port: 587,
    secure: false,
    requireTLS: true,
    connectionTimeout: CONNECT_TIMEOUT_MS,
    greetingTimeout: CONNECT_TIMEOUT_MS,
    socketTimeout: 30_000,
    auth: { user: credentials.userName, pass: credentials.password },
    // Nodemailer's default DNS lookup connects by IP. Preserve the hostname so
    // Cloudflare's production STARTTLS implementation can verify the TLS peer.
    getSocket(_options, callback) {
      const socket = connectSocket({ host: SMTP_HOST, port: 587 });
      const timer = setTimeout(() => {
        socket.destroy(Object.assign(new Error('SMTP connection timed out'), { code: 'ETIMEDOUT' }));
      }, CONNECT_TIMEOUT_MS);
      const onError = (error: Error) => {
        clearTimeout(timer);
        socket.removeListener('connect', onConnect);
        callback(error);
      };
      const onConnect = () => {
        clearTimeout(timer);
        socket.removeListener('error', onError);
        callback(null, { connection: socket });
      };
      socket.once('error', onError);
      socket.once('connect', onConnect);
    },
  };
}

export function createBrevoTransport(credentials: { userName: string; password: string }) {
  return nodemailer.createTransport(getBrevoTransportOptions(credentials));
}

// Never log provider messages, responses, stacks, addresses, auth, or submissions.
export function getMailErrorDetails(error: unknown) {
  const details: { code?: string; command?: string; responseCode?: number } = {};
  if (!error || typeof error !== 'object') return details;
  const candidate = error as Record<string, unknown>;
  if (['ESOCKET', 'ETLS', 'ETIMEDOUT', 'ECONNECTION', 'ECONNREFUSED', 'ECONNRESET', 'EDNS', 'EAUTH', 'EENVELOPE', 'EMESSAGE', 'ESTREAM'].includes(String(candidate.code))) {
    details.code = String(candidate.code);
  }
  if (['CONN', 'STARTTLS', 'AUTH PLAIN', 'AUTH LOGIN', 'MAIL FROM', 'RCPT TO', 'DATA'].includes(String(candidate.command))) {
    details.command = String(candidate.command);
  }
  if (Number.isInteger(candidate.responseCode) && Number(candidate.responseCode) >= 100 && Number(candidate.responseCode) <= 599) {
    details.responseCode = Number(candidate.responseCode);
  }
  return details;
}
