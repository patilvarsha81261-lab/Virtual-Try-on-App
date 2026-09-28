const Replicate = require('replicate');

let client = null;

function getClient() {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      'REPLICATE_API_TOKEN is not set. Get a free token at replicate.com/account/api-tokens and add it to backend/.env'
    );
  }
  if (!client) {
    client = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
  }
  return client;
}

// IDM-VTON: best-in-class virtual try-on diffusion model (non-commercial use only).
// Ref: https://replicate.com/cuuupid/idm-vton
const MODEL_VERSION =
  'cuuupid/idm-vton:c871bb9b046607b680449ecbae55fd8c6d945e0a1948644bf2361b3d021d3ff4';

/**
 * Runs IDM-VTON given a person photo and a garment photo, both as data URLs
 * (data:image/png;base64,...) or public image URLs.
 * Returns a URL (or FileOutput) pointing to the generated try-on image.
 */
async function runVirtualTryOn({ humanImage, garmentImage, garmentDescription }) {
  const replicate = getClient();

  const output = await replicate.run(MODEL_VERSION, {
    input: {
      human_img: humanImage,
      garm_img: garmentImage,
      garment_des: garmentDescription || 'a garment'
    }
  });

  // The SDK may return a FileOutput object, a URL string, or an array of URLs.
  if (typeof output === 'string') return output;
  if (Array.isArray(output) && output.length > 0) return output[0];
  if (output && typeof output.url === 'function') return output.url();
  throw new Error('Unexpected response shape from Replicate model');
}

module.exports = { runVirtualTryOn };
