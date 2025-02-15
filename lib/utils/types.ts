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

export interface Review {
    id: string;
    created_at: string;
    user_id: string;
    album_id: string;
    review: string;
    ratings: [
        {
            id: string;
            value: number;
            favorite: boolean;
        },
    ];
    total: number;
    profiles: User;
    shorten: string;
}

export interface User {
    id: string;
    username: string;
    name: string;
    avatar_url: string;
    site: string;
    bio: string;
    pronouns: string;
}

export interface Album {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Image[];
    name: string;
    release_date: string;
    release_date_precision: string;
    type: string;
    uri: string;
    artists: Artist[];
    tracks: Tracks;
    copyrights: Copyright[];
    external_ids: ExternalIds;
    genres: any[];
    label: string;
    popularity: number;
}

export interface ExternalUrls {
    spotify: string;
}

export interface Image {
    url: string;
    height: number;
    width: number;
}

export interface Artist {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}

export interface Tracks {
    href: string;
    limit: number;
    next: any;
    offset: number;
    previous: any;
    total: number;
    items: Track[];
}

export interface Track {
    artists: Artist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    preview_url: any;
    track_number: number;
    type: string;
    uri: string;
    is_local: boolean;
}

export interface Copyright {
    text: string;
    type: string;
}

export interface ExternalIds {
    upc: string;
}
