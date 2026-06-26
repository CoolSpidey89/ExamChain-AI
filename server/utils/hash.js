const crypto = require('crypto');

function createBlock(variants, prevHash) {
  const data = JSON.stringify(variants) + prevHash;
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  return { hash, prevHash };
}

function verifyChain(questions) {
  const sorted = [...questions]
    .map(q => (q.toObject ? q.toObject() : q))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const blockResults = [];
  let chainValid = true;

  for (let i = 0; i < sorted.length; i++) {
    const block = sorted[i];
    const recomputedHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(block.variants) + block.prevHash)
      .digest('hex');

    const hashMatches = recomputedHash === block.hash;

    let linkMatches = true;
    if (i === 0) {
      linkMatches = block.prevHash === '0';
    } else {
      linkMatches = block.prevHash === sorted[i - 1].hash;
    }

    const valid = hashMatches && linkMatches;
    if (!valid) chainValid = false;

    blockResults.push({
      blockIndex: i,
      questionId: block._id,
      concept: block.concept,
      hashMatches,
      linkMatches,
      valid,
      storedHash: block.hash,
      recomputedHash
    });
  }

  return { chainValid, totalBlocks: sorted.length, blocks: blockResults };
}

module.exports = { createBlock, verifyChain };