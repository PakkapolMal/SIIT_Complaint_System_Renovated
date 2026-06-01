-- Maps sensitive complaint topics to staff divisions allowed to view them.

CREATE TABLE IF NOT EXISTS public.topic_staff_access (
    "TopicID" bigint NOT NULL REFERENCES public.topic ("TopicID") ON DELETE CASCADE,
    "Division" text NOT NULL,
    PRIMARY KEY ("TopicID", "Division")
);

ALTER TABLE public.topic_staff_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY topic_staff_access_select_all
    ON public.topic_staff_access
    FOR SELECT
    USING (true);

INSERT INTO public.topic_staff_access ("TopicID", "Division") VALUES
    (1, 'Academic Affairs'),
    (2, 'Student Affairs')
ON CONFLICT DO NOTHING;
