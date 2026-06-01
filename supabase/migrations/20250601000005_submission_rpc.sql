-- Reliable complaint creation via SECURITY DEFINER RPCs (bypasses brittle INSERT RLS)

CREATE OR REPLACE FUNCTION public.create_submission(p_topic_id bigint)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
DECLARE
    v_student_id text;
    v_staff_id text;
    v_admin_staff_id text;
    v_admin_student_id text;
    v_submission_id bigint;
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT s."StudentID"
    INTO v_student_id
    FROM public.student s
    WHERE s."UUID" = auth.uid();

    IF v_student_id IS NOT NULL THEN
        INSERT INTO public.submission ("TopicID", "StudentID", "Status")
        VALUES (p_topic_id, v_student_id, 'Pending')
        RETURNING "SubmissionID" INTO v_submission_id;

        RETURN v_submission_id;
    END IF;

    SELECT st."StaffID"
    INTO v_staff_id
    FROM public.staff st
    WHERE st."UUID" = auth.uid();

    IF v_staff_id IS NOT NULL THEN
        INSERT INTO public.submission ("TopicID", "StaffID", "Status")
        VALUES (p_topic_id, v_staff_id, 'Pending')
        RETURNING "SubmissionID" INTO v_submission_id;

        RETURN v_submission_id;
    END IF;

    SELECT a."StaffID", a."StudentID"
    INTO v_admin_staff_id, v_admin_student_id
    FROM public.admin a
    WHERE a."UUID" = auth.uid();

    IF v_admin_student_id IS NOT NULL THEN
        INSERT INTO public.submission ("TopicID", "StudentID", "Status")
        VALUES (p_topic_id, v_admin_student_id, 'Pending')
        RETURNING "SubmissionID" INTO v_submission_id;

        RETURN v_submission_id;
    END IF;

    IF v_admin_staff_id IS NOT NULL THEN
        INSERT INTO public.submission ("TopicID", "StaffID", "Status")
        VALUES (p_topic_id, v_admin_staff_id, 'Pending')
        RETURNING "SubmissionID" INTO v_submission_id;

        RETURN v_submission_id;
    END IF;

    IF EXISTS (SELECT 1 FROM public.admin a WHERE a."UUID" = auth.uid()) THEN
        INSERT INTO public.submission ("TopicID", "Status")
        VALUES (p_topic_id, 'Pending')
        RETURNING "SubmissionID" INTO v_submission_id;

        RETURN v_submission_id;
    END IF;

    RAISE EXCEPTION 'No student or staff profile is linked to this account';
END;
$$;

CREATE OR REPLACE FUNCTION public.create_user_answer(
    p_submission_id bigint,
    p_qid bigint,
    p_answer_text text,
    p_ans_url text DEFAULT NULL
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
DECLARE
    v_uaid bigint;
    v_allowed boolean := false;
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT (
        EXISTS (
            SELECT 1
            FROM public.submission s
            INNER JOIN public.student st ON st."StudentID" = s."StudentID"
            WHERE s."SubmissionID" = p_submission_id
              AND st."UUID" = auth.uid()
        )
        OR EXISTS (
            SELECT 1
            FROM public.submission s
            INNER JOIN public.staff sf ON sf."StaffID" = s."StaffID"
            WHERE s."SubmissionID" = p_submission_id
              AND sf."UUID" = auth.uid()
        )
        OR EXISTS (
            SELECT 1
            FROM public.admin a
            WHERE a."UUID" = auth.uid()
        )
    ) INTO v_allowed;

    IF NOT v_allowed THEN
        RAISE EXCEPTION 'Not authorized to add answers to this submission';
    END IF;

    INSERT INTO public.user_answer ("SubmissionID", "QID", "AnswerText", "AnsURL")
    VALUES (p_submission_id, p_qid, p_answer_text, p_ans_url)
    RETURNING "UAID" INTO v_uaid;

    RETURN v_uaid;
END;
$$;

REVOKE ALL ON FUNCTION public.create_submission(bigint) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_user_answer(bigint, bigint, text, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.create_submission(bigint) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.create_user_answer(bigint, bigint, text, text) TO authenticated, service_role;

-- Keep direct INSERT policies for service_role / future use, but add invoker-safe fallback policies
DROP POLICY IF EXISTS submission_insert ON public.submission;

CREATE POLICY submission_insert ON public.submission
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.student s
            WHERE s."UUID" = (SELECT auth.uid())
              AND s."StudentID" = "StudentID"
              AND "StaffID" IS NULL
        )
        OR EXISTS (
            SELECT 1
            FROM public.staff st
            WHERE st."UUID" = (SELECT auth.uid())
              AND st."StaffID" = "StaffID"
              AND "StudentID" IS NULL
        )
        OR (
            EXISTS (SELECT 1 FROM public.admin a WHERE a."UUID" = (SELECT auth.uid()))
            AND "StudentID" IS NULL
            AND "StaffID" IS NULL
        )
    );

DROP POLICY IF EXISTS user_answer_insert ON public.user_answer;

CREATE POLICY user_answer_insert ON public.user_answer
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.submission s
            INNER JOIN public.student st ON st."StudentID" = s."StudentID"
            WHERE s."SubmissionID" = "SubmissionID"
              AND st."UUID" = (SELECT auth.uid())
        )
        OR EXISTS (
            SELECT 1
            FROM public.submission s
            INNER JOIN public.staff sf ON sf."StaffID" = s."StaffID"
            WHERE s."SubmissionID" = "SubmissionID"
              AND sf."UUID" = (SELECT auth.uid())
        )
        OR EXISTS (
            SELECT 1
            FROM public.admin a
            WHERE a."UUID" = (SELECT auth.uid())
        )
    );
