import { ImageResponse } from 'next/og';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';

export const runtime = 'nodejs';

export const alt = 'CR Pix Photography';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  try {
    const logoPath = join(process.cwd(), 'public', 'logo.svg');
    const logoData = await readFile(logoPath);
    // Convert buffer to base64 data URI
    const logoSrc = `data:image/svg+xml;base64,${logoData.toString('base64')}`;

    return new ImageResponse(
      (
        <div
          style={{
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={logoSrc} 
            width="600" 
            height="400" 
            style={{ objectFit: 'contain' }} 
            alt="Logo"
          />
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (e) {
    console.error('Failed to load logo for OG image', e);
    return new ImageResponse(
      (
        <div
          style={{
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ fontSize: 80, fontWeight: 'bold', color: 'black' }}>CR Pix Photography</div>
          <div style={{ fontSize: 40, color: '#666', marginTop: 20 }}>Every story deserves to be told beautifully</div>
        </div>
      ),
      {
        ...size,
      }
    );
  }
}
