-- Reference data for local development and fresh environments.

INSERT INTO public.topic ("TopicID", "Tname") OVERRIDING SYSTEM VALUE VALUES
    (1, 'Academics'),
    (2, 'Physical or Mental Abusements'),
    (3, 'Area, Facilities, Amenities, and Welfare'),
    (4, 'Faculty Systems and Staff Contact'),
    (5, 'Follow ups, Updates, and News')
ON CONFLICT ("TopicID") DO NOTHING;

SELECT setval(pg_get_serial_sequence('public.topic', 'TopicID'), (SELECT COALESCE(MAX("TopicID"), 1) FROM public.topic));

INSERT INTO public.question ("QID", "QText", "TopicID") OVERRIDING SYSTEM VALUE VALUES
    (101, 'Issues CHECKBOX:Teaching method is not conducive to learning|Examination Misconduct|Unfair, Unclear Grading, Lack of Grade Transparency|Excessive Workload|Lack/Unclear Communication|Difficulty accessing learning material', 1),
    (102, 'Course Code, Section, Respective Professor (for accuracy to follow up)', 1),
    (103, 'State an approximate time frame and how often do you face this issue?', 1),
    (104, 'Describe the details of the issue', 1),
    (105, 'Describe the effects that this issue has created', 1),
    (106, 'Would you like to require any additional help or specific actions regarding the issue(s)?', 1),
    (107, 'Attach additional evidence (If any) FILE:', 1),
    (201, 'Issues CHECKBOX:SOTUS practices or Abuse of Power|Physical and/or Mental Threats/Assault|Bullying|Sexual Harassment|Discrimination against ones sex/ethnicity/religion|Sharing of Confidential Information without Consent (PDPA)|Unfair Treatment', 2),
    (202, 'Describe problem details', 2),
    (203, 'Time frame and frequency of the issue(s)', 2),
    (204, 'Person(s) involved (If any)', 2),
    (205, 'Attach additional evidence (If any) FILE:', 2),
    (206, 'Would you like to require any additional help or specific actions regarding the issue(s)?', 2),
    (207, 'What is your preferred contact (Phone or Email) for follow-up? (This will remain confidential)', 2),
    (301, 'Issues CHECKBOX:Faulty Facility/Equipment|Cleanliness|Safety|Rules and regulations of the area', 3),
    (302, 'Location DROPDOWN:SIIT Main Building, Rangsit|SIIT Edutivity Building, Rangsit|SIIT Advance Lab Building, Rangsit|SIIT Sirintharalai Building, Bangkadi|SIIT MT&IT Building, Bangkadi', 3),
    (303, 'Details of the specific location (e.g., Floor, Room, or the specific part of the room)', 3),
    (304, 'Time frame of discovering the issue(s)', 3),
    (305, 'Describe problem details', 3),
    (306, 'Attach additional evidence (If any) FILE:', 3),
    (401, 'Issues CHECKBOX:Accessing faculty websites|Contacting staff/faculty departments|Class registration|Scholarship Inquiry|Requesting documents|General Inquiry|Faculty parking space', 4),
    (402, 'State an approximate time frame and how often do you face this issue?', 4),
    (403, 'Describe problem details', 4),
    (404, 'Attach additional evidence (If any) FILE:', 4),
    (405, 'Would you like to require any additional help or specific actions regarding the issue(s)?', 4),
    (501, 'Issues * CHECKBOX:Publicity of news and updates|Updates and news not update to date|Difficulty following updates|Incomplete/Incorrect updates and news|Other issues regarding updates and news', 5),
    (502, 'Describe the details of the issue(s) *', 5),
    (503, 'Attach additional evidence (If any) FILE:', 5),
    (504, 'Would you like to require any additional help or specific actions regarding the issue(s)?', 5)
ON CONFLICT ("QID") DO NOTHING;

SELECT setval(pg_get_serial_sequence('public.question', 'QID'), (SELECT COALESCE(MAX("QID"), 1) FROM public.question));

-- Pre-seeded staff (UUID linked on first Google login via Email match)
INSERT INTO public.staff ("StaffID", "Division", "StaffName", "Email") VALUES
    ('101', 'Academic Services and Registration Division', 'Academic Services Staff', 'academic.affairs@siit.tu.ac.th'),
    ('102', 'Student Affairs and Alumni Relations Division (SA&AR)', 'Student Affairs Staff', 'student.affairs@siit.tu.ac.th'),
    ('103', 'Building and Ground Division (BG)', 'Building Staff', 'building@siit.tu.ac.th'),
    ('104', 'ALL', 'General Staff', 'registration@siit.tu.ac.th'),
    ('105', 'Admission and Public Relations Division (AD&PR)', 'Admissions Staff', 'finance@siit.tu.ac.th')
ON CONFLICT ("StaffID") DO NOTHING;
