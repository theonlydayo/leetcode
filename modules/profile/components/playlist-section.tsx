
import React from "react";
import { List, Calendar, FileText } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Playlist = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

type PlaylistsSectionProps = {
  playlists: Playlist[];
};

const PlaylistsSection = ({ playlists }: PlaylistsSectionProps) => {
  const formatDate = (dateValue: Date | string): string => {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <List className="h-6 w-6 text-blue-500" />
          <CardTitle className="text-2xl">Playlists</CardTitle>
          <Badge variant="secondary">{playlists.length}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        {playlists.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <List className="h-8 w-8 text-muted-foreground" />
            </div>

            <h3 className="mb-2 text-lg font-medium">
              No Playlists Created
            </h3>

            <p className="text-muted-foreground">
              Create your first playlist to organize your problems!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {playlists.map((playlist) => {
              const createdTime = new Date(playlist.createdAt).getTime();
              const updatedTime = new Date(playlist.updatedAt).getTime();

              const wasUpdated =
                !Number.isNaN(createdTime) &&
                !Number.isNaN(updatedTime) &&
                createdTime !== updatedTime;

              return (
                <Card
                  key={playlist.id}
                  className="group bg-blue-50 transition-all duration-200 hover:shadow-md dark:bg-blue-950/50"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start gap-3">
                      <div className="rounded-full bg-blue-100 p-3 transition-colors group-hover:bg-blue-200 dark:bg-blue-900 dark:group-hover:bg-blue-800">
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>

                      <div className="flex-1">
                        <h3 className="mb-2 font-bold transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {playlist.name}
                        </h3>

                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {playlist.description || "No description provided."}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 border-t pt-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Created {formatDate(playlist.createdAt)}
                        </span>
                      </div>

                      {wasUpdated && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Updated {formatDate(playlist.updatedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlaylistsSection;
