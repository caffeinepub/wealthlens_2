import { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ArticleInput, Category, UserProfile } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useGetAllArticles() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllArticles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetArticle(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["article", id !== null ? id.toString() : "null"],
    queryFn: async () => {
      if (!actor || id === null)
        throw new Error("Actor not available or id is null");
      return actor.getArticle(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useGetArticlesByCategory(category: Category) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["articles", "category", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getArticlesFromCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyArticles() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["articles", "mine"],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getArticlesFromAuthor(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetBookmarkedArticles() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getBookmarkedArticles(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const query = useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetAuthorProfile(principalId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["authorProfile", principalId],
    queryFn: async () => {
      if (!actor || !principalId) return null;
      const principal = Principal.fromText(principalId);
      return actor.getPublicAuthorProfile(principal);
    },
    enabled: !!actor && !isFetching && !!principalId,
  });
}

export function useGetAuthorArticles(principalId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["authorArticles", principalId],
    queryFn: async () => {
      if (!actor || !principalId) return [];
      const principal = Principal.fromText(principalId);
      return actor.getArticlesFromAuthor(principal);
    },
    enabled: !!actor && !isFetching && !!principalId,
  });
}

export function useGetComments(articleId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["comments", articleId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCommentsForArticle(articleId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useHasLiked(articleId: bigint) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["liked", articleId.toString()],
    queryFn: async () => {
      if (!actor || !identity) return false;
      return actor.hasUserLikedArticle(articleId, identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useHasBookmarked(articleId: bigint) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["bookmarked", articleId.toString()],
    queryFn: async () => {
      if (!actor || !identity) return false;
      return actor.hasUserBookmarkedArticle(articleId, identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useCreateArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ArticleInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createArticle(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useUpdateArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: bigint; input: ArticleInput }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateArticle(id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useDeleteArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteArticle(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useToggleLike() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (articleId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.toggleLikeArticle(articleId);
    },
    onSuccess: (_, articleId) => {
      queryClient.invalidateQueries({
        queryKey: ["liked", articleId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({
        queryKey: ["article", articleId.toString()],
      });
    },
  });
}

export function useToggleBookmark() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (articleId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.toggleBookmarkArticle(articleId);
    },
    onSuccess: (_, articleId) => {
      queryClient.invalidateQueries({
        queryKey: ["bookmarked", articleId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}

export function usePostComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      articleId,
      content,
    }: { articleId: bigint; content: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.postComment(articleId, content);
    },
    onSuccess: (_, { articleId }) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", articleId.toString()],
      });
    },
  });
}
