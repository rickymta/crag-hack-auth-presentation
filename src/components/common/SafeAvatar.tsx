import React, { useState } from 'react';
import { Avatar as MuiAvatar, type AvatarProps } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

interface SafeAvatarProps extends Omit<AvatarProps, 'src'> {
  src?: string | null;
  fallbackIcon?: React.ReactNode;
}

export const SafeAvatar: React.FC<SafeAvatarProps> = ({
  src,
  fallbackIcon = <PersonIcon />,
  children,
  sx,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(!!src);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // If no src or has error, show fallback
  if (!src || hasError) {
    return (
      <MuiAvatar sx={sx} {...props}>
        {children || fallbackIcon}
      </MuiAvatar>
    );
  }

  return (
    <MuiAvatar 
      sx={{
        ...sx,
        opacity: isLoading ? 0.7 : 1,
        transition: 'opacity 0.3s ease',
      }} 
      {...props}
    >
      <img
        src={src}
        alt="Avatar"
        onError={handleError}
        onLoad={handleLoad}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </MuiAvatar>
  );
};
