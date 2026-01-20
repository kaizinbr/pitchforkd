import { Decimal, JsonValue } from "@prisma/client/runtime/client";

export interface Rating {
    id: string;
    value: number;
    favorite: boolean;
    comment: string;
    skip: boolean;
}

export interface Profile {
    id: string;
    bio: string | null;
    name: string | null;
    site: string | null;
    color: string | null;
    pronouns: string | null;
    username: string | null;
    avatarUrl: string | null;
    createdAt: Date;
    lowername: string | null;
    public: boolean;
    favorites: any;
    verified: boolean;
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
    createdAt: Date;
    userId: string | null;
    albumId: string | null;
    review: string | null;    
    ratings: Rating[] | any;
    total: number | Decimal;
    shorten: string | null;
    published: boolean;
    content: {
        type: string;
        content: [];
    } | JsonValue | null;
    Profile: Profile;
}

export interface User {
    id: string;
    username: string;
    name: string;
    avatar_url: string;
    site: string;
    bio: string;
    pronouns: string;
    verified: boolean;
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
    album: Album;
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

export interface Notification {
    id: string;
    rating_id: string;
    type: string | null;
    seen: boolean;
    created_at: string;
    sender_id: string;
    user_id: string;
    profiles: Profile;
    ratings: Review;
}

export interface EmailData {
    id: string;
    identities: Identity[];
}

export interface AppMetadata {
    provider: string;
    providers: string[];
}

export interface UserMetadata {
    avatar_url: string;
    email: string;
    email_verified: boolean;
    full_name: string;
    iss: string;
    name: string;
    phone_verified: boolean;
    picture: string;
    provider_id: string;
    sub: string;
}

export interface Identity {
    identity_id: string;
    id: string;
    user_id: string;
    identity_data: object;
    provider: string;
    last_sign_in_at: string;
    created_at: string;
    updated_at: string;
    email: string;
}

export interface SupaUser {
    id: string;
    aud: string;
    role: string;
    email: string;
    email_confirmed_at: string;
    phone: string;
    confirmed_at: string;
    last_sign_in_at: string;
    app_metadata: AppMetadata;
    user_metadata: UserMetadata;
    identities: Identity[];
    created_at: string;
    updated_at: string;
    is_anonymous: boolean;
}


interface Mark {
    type: 'bold' | 'italic' | 'underline' | 'strike';
}

interface TextContent {
    text: string;
    type: 'text';
    marks?: Mark[];
}

interface Paragraph {
    type: 'paragraph';
    content: TextContent[];
}

export interface Content {
    type: 'doc';
    content: Paragraph[];
}
