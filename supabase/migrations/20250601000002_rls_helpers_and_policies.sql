-- RLS helper functions and policies for SIIT Complaint System

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admin WHERE "UUID" = auth.uid()
    );
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.staff WHERE "UUID" = auth.uid()
    );
$$;

CREATE OR REPLACE FUNCTION public.is_student()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.student WHERE "UUID" = auth.uid()
    );
$$;

CREATE OR REPLACE FUNCTION public.current_student_id()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT "StudentID"
    FROM public.student
    WHERE "UUID" = auth.uid()
    LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.current_staff_division()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT "Division"
    FROM public.staff
    WHERE "UUID" = auth.uid()
    LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_public_topic(p_topic_id bigint)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT p_topic_id IS NOT NULL AND p_topic_id NOT IN (1, 2);
$$;

CREATE OR REPLACE FUNCTION public.staff_can_access_topic(p_topic_id bigint)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.topic_staff_access tsa
        WHERE tsa."TopicID" = p_topic_id
          AND tsa."Division" = public.current_staff_division()
    );
$$;

CREATE OR REPLACE FUNCTION public.can_access_topic(p_topic_id bigint)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF p_topic_id IS NULL THEN
        RETURN false;
    END IF;

    IF public.is_public_topic(p_topic_id) THEN
        RETURN true;
    END IF;

    IF auth.uid() IS NULL THEN
        RETURN false;
    END IF;

    IF public.is_admin() THEN
        RETURN true;
    END IF;

    IF public.is_staff() AND public.staff_can_access_topic(p_topic_id) THEN
        RETURN true;
    END IF;

    -- Students may load questions for all topics when filing a complaint.
    IF public.is_student() THEN
        RETURN true;
    END IF;

    RETURN false;
END;
$$;

CREATE OR REPLACE FUNCTION public.can_access_submission(p_submission_id bigint)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_topic_id bigint;
    v_student_id text;
BEGIN
    SELECT s."TopicID", s."StudentID"
    INTO v_topic_id, v_student_id
    FROM public.submission s
    WHERE s."SubmissionID" = p_submission_id;

    IF v_topic_id IS NULL THEN
        RETURN false;
    END IF;

    IF public.is_public_topic(v_topic_id) THEN
        RETURN true;
    END IF;

    IF auth.uid() IS NULL THEN
        RETURN false;
    END IF;

    IF public.is_admin() THEN
        RETURN true;
    END IF;

    IF public.is_student()
       AND v_student_id IS NOT NULL
       AND v_student_id = public.current_student_id() THEN
        RETURN true;
    END IF;

    IF public.is_staff() AND public.staff_can_access_topic(v_topic_id) THEN
        RETURN true;
    END IF;

    RETURN false;
END;
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_staff() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_student() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.current_student_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.current_staff_division() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.can_access_topic(bigint) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.can_access_submission(bigint) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_staff() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_student() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.current_student_id() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.current_staff_division() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.can_access_topic(bigint) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.can_access_submission(bigint) TO anon, authenticated, service_role;

-- topic
CREATE POLICY topic_select_all ON public.topic FOR SELECT USING (true);

-- question
CREATE POLICY question_select ON public.question
    FOR SELECT
    USING (public.can_access_topic("TopicID"));

-- submission
CREATE POLICY submission_select ON public.submission
    FOR SELECT
    USING (public.can_access_submission("SubmissionID"));

-- resolution
CREATE POLICY resolution_select ON public.resolution
    FOR SELECT
    USING (public.can_access_submission("SubmissionID"));

-- user_answer
CREATE POLICY user_answer_select ON public.user_answer
    FOR SELECT
    USING (public.can_access_submission("SubmissionID"));

-- student
CREATE POLICY student_select_own ON public.student
    FOR SELECT TO authenticated
    USING ("UUID" = auth.uid());

CREATE POLICY student_insert_own ON public.student
    FOR INSERT TO authenticated
    WITH CHECK (
        "UUID" = auth.uid()
        AND lower("Email") = lower(auth.jwt() ->> 'email')
        AND "StudentID" = (regexp_match(lower(auth.jwt() ->> 'email'), '^(\d{10})@g\.siit\.tu\.ac\.th$'))[1]
    );

CREATE POLICY student_update_own ON public.student
    FOR UPDATE TO authenticated
    USING ("UUID" = auth.uid())
    WITH CHECK ("UUID" = auth.uid());

-- staff
CREATE POLICY staff_select_by_email_or_uuid ON public.staff
    FOR SELECT TO authenticated
    USING (
        "UUID" = auth.uid()
        OR lower("Email") = lower(auth.jwt() ->> 'email')
    );

CREATE POLICY staff_link_account ON public.staff
    FOR UPDATE TO authenticated
    USING (
        lower("Email") = lower(auth.jwt() ->> 'email')
        AND ("UUID" IS NULL OR "UUID" = auth.uid())
    )
    WITH CHECK (
        "UUID" = auth.uid()
        AND lower("Email") = lower(auth.jwt() ->> 'email')
    );

-- admin
CREATE POLICY admin_select_own ON public.admin
    FOR SELECT TO authenticated
    USING ("UUID" = auth.uid());
