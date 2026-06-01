-- Write policies and storage buckets for complaint CRUD

CREATE OR REPLACE FUNCTION public.current_staff_id()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT "StaffID"
    FROM public.staff
    WHERE "UUID" = auth.uid()
    LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.current_staff_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_staff_id() TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.can_manage_submission(p_submission_id bigint)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF public.is_admin() THEN
        RETURN true;
    END IF;

    IF public.is_staff() AND public.can_access_submission(p_submission_id) THEN
        RETURN true;
    END IF;

    RETURN false;
END;
$$;

REVOKE ALL ON FUNCTION public.can_manage_submission(bigint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_manage_submission(bigint) TO anon, authenticated, service_role;

-- submission writes
CREATE POLICY submission_insert ON public.submission
    FOR INSERT TO authenticated
    WITH CHECK (
        (
            public.is_student()
            AND "StudentID" = public.current_student_id()
            AND "StaffID" IS NULL
        )
        OR (
            public.is_staff()
            AND "StaffID" = public.current_staff_id()
            AND "StudentID" IS NULL
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

CREATE POLICY submission_update ON public.submission
    FOR UPDATE TO authenticated
    USING (public.can_manage_submission("SubmissionID"))
    WITH CHECK (public.can_manage_submission("SubmissionID"));

CREATE POLICY submission_delete ON public.submission
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- user_answer writes
CREATE POLICY user_answer_insert ON public.user_answer
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.submission s
            WHERE s."SubmissionID" = "SubmissionID"
              AND (
                  (public.is_student() AND s."StudentID" = public.current_student_id())
                  OR (public.is_staff() AND s."StaffID" = public.current_staff_id())
                  OR public.is_admin()
              )
        )
    );

-- resolution writes
CREATE POLICY resolution_insert ON public.resolution
    FOR INSERT TO authenticated
    WITH CHECK (
        public.can_manage_submission("SubmissionID")
        AND (
            public.is_admin()
            OR ("StaffID" = public.current_staff_id())
        )
    );

-- storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('complaint-evidence', 'complaint-evidence', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
    ('resolution-attachments', 'resolution-attachments', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY complaint_evidence_read ON storage.objects
    FOR SELECT
    USING (bucket_id = 'complaint-evidence');

CREATE POLICY complaint_evidence_insert ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'complaint-evidence');

CREATE POLICY resolution_attachments_read ON storage.objects
    FOR SELECT
    USING (bucket_id = 'resolution-attachments');

CREATE POLICY resolution_attachments_insert ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'resolution-attachments');
