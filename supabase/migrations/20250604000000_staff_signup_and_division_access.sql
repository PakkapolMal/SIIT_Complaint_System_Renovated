-- Staff self-signup, division-based topic access, and anonymous-only public topic reads

-- ---------------------------------------------------------------------------
-- Division → topic mapping (manage complaints)
-- ---------------------------------------------------------------------------
DELETE FROM public.topic_staff_access;

INSERT INTO public.topic_staff_access ("TopicID", "Division") VALUES
    (1, 'Academic Services and Registration Division'),
    (2, 'Student Affairs and Alumni Relations Division (SA&AR)'),
    (3, 'Building and Ground Division (BG)'),
    (4, 'ALL'),
    (4, 'Other'),
    (5, 'Admission and Public Relations Division (AD&PR)');

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.staff_division_allowed(p_division text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT p_division IS NOT NULL
       AND p_division IN (
           'Academic Services and Registration Division',
           'Student Affairs and Alumni Relations Division (SA&AR)',
           'Building and Ground Division (BG)',
           'ALL',
           'Admission and Public Relations Division (AD&PR)',
           'Other'
       );
$$;

REVOKE ALL ON FUNCTION public.staff_division_allowed(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.staff_division_allowed(text) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.is_staff_email_from_jwt()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
    SELECT lower(coalesce(auth.jwt() ->> 'email', '')) LIKE '%@siit.tu.ac.th'
       AND lower(coalesce(auth.jwt() ->> 'email', '')) NOT LIKE '%@g.siit.tu.ac.th';
$$;

REVOKE ALL ON FUNCTION public.is_staff_email_from_jwt() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_staff_email_from_jwt() TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.generate_staff_id_from_email(p_email text)
RETURNS text
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_local text;
    v_base text;
    v_candidate text;
    v_suffix integer := 0;
BEGIN
    v_local := split_part(lower(trim(p_email)), '@', 1);
    v_base := regexp_replace(v_local, '[^a-z0-9]', '', 'g');

    IF v_base = '' OR length(v_base) < 3 THEN
        v_base := 'staff';
    END IF;

    v_base := left(v_base, 12);

    LOOP
        IF v_suffix = 0 THEN
            v_candidate := 'STF-' || v_base;
        ELSE
            v_candidate := 'STF-' || v_base || v_suffix::text;
        END IF;

        EXIT WHEN NOT EXISTS (
            SELECT 1
            FROM public.staff s
            WHERE s."StaffID" = v_candidate
              AND lower(s."Email") <> lower(trim(p_email))
        );

        v_suffix := v_suffix + 1;

        IF v_suffix > 99 THEN
            RAISE EXCEPTION 'Unable to generate unique staff ID';
        END IF;
    END LOOP;

    RETURN v_candidate;
END;
$$;

REVOKE ALL ON FUNCTION public.generate_staff_id_from_email(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.generate_staff_id_from_email(text) TO authenticated, service_role;

-- Staff only manage submissions for topics mapped to their division (anon public topics unchanged)
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

    IF auth.uid() IS NULL THEN
        RETURN public.is_public_topic(v_topic_id);
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

-- ---------------------------------------------------------------------------
-- Staff profile completion RPC
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.complete_staff_profile(p_division text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
DECLARE
    v_uid uuid;
    v_email text;
    v_staff_name text;
    v_staff_id text;
    v_existing_staff_id text;
BEGIN
    v_uid := auth.uid();

    IF v_uid IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    IF NOT public.is_staff_email_from_jwt() THEN
        RAISE EXCEPTION 'Only @siit.tu.ac.th staff accounts can complete this profile';
    END IF;

    IF NOT public.staff_division_allowed(p_division) THEN
        RAISE EXCEPTION 'Invalid division selection';
    END IF;

    v_email := lower(trim(auth.jwt() ->> 'email'));
    v_staff_name := coalesce(
        auth.jwt() -> 'user_metadata' ->> 'full_name',
        auth.jwt() -> 'user_metadata' ->> 'name',
        split_part(v_email, '@', 1)
    );

    SELECT s."StaffID"
    INTO v_existing_staff_id
    FROM public.staff s
    WHERE s."UUID" = v_uid
       OR lower(s."Email") = v_email
    LIMIT 1;

    IF v_existing_staff_id IS NOT NULL THEN
        UPDATE public.staff
        SET
            "UUID" = v_uid,
            "Division" = p_division,
            "StaffName" = coalesce(nullif(trim("StaffName"), ''), v_staff_name),
            "Email" = v_email
        WHERE "StaffID" = v_existing_staff_id
        RETURNING "StaffID" INTO v_staff_id;
    ELSE
        v_staff_id := public.generate_staff_id_from_email(v_email);

        INSERT INTO public.staff ("StaffID", "UUID", "Division", "StaffName", "Email")
        VALUES (v_staff_id, v_uid, p_division, v_staff_name, v_email);
    END IF;

    RETURN v_staff_id;
END;
$$;

REVOKE ALL ON FUNCTION public.complete_staff_profile(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.complete_staff_profile(text) TO authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Staff write policies (self-registration)
-- ---------------------------------------------------------------------------
CREATE POLICY staff_insert_own ON public.staff
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_staff_email_from_jwt()
        AND "UUID" = auth.uid()
        AND lower("Email") = lower(auth.jwt() ->> 'email')
        AND public.staff_division_allowed("Division")
    );

CREATE POLICY staff_update_own ON public.staff
    FOR UPDATE TO authenticated
    USING (
        "UUID" = auth.uid()
        OR (
            lower("Email") = lower(auth.jwt() ->> 'email')
            AND ("UUID" IS NULL OR "UUID" = auth.uid())
        )
    )
    WITH CHECK (
        "UUID" = auth.uid()
        AND lower("Email") = lower(auth.jwt() ->> 'email')
        AND public.staff_division_allowed("Division")
    );
