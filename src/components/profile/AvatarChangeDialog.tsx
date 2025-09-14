import React, { useState, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stack,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
  Tabs,
  Tab,
  Slider,
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  CropFree as CropIcon,
  Rotate90DegreesCcw as RotateLeftIcon,
  Rotate90DegreesCw as RotateRightIcon,
  ZoomIn as ZoomInIcon,
} from '@mui/icons-material';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { SafeAvatar } from '../common/SafeAvatar';

interface AvatarChangeDialogProps {
  open: boolean;
  onClose: () => void;
  currentAvatar?: string | null;
  onCropComplete: (croppedFile: File) => void;
  isUploading?: boolean;
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

export const AvatarChangeDialog: React.FC<AvatarChangeDialogProps> = ({
  open,
  onClose,
  currentAvatar,
  onCropComplete,
  isUploading = false,
}) => {
  const [currentTab, setCurrentTab] = useState(0); // 0: Current Avatar, 1: Crop, 2: Result
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      setCurrentTab(0);
      setSelectedFile(null);
      setImageSrc('');
      setError('');
      setIsProcessing(false);
      setCrop({ unit: '%', width: 80, height: 80, x: 10, y: 10 });
      setScale(1);
      setRotate(0);
      setUploadResult(null);
    }
  }, [open]);

  // Load image when file is selected
  React.useEffect(() => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageSrc(e.target.result as string);
        setError('');
      }
    };
    reader.onerror = () => {
      setError('Không thể tải ảnh. Vui lòng thử lại.');
    };
    reader.readAsDataURL(selectedFile);
  }, [selectedFile]);

  // File selection handlers
  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file hình ảnh');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước file phải nhỏ hơn 5MB');
      return;
    }
    
    setSelectedFile(file);
    setCurrentTab(1); // Move to crop tab
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    event.target.value = '';
  };

  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  // Drag and drop handlers
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Delete avatar handler
  const handleDeleteAvatar = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa avatar không?')) {
      // Create an empty file to simulate delete
      const emptyFile = new File([''], 'delete-avatar.txt', { type: 'text/plain' });
      onCropComplete(emptyFile);
      onClose();
    }
  };

  // Crop handlers
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

  // Navigation handlers
  const handleBack = () => {
    setCurrentTab(0);
    setSelectedFile(null);
    setImageSrc('');
    setError('');
  };

  const handleSaveCrop = async () => {
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
      setUploadResult({ success: true, message: 'Avatar đã được cập nhật thành công!' });
      setCurrentTab(2); // Move to result tab
    } catch (err) {
      console.error('Error cropping image:', err);
      setUploadResult({ success: false, message: 'Không thể xử lý ảnh. Vui lòng thử lại.' });
      setCurrentTab(2); // Move to result tab
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    // Only allow manual navigation to certain tabs
    if (newValue === 0 || (newValue === 1 && selectedFile)) {
      setCurrentTab(newValue);
    }
  };

  // Render tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Current Avatar Tab
        return (
        <Stack spacing={3} alignItems="center">
          {/* Current Avatar Display */}
          <Box textAlign="center">
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Avatar hiện tại
            </Typography>
            <SafeAvatar
              src={currentAvatar}
              sx={{ 
                width: 120, 
                height: 120,
                border: '3px solid',
                borderColor: 'primary.main',
                mb: 1
              }}
              fallbackIcon={<PersonIcon sx={{ fontSize: 60 }} />}
            />
            
            {currentAvatar && (
              <Tooltip title="Xóa avatar">
                <IconButton
                  onClick={handleDeleteAvatar}
                  disabled={isUploading}
                  color="error"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Divider sx={{ width: '100%' }} />

          {/* File Selection Area */}
          <Box
            sx={{
              width: '100%',
              border: 2,
              borderStyle: 'dashed',
              borderColor: dragOver ? 'primary.main' : 'grey.300',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              backgroundColor: dragOver ? 'action.hover' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover',
              }
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleSelectFileClick}
          >
            <PhotoCameraIcon 
              sx={{ 
                fontSize: 48, 
                color: dragOver ? 'primary.main' : 'grey.400',
                mb: 2 
              }} 
            />
            <Typography variant="h6" gutterBottom>
              Chọn ảnh mới
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Click để chọn file hoặc kéo thả ảnh vào đây
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)
            </Typography>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
              disabled={isUploading}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}
        </Stack>
      );

      case 1: // Crop Image Tab
        return (
          <Stack spacing={2}>
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
                    minHeight: 250,
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
                        maxHeight: 300,
                      }}
                    />
                  </ReactCrop>
                </Box>

                {/* Controls */}
                <Stack spacing={1.5}>
                  {/* Scale Control */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      <ZoomInIcon sx={{ fontSize: 20, mr: 1, verticalAlign: 'middle' }} />
                      Tỷ lệ: {scale.toFixed(1)}x
                    </Typography>
                    <Slider
                      value={scale}
                      onChange={handleScaleChange}
                      min={1}
                      max={3}
                      step={0.1}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${value.toFixed(1)}x`}
                      disabled={isProcessing}
                      sx={{ width: '100%' }}
                    />
                  </Box>

                  {/* Rotation Control */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      <CropIcon sx={{ fontSize: 20, mr: 1, verticalAlign: 'middle' }} />
                      Xoay ảnh
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<RotateLeftIcon />}
                        onClick={handleRotateLeft}
                        disabled={isProcessing}
                      >
                        Trái
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<RotateRightIcon />}
                        onClick={handleRotateRight}
                        disabled={isProcessing}
                      >
                        Phải
                      </Button>
                      <Typography variant="body2" sx={{ ml: 'auto', alignSelf: 'center' }}>
                        {rotate}°
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </>
            )}

            {!imageSrc && selectedFile && (
              <Box textAlign="center" py={4}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Đang tải ảnh...
                </Typography>
              </Box>
            )}

            {isProcessing && (
              <Alert 
                severity="info" 
                sx={{ width: '100%' }}
                icon={<CircularProgress size={20} />}
              >
                Đang xử lý ảnh...
              </Alert>
            )}
          </Stack>
        );

      case 2: // Result Tab
        return (
          <Stack spacing={3} alignItems="center">
            <Box textAlign="center">
              <Alert 
                severity={uploadResult?.success ? 'success' : 'error'}
                sx={{ mb: 2 }}
              >
                {uploadResult?.message}
              </Alert>
              
              {uploadResult?.success && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Avatar mới của bạn
                  </Typography>
                  <SafeAvatar
                    src={currentAvatar}
                    sx={{ 
                      width: 120, 
                      height: 120,
                      border: '3px solid',
                      borderColor: 'success.main',
                      mb: 2
                    }}
                    fallbackIcon={<PersonIcon sx={{ fontSize: 60 }} />}
                  />
                </Box>
              )}
            </Box>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { 
          height: currentTab === 1 ? 'auto' : 'auto', 
          maxHeight: currentTab === 1 ? '90vh' : '80vh',
          minHeight: 400 
        }
      }}
    >
      <DialogTitle>
        Thay đổi Avatar
      </DialogTitle>

      <DialogContent>
        {/* Tabs */}
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ 
            mb: 3, 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': {
              minWidth: 0,
              flex: 1,
              fontSize: '0.875rem',
              fontWeight: 500,
              textTransform: 'none',
              padding: '12px 16px',
            },
            '& .MuiTabs-indicator': {
              height: 3,
            }
          }}
        >
          <Tab 
            label="Avatar hiện tại" 
            disabled={isProcessing}
            sx={{ 
              minHeight: 48,
              '&.Mui-selected': {
                color: 'primary.main',
                fontWeight: 600,
              }
            }}
          />
          <Tab 
            label="Chỉnh sửa ảnh" 
            disabled={!selectedFile || isProcessing}
            sx={{ 
              minHeight: 48,
              '&.Mui-selected': {
                color: 'primary.main',
                fontWeight: 600,
              }
            }}
          />
          <Tab 
            label="Kết quả" 
            disabled={!uploadResult}
            sx={{ 
              minHeight: 48,
              '&.Mui-selected': {
                color: 'primary.main',
                fontWeight: 600,
              }
            }}
          />
        </Tabs>

        {/* Tab Content */}
        {renderTabContent()}
      </DialogContent>

      <DialogActions>
        <Button 
          onClick={onClose} 
          disabled={isProcessing}
          variant="outlined"
          sx={{ 
            minWidth: 100,
            fontWeight: 'bold',
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            }
          }}
        >
          {currentTab === 2 ? 'Đóng' : 'Hủy'}
        </Button>
        {currentTab === 1 && (
          <>
            <Button
              onClick={handleBack}
              disabled={isProcessing}
              startIcon={<ArrowBackIcon />}
            >
              Quay lại
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveCrop}
              disabled={!imageSrc || !completedCrop || isProcessing}
              startIcon={isProcessing ? <CircularProgress size={16} /> : <CropIcon />}
            >
              {isProcessing ? 'Đang xử lý...' : 'Lưu Avatar'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AvatarChangeDialog;
