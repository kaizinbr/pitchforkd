export interface Rating {
    id: string;
    value: number;
    favorite: boolean;
}

export interface Profile {
    id: string;
    bio: string | null;
    name: string;
    site: string;
    color: string | null;
    pronouns: string;
    username: string;
    avatar_url: string;
    created_at: string;
    lowercased_username: string;
}

export interface AlbumRate {
    id: string;
    created_at: string;
    album_id: string;
    ratings: Rating[];
    review: string;
    user_id: string;
    total: number;
    profiles: Profile;
}
