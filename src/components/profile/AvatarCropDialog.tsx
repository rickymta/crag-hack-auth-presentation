import React, { useState, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Slider,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CropFree as CropIcon,
  Rotate90DegreesCcw as RotateLeftIcon,
  Rotate90DegreesCw as RotateRightIcon,
  ZoomIn as ZoomInIcon,
} from '@mui/icons-material';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';

interface AvatarCropDialogProps {
  open: boolean;
  onClose: () => void;
  imageFile: File | null;
  onCropComplete: (croppedFile: File) => void;
}

// Helper function to create a cropped image
const getCroppedImg = (
  image: HTMLImageElement,
  crop: Crop,
  fileName: string = 'avatar.jpg'
): Promise<File> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // Set canvas size to the desired output size (square for avatar)
  const outputSize = 300; // 300x300 avatar
  canvas.width = outputSize;
  canvas.height = outputSize;

  // Calculate crop dimensions
  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;
  const cropWidth = crop.width * scaleX;
  const cropHeight = crop.height * scaleY;

  // Draw the cropped image
  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    outputSize,
    outputSize
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          throw new Error('Canvas is empty');
        }
        const file = new File([blob], fileName, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        resolve(file);
      },
      'image/jpeg',
      0.9
    );
  });
};

export const AvatarCropDialog: React.FC<AvatarCropDialogProps> = ({
  open,
  onClose,
  imageFile,
  onCropComplete,
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 80,
    height: 80,
    x: 10,
    y: 10,
  });
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const imgRef = useRef<HTMLImageElement>(null);

  // Load image when file changes
  React.useEffect(() => {
    if (!imageFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageSrc(e.target.result as string);
        setError('');
      }
    };
    reader.onerror = () => {
      setError('Failed to load image. Please try again.');
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  // Set initial crop when image loads
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 80,
        },
        1, // aspect ratio 1:1 for square avatar
        width,
        height
      ),
      width,
      height
    );
    
    setCrop(initialCrop);
    setCompletedCrop(initialCrop);
  }, []);

  const handleCropChange = useCallback((newCrop: Crop) => {
    setCrop(newCrop);
  }, []);

  const handleCropComplete = useCallback((newCrop: Crop) => {
    setCompletedCrop(newCrop);
  }, []);

  const handleRotateLeft = () => {
    setRotate((prev) => prev - 90);
  };

  const handleRotateRight = () => {
    setRotate((prev) => prev + 90);
  };

  const handleScaleChange = (_event: Event, newValue: number | number[]) => {
    setScale(newValue as number);
  };

  const handleSave = async () => {
    if (!imgRef.current || !completedCrop) return;

    setIsProcessing(true);
    setError('');

    try {
      const croppedFile = await getCroppedImg(
        imgRef.current,
        completedCrop,
        `avatar_${Date.now()}.jpg`
      );
      
      onCropComplete(croppedFile);
      onClose();
    } catch (err) {
      console.error('Error cropping image:', err);
      setError('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
      // Reset state
      setImageSrc('');
      setCrop({ unit: '%', width: 80, height: 80, x: 10, y: 10 });
      setScale(1);
      setRotate(0);
      setError('');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { height: '80vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <CropIcon color="primary" />
          <Typography variant="h6">Crop Avatar</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {error && (
            <Alert severity="error">{error}</Alert>
          )}

          {imageSrc && (
            <>
              {/* Crop Area */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 300,
                  backgroundColor: 'grey.100',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <ReactCrop
                  crop={crop}
                  onChange={handleCropChange}
                  onComplete={handleCropComplete}
                  aspect={1} // Square aspect ratio
                  minWidth={50}
                  minHeight={50}
                  keepSelection
                >
                  <img
                    ref={imgRef}
                    src={imageSrc}
                    alt="Crop preview"
                    onLoad={onImageLoad}
                    style={{
                      transform: `scale(${scale}) rotate(${rotate}deg)`,
                      maxWidth: '100%',
                      maxHeight: 400,
                    }}
                  />
                </ReactCrop>
              </Box>

              {/* Controls */}
              <Stack spacing={2}>
                {/* Scale Control */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    <ZoomInIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Scale
                  </Typography>
                  <Slider
                    value={scale}
                    onChange={handleScaleChange}
                    min={0.5}
                    max={3}
                    step={0.1}
                    valueLabelDisplay="auto"
                    disabled={isProcessing}
                  />
                </Box>

                {/* Rotation Controls */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Rotation
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<RotateLeftIcon />}
                      onClick={handleRotateLeft}
                      disabled={isProcessing}
                    >
                      Rotate Left
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<RotateRightIcon />}
                      onClick={handleRotateRight}
                      disabled={isProcessing}
                    >
                      Rotate Right
                    </Button>
                    <Typography variant="body2" sx={{ ml: 'auto', alignSelf: 'center' }}>
                      {rotate}°
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </>
          )}

          {!imageSrc && imageFile && (
            <Box textAlign="center" py={4}>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary" mt={1}>
                Loading image...
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isProcessing}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!imageSrc || !completedCrop || isProcessing}
          startIcon={isProcessing ? <CircularProgress size={16} /> : undefined}
        >
          {isProcessing ? 'Processing...' : 'Save Avatar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
