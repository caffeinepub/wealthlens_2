import { useGetAuthorProfile } from "./useQueries";

export function useAuthorName(principalId: string | undefined | null): string {
  const { data: profile } = useGetAuthorProfile(principalId ?? null);
  if (!principalId) return "Penulis";
  return profile?.name || `${principalId.slice(0, 12)}...`;
}
