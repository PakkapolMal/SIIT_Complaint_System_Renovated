-- Topic 4 is shared by all staff divisions; "ALL" is not a selectable division.

DELETE FROM public.topic_staff_access
WHERE "Division" = 'ALL'
   OR ("TopicID" = 4 AND "Division" = 'Other');

UPDATE public.staff
SET "Division" = 'Other'
WHERE "Division" = 'ALL';

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
           'Admission and Public Relations Division (AD&PR)',
           'Other'
       );
$$;

CREATE OR REPLACE FUNCTION public.staff_can_access_topic(p_topic_id bigint)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.staff_division_allowed(public.current_staff_division())
       AND (
           p_topic_id = 4
           OR EXISTS (
               SELECT 1
               FROM public.topic_staff_access tsa
               WHERE tsa."TopicID" = p_topic_id
                 AND tsa."Division" = public.current_staff_division()
           )
       );
$$;
