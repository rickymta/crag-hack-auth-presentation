import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchUserProfile } from '../../store/slices/userProfileSlice';

interface ProfileProviderProps {
  children: React.ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { profile } = useAppSelector((state) => state.userProfile);

  useEffect(() => {
    console.log('ProfileProvider effect triggered:', { 
      isAuthenticated, 
      userId: user?.id, 
      profileId: profile?.id,
      hasProfile: !!profile 
    });
    
    // Fetch profile when user is authenticated
    if (isAuthenticated && user) {
      // Always fetch profile when user changes or when no profile exists
      if (!profile || profile.id !== user.id) {
        console.log('ProfileProvider: Fetching user profile for user:', user.id);
        dispatch(fetchUserProfile());
      } else {
        console.log('ProfileProvider: Profile already exists for current user');
      }
    } else if (!isAuthenticated) {
      console.log('ProfileProvider: User not authenticated, should clear profile');
    } else {
      console.log('ProfileProvider: User authenticated but no user data');
    }
  }, [dispatch, isAuthenticated, user?.id, profile?.id]);

  return <>{children}</>;
};
