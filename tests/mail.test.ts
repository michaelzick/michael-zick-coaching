import assert from 'node:assert/strict';
import { Socket } from 'node:net';
import { test } from 'node:test';
import { getBrevoTransportOptions, getMailErrorDetails } from '../lib/server/mail';

test('Brevo connects by hostname and requires TLS before authentication', () => {
  const socket = new Socket();
  const options = getBrevoTransportOptions({ userName: 'test-user', password: 'test-password' }, connection => {
    assert.deepEqual(connection, { host: 'smtp-relay.brevo.com', port: 587 });
    return socket;
  });
  assert.equal(options.requireTLS, true);
  assert.equal(options.secure, false);
  let calls = 0;
  options.getSocket!(options, (error, result) => {
    calls++;
    assert.equal(error, null);
    assert.ok(result);
    assert.equal(result.connection, socket);
  });
  socket.emit('connect');
  assert.equal(calls, 1);
  assert.equal(socket.listenerCount('error'), 0);
  socket.destroy();
});

test('connection failure is returned once without falling back to plaintext', () => {
  const socket = new Socket();
  const options = getBrevoTransportOptions({ userName: 'test-user', password: 'test-password' }, () => socket);
  const failure = Object.assign(new Error('Connection refused'), { code: 'ECONNREFUSED' });
  let calls = 0;
  options.getSocket!(options, error => {
    calls++;
    assert.equal(error, failure);
  });
  socket.emit('error', failure);
  socket.emit('connect');
  assert.equal(calls, 1);
  assert.equal(options.requireTLS, true);
  socket.destroy();
});

test('email diagnostics exclude credentials, recipients, provider responses, and stack traces', () => {
  assert.deepEqual(getMailErrorDetails({
    code: 'EAUTH', command: 'AUTH PLAIN', responseCode: 535,
    message: 'private provider response', response: 'private provider response',
    auth: { user: 'private', pass: 'private' }, rejected: ['private@example.com'], stack: 'private stack',
  }), { code: 'EAUTH', command: 'AUTH PLAIN', responseCode: 535 });
  assert.deepEqual(getMailErrorDetails({ code: 'private-value', command: 'private-value', responseCode: 'private-value' }), {});
  assert.deepEqual(getMailErrorDetails(null), {});
});
