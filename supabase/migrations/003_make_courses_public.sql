-- Ensure published course content is publicly browseable without authentication.

DROP POLICY IF EXISTS "Anyone can read published courses" ON public.courses;
CREATE POLICY "Anyone can read published courses" ON public.courses
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

DROP POLICY IF EXISTS "Anyone can read chapters of published courses" ON public.chapters;
CREATE POLICY "Anyone can read chapters of published courses" ON public.chapters
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.courses
      WHERE public.courses.id = public.chapters.course_id
        AND public.courses.published = true
    )
  );

DROP POLICY IF EXISTS "Anyone can read lessons of published courses" ON public.lessons;
CREATE POLICY "Anyone can read lessons of published courses" ON public.lessons
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.chapters
      JOIN public.courses ON public.courses.id = public.chapters.course_id
      WHERE public.chapters.id = public.lessons.chapter_id
        AND public.courses.published = true
    )
  );
