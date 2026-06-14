const crypto = require('crypto');

function createBlock(variants, prevHash) {
  const data = JSON.stringify(variants) + prevHash + Date.now();
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  return { hash, prevHash };
}

function verifyChain(blocks) {
  for (let i = 1; i < blocks.length; i++) {
    if (blocks[i].prevHash !== blocks[i - 1].hash) return false;
  }
  return true;
}

module.exports = { createBlock, verifyChain };