import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Comment {
    id: bigint;
    content: string;
    createdAt: Time;
    author: Principal;
    articleId: bigint;
}
export interface ArticleInput {
    coverImageUrl: string;
    title: string;
    content: string;
    tags: Array<string>;
    excerpt: string;
    category: Category;
}
export interface ArticleView {
    id: bigint;
    coverImageUrl: string;
    title: string;
    content: string;
    tags: Array<string>;
    publishedAt: Time;
    bookmarks: Array<Principal>;
    author: Principal;
    likes: Array<Principal>;
    excerpt: string;
    category: Category;
}
export interface UserProfile {
    bio: string;
    name: string;
    role: UserRole;
    photoUrl: string;
}
export enum Category {
    finance = "finance",
    economicHistory = "economicHistory",
    stock = "stock",
    crypto = "crypto",
    property = "property"
}
export enum UserRole {
    writer = "writer",
    reader = "reader"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    createArticle(input: ArticleInput): Promise<bigint>;
    deleteArticle(id: bigint): Promise<void>;
    getAllArticles(): Promise<Array<ArticleView>>;
    getArticle(id: bigint): Promise<ArticleView>;
    getArticlesFromAuthor(author: Principal): Promise<Array<ArticleView>>;
    getArticlesFromCategory(category: Category): Promise<Array<ArticleView>>;
    getBookmarkedArticles(user: Principal): Promise<Array<ArticleView>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getComment(id: bigint): Promise<Comment>;
    getCommentsForArticle(articleId: bigint): Promise<Array<Comment>>;
    getLikeCount(articleId: bigint): Promise<bigint>;
    getPublicAuthorProfile(author: Principal): Promise<UserProfile | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    hasUserBookmarkedArticle(articleId: bigint, user: Principal): Promise<boolean>;
    hasUserLikedArticle(articleId: bigint, user: Principal): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    postComment(articleId: bigint, content: string): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchArticles(searchTerm: string): Promise<Array<ArticleView>>;
    toggleBookmarkArticle(articleId: bigint): Promise<boolean>;
    toggleLikeArticle(articleId: bigint): Promise<boolean>;
    updateArticle(id: bigint, input: ArticleInput): Promise<void>;
}
