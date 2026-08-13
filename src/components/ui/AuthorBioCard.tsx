import type { BlogAuthor } from "@/types/content";

interface AuthorBioCardProps {
  author: BlogAuthor;
}

export function AuthorBioCard({ author }: AuthorBioCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-5">
      <div
        role="img"
        aria-label={author.name}
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-700"
      >
        {author.name.charAt(0)}
      </div>
      <div>
        <p className="font-semibold text-neutral-900">{author.name}</p>
        <p className="text-xs text-neutral-500">{author.role}</p>
        <p className="mt-2 text-sm text-neutral-600">{author.bio}</p>
      </div>
    </div>
  );
}
