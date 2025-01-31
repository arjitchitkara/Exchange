import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getIconUrl } from '../utils/symbolUtils';
import { useWindowSize } from '../hooks/useWindowSize';

const CryptoIcon = ({ symbol }: { symbol: string }) => {
  const [error, setError] = useState(false);
  const { width } = useWindowSize();
  const iconUrl = getIconUrl(symbol);
  const isSvg = iconUrl.endsWith('.svg');

  if (error) {
    return <GenericCoinIcon />;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-full h-full">
        <Image
          src={iconUrl}
          alt={`${symbol} icon`}
          fill
          sizes={width < 640 ? '24px' : '32px'}
          className="rounded-full object-contain"
          onError={() => setError(true)}
          priority={true}
          loading="eager"
        />
      </div>
    </div>
  );
}; 