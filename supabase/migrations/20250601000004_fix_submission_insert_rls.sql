-- Fix submission/user_answer insert RLS for student and staff complainants

-- Ensure helper functions bypass RLS when reading profile rows
CREATE OR REPLACE FUNCTION public.current_student_id()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
    SELECT "StudentID"
    FROM public.student
    WHERE "UUID" = auth.uid()
    LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.current_staff_id()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
    SELECT "StaffID"
    FROM public.staff
    WHERE "UUID" = auth.uid()
    LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_student()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.student
        WHERE "UUID" = auth.uid()
    );
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.staff
        WHERE "UUID" = auth.uid()
    );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.admin
        WHERE "UUID" = auth.uid()
    );
$$;

DROP POLICY IF EXISTS submission_insert ON public.submission;

CREATE POLICY submission_insert ON public.submission
    FOR INSERT TO authenticated
    WITH CHECK (
        (
            "StudentID" IS NOT NULL
            AND "StaffID" IS NULL
            AND "StudentID" = public.current_student_id()
        )
        OR (
            "StaffID" IS NOT NULL
            AND "StudentID" IS NULL
            AND "StaffID" = public.current_staff_id()
        )
        OR (
            public.is_admin()
            AND (
                ("StudentID" IS NOT NULL AND "StudentID" = public.current_student_id())
                OR ("StaffID" IS NOT NULL AND "StaffID" = public.current_staff_id())
                OR ("StudentID" IS NULL AND "StaffID" IS NULL)
            )
        )
    );

DROP POLICY IF EXISTS user_answer_insert ON public.user_answer;

CREATE POLICY user_answer_insert ON public.user_answer
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.submission s
            WHERE s."SubmissionID" = "SubmissionID"
              AND (
                  (s."StudentID" IS NOT NULL AND s."StudentID" = public.current_student_id())
                  OR (s."StaffID" IS NOT NULL AND s."StaffID" = public.current_staff_id())
                  OR public.is_admin()
              )
        )
    );
