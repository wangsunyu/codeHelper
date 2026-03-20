const net = require('net');

const strings = new Map();
const sortedSets = new Map();

function encodeSimpleString(value) {
  return `+${value}\r\n`;
}

function encodeBulkString(value) {
  if (value === null || value === undefined) return '$-1\r\n';
  const stringValue = String(value);
  return `$${Buffer.byteLength(stringValue)}\r\n${stringValue}\r\n`;
}

function encodeInteger(value) {
  return `:${value}\r\n`;
}

function encodeArray(items) {
  return `*${items.length}\r\n${items.join('')}`;
}

function encodeError(message) {
  return `-ERR ${message}\r\n`;
}

function decodeRequest(buffer) {
  let offset = 0;

  function readLine() {
    const end = buffer.indexOf('\r\n', offset);
    if (end === -1) return null;
    const line = buffer.slice(offset, end);
    offset = end + 2;
    return line;
  }

  const header = readLine();
  if (!header) return null;

  if (header[0] !== '*') {
    return { rest: Buffer.alloc(0), command: null };
  }

  const count = Number(header.slice(1));
  const parts = [];

  for (let i = 0; i < count; i += 1) {
    const bulkHeader = readLine();
    if (!bulkHeader || bulkHeader[0] !== '$') return null;
    const length = Number(bulkHeader.slice(1));
    if (buffer.length < offset + length + 2) return null;
    parts.push(buffer.slice(offset, offset + length).toString());
    offset += length + 2;
  }

  return {
    command: parts,
    rest: buffer.slice(offset),
  };
}

function cleanupExpired(key) {
  const entry = strings.get(key);
  if (entry && entry.expiresAt && entry.expiresAt <= Date.now()) {
    strings.delete(key);
  }
}

function handleCommand(parts) {
  if (!parts || parts.length === 0) return encodeError('empty command');

  const command = parts[0].toUpperCase();

  if (command === 'PING') {
    return parts[1] ? encodeBulkString(parts[1]) : encodeSimpleString('PONG');
  }

  if (command === 'ECHO') {
    return encodeBulkString(parts[1] || '');
  }

  if (command === 'CLIENT' || command === 'HELLO' || command === 'INFO') {
    return encodeSimpleString('OK');
  }

  if (command === 'SET') {
    const key = parts[1];
    const value = parts[2] || '';
    let expiresAt = null;

    for (let i = 3; i < parts.length; i += 2) {
      const option = (parts[i] || '').toUpperCase();
      const optionValue = Number(parts[i + 1]);

      if (option === 'EX') {
        expiresAt = Date.now() + optionValue * 1000;
      }
    }

    strings.set(key, { value, expiresAt });
    return encodeSimpleString('OK');
  }

  if (command === 'GET') {
    const key = parts[1];
    cleanupExpired(key);
    const entry = strings.get(key);
    return encodeBulkString(entry ? entry.value : null);
  }

  if (command === 'DEL') {
    let removed = 0;
    for (const key of parts.slice(1)) {
      cleanupExpired(key);
      if (strings.delete(key)) removed += 1;
      if (sortedSets.delete(key)) removed += 1;
    }
    return encodeInteger(removed);
  }

  if (command === 'ZADD') {
    const key = parts[1];
    if (!sortedSets.has(key)) sortedSets.set(key, new Map());
    const set = sortedSets.get(key);
    let added = 0;

    for (let i = 2; i < parts.length; i += 2) {
      const score = Number(parts[i]);
      const member = parts[i + 1];
      if (!set.has(member)) added += 1;
      set.set(member, score);
    }

    return encodeInteger(added);
  }

  if (command === 'ZREVRANGE') {
    const key = parts[1];
    const start = Number(parts[2] || 0);
    const stop = Number(parts[3] || -1);
    const withScores = (parts[4] || '').toUpperCase() === 'WITHSCORES';
    const set = sortedSets.get(key) || new Map();

    const entries = [...set.entries()].sort((a, b) => b[1] - a[1]);
    const endIndex = stop < 0 ? entries.length - 1 : stop;
    const slice = entries.slice(start, endIndex + 1);
    const payload = [];

    for (const [member, score] of slice) {
      payload.push(encodeBulkString(member));
      if (withScores) payload.push(encodeBulkString(score));
    }

    return encodeArray(payload);
  }

  return encodeSimpleString('OK');
}

const server = net.createServer(socket => {
  let pending = Buffer.alloc(0);

  socket.on('data', chunk => {
    pending = Buffer.concat([pending, chunk]);

    while (pending.length > 0) {
      const parsed = decodeRequest(pending);
      if (!parsed) break;

      pending = parsed.rest;
      socket.write(handleCommand(parsed.command));
    }
  });

  socket.on('error', error => {
    console.error('[dev-redis] socket error:', error.message);
  });
});

server.listen(6379, '127.0.0.1', () => {
  console.log('[dev-redis] listening on 127.0.0.1:6379');
});
