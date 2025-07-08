
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, ShieldCheck, ShieldX } from "lucide-react";

interface UserInfo {
  name: string;
  email: string;
  avatar?: string;
  kycStatus: 'verified' | 'pending' | 'rejected';
  isVerified: boolean;
}

interface UserProfileCardProps {
  userInfo: UserInfo;
}

const UserProfileCard = ({ userInfo }: UserProfileCardProps) => {
  const getKycBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <ShieldCheck className="w-3 h-3 mr-1" />
            KYC Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <Shield className="w-3 h-3 mr-1" />
            KYC Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            <ShieldX className="w-3 h-3 mr-1" />
            KYC Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const getVerificationBadge = (verified: boolean) => {
    return verified ? (
      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
        Verified User
      </Badge>
    ) : (
      <Badge variant="outline">
        Not Verified
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
            <AvatarFallback className="text-xl">
              {userInfo.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-2xl">{userInfo.name}</CardTitle>
        <p className="text-gray-600 dark:text-gray-400">{userInfo.email}</p>
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          {getKycBadge(userInfo.kycStatus)}
          {getVerificationBadge(userInfo.isVerified)}
        </div>
      </CardHeader>
    </Card>
  );
};

export default UserProfileCard;
