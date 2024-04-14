// QRCodeComponent.tsx

import React from 'react';
import QRCode from 'qrcode.react';

interface QRCodeProps {
  url: string;
}

const QRCodeComponent: React.FC<QRCodeProps> = ({ url }) => {
  return (
    <div>
      <h1>QR Code for Your React Web App</h1>
      <QRCode value={url} />
      <p>Scan this QR code with your mobile device to view your React web app.</p>
    </div>
  );
};

export default QRCodeComponent;




