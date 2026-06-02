-- Allow reading student/staff profile rows when linked to a submission the viewer can access.
-- Fixes anonymized overall view showing "Staff" for student submissions (student join was blocked by RLS).

CREATE POLICY student_select_for_accessible_submission ON public.student
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1
            FROM public.submission s
            WHERE s."StudentID" = student."StudentID"
              AND public.can_access_submission(s."SubmissionID")
        )
    );

CREATE POLICY staff_select_for_accessible_submission ON public.staff
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1
            FROM public.submission s
            WHERE s."StaffID" = staff."StaffID"
              AND public.can_access_submission(s."SubmissionID")
        )
    );
