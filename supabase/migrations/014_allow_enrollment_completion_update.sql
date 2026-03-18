-- Allow users to update completed_at on their own enrollments
DROP POLICY IF EXISTS "Users can update own enrollment completion" ON public.enrollments;
CREATE POLICY "Users can update own enrollment completion" ON public.enrollments
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
