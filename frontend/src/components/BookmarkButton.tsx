"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useNeoBookmarks as useBookmarks } from "@/hooks/useNeoBookmarks";
import { useTranslation } from "@/i18n/useTranslation";

interface BookmarkButtonProps {
  id: string;
  name: string;
  type: "symptom" | "remedy";
}

export function BookmarkButton({ id, name, type }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { t } = useTranslation();
  const bookmarked = isBookmarked(id);

  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleBookmark(id, name, type); }}
      className={`p-1.5 rounded transition-colors ${
        bookmarked
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
      title={bookmarked ? t("bookmark.remove") : t("bookmark.add")}
    >
      {bookmarked ? (
        <BookmarkCheck className="h-3.5 w-3.5" />
      ) : (
        <Bookmark className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
