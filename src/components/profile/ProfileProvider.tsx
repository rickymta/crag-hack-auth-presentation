import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchUserProfile } from '../../store/slices/userProfileSlice';
import { debugProfile } from '../../utils/debugUtils';

interface ProfileProviderProps {
  children: React.ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { profile } = useAppSelector((state) => state.userProfile);

  useEffect(() => {
    debugProfile('ProfileProvider effect triggered', { 
      isAuthenticated, 
      userId: user?.id, 
      profileId: profile?.id,
      hasProfile: !!profile 
    });
    
    // If user is not authenticated, don't do anything (profile should be cleared by logout)
    if (!isAuthenticated) {
      debugProfile('ProfileProvider: User not authenticated', 'no action needed');
      return;
    }
    
    // If authenticated but no user data, wait for auth to complete
    if (!user) {
      debugProfile('ProfileProvider: User authenticated but no user data', 'waiting for user data');
      return;
    }
    
    // Always fetch profile when user changes or when no profile exists
    if (!profile || profile.id !== user.id) {
      debugProfile('ProfileProvider: Fetching user profile for user', user.id);
      dispatch(fetchUserProfile());
    } else {
      debugProfile('ProfileProvider: Profile already exists for current user', profile.id);
    }
  }, [dispatch, isAuthenticated, user?.id, profile?.id]);

  return <>{children}</>;
};
