import { redirect } from 'next/navigation';

import { getCurrentUserData } from '@/modules/auth/actions';
import { SubmissionHistory } from '@/modules/problems/components/submit-history';
import PlaylistsSection from '@/modules/profile/components/playlist-section';
import ProfileStats from '@/modules/profile/components/profile-stats';
import SolvedProblems from '@/modules/profile/components/solved-problems';
import UserInfoCard from '@/modules/profile/components/user-info-card';

export const dynamic = 'force-dynamic';

const ProfilePage = async () => {
  const profileData = await getCurrentUserData();

  // Handle an unauthenticated user
  if (!profileData) {
    redirect('/sign-in');
  }

  // Handle the error response from getCurrentUserData()
  if ('error' in profileData) {
    console.error('Failed to load profile:', profileData.error);
    redirect('/sign-in');
  }

  const submissions = profileData.submissions ?? [];
  const solvedProblems = profileData.solvedProblems ?? [];
  const playlists = profileData.playlists ?? [];

  return (
    <div className="min-h-screen py-32">
      <div className="container mx-auto max-w-7xl px-4">
        <UserInfoCard userData={profileData} />

        <ProfileStats
          submissions={submissions}
          solvedCount={solvedProblems.length}
          playlistCount={playlists.length}
        />

        <SubmissionHistory submissions={submissions} />

        <div className="grid gap-8">
          <SolvedProblems solvedProblems={solvedProblems} />
          <PlaylistsSection playlists={playlists} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;