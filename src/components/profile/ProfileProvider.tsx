import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchUserProfile } from '../../store/slices/userProfileSlice';

interface ProfileProviderProps {
  children: React.ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { profile } = useAppSelector((state) => state.userProfile);

  useEffect(() => {
    // Only fetch profile if user is authenticated and profile is not already loaded
    if (isAuthenticated && !profile) {
      console.log('ProfileProvider: Fetching user profile...');
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated, profile]);

  return <>{children}</>;
};
