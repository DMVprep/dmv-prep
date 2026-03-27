const fs = require('fs');
const envFile = fs.readFileSync('/Users/jjakc/Desktop/dmv-prep/.env.local','utf8');
const key = envFile.match(/ANTHROPIC_API_KEY=([^\n\r]+)/)?.[1]?.trim();
console.log('Key found:', key ? key.substring(0,20)+'...' : 'NOT FOUND');

fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': key,
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 100,
    messages: [{ role: 'user', content: 'Say OK' }]
  })
}).then(r => r.json()).then(d => console.log('Response:', JSON.stringify(d).substring(0,200)))
.catch(e => console.log('Error:', e.message));
