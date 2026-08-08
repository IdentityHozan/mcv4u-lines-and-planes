export type ManagedLesson = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  body: string;
  equation?: string;
  videoUrl?: string;
  takeaways: string[];
  publishedAt: string;
  updatedAt: string;
};

export type ManagedLessonInput = Pick<
  ManagedLesson,
  "slug" | "title" | "subtitle" | "summary" | "body" | "equation" | "videoUrl" | "takeaways"
>;
