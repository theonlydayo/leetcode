
import React from "react";
import { User, Mail, Calendar, Shield } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type UserInfo = {
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  email: string;
  role: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

type UserInfoCardProps = {
  userData: UserInfo;
};

const UserInfoCard = ({ userData }: UserInfoCardProps) => {
  const formatDate = (dateValue: Date | string): string => {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Unknown";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const firstName = userData.firstName?.trim() || "";
  const lastName = userData.lastName?.trim() || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "User";

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";

  return (
    <Card className="mb-8">
      <CardContent className="p-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarImage
                src={userData.imageUrl ?? undefined}
                alt={fullName}
              />
              <AvatarFallback className="text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="absolute -bottom-2 -right-2 rounded-full bg-primary p-2">
              <Shield className="h-4 w-4 text-white" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="mb-2 text-3xl font-bold">{fullName}</h1>

            <div className="mb-4 flex flex-col gap-4 sm:flex-row">
              <div className="flex items-center justify-center gap-2 text-muted-foreground md:justify-start">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{userData.email}</span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Badge
                  variant={
                    userData.role === "ADMIN" ? "destructive" : "secondary"
                  }
                >
                  {userData.role}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row">
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDate(userData.createdAt)}</span>
              </div>

              <div className="flex items-center justify-center gap-2 md:justify-start">
                <User className="h-4 w-4" />
                <span>Last active {formatDate(userData.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
