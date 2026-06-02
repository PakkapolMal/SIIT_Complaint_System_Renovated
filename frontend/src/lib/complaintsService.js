import { supabase } from './supabaseClient';
import { getErrorMessage, toError } from './authErrors';

function throwIfError(error, fallback) {
  if (error) {
    throw toError(error, fallback);
  }
}

function formatDate(value) {
  if (!value) {
    return '';
  }

  return new Date(value).toISOString().slice(0, 10);
}

function mapSubmitterInfo(submission) {
  if (submission.StudentID) {
    const year = submission.student?.Year;
    const department = submission.student?.Department;
    if (year != null && department) {
      return `${year} - ${department}`;
    }
    return 'Student';
  }

  if (submission.StaffID) {
    return 'Staff';
  }

  return 'Unknown';
}

export async function fetchTopics() {
  const { data, error } = await supabase
    .from('topic')
    .select('*')
    .order('TopicID', { ascending: true });

  throwIfError(error, 'Failed to load topics.');
  return data ?? [];
}

export async function fetchQuestionsByTopic(topicId) {
  const { data, error } = await supabase
    .from('question')
    .select('*')
    .eq('TopicID', topicId)
    .order('QID', { ascending: true });

  throwIfError(error, 'Failed to load questions.');
  return data ?? [];
}

export async function fetchPublicSubmissions() {
  const { data, error } = await supabase
    .from('submission')
    .select(`
      SubmissionID,
      CreatedAt,
      Status,
      StudentID,
      StaffID,
      TopicID,
      topic:TopicID ( Tname ),
      student:StudentID ( Year, Department )
    `)
    .order('SubmissionID', { ascending: false });

  throwIfError(error, 'Failed to load submissions.');

  return (data ?? []).map((row) => ({
    SubmissionID: row.SubmissionID,
    Date: formatDate(row.CreatedAt),
    Status: row.Status,
    TopicName: row.topic?.Tname ?? 'Unknown',
    SubmitterInfo: mapSubmitterInfo(row),
  }));
}

export async function fetchUserHistory(studentId) {
  const { data, error } = await supabase
    .from('submission')
    .select(`
      SubmissionID,
      CreatedAt,
      Status,
      topic:TopicID ( Tname )
    `)
    .eq('StudentID', studentId)
    .order('SubmissionID', { ascending: false });

  throwIfError(error, 'Failed to load your complaint history.');

  return (data ?? []).map((row) => ({
    SubmissionID: row.SubmissionID,
    Date: formatDate(row.CreatedAt),
    Status: row.Status,
    TopicName: row.topic?.Tname ?? 'Unknown',
  }));
}

export async function fetchAdminSubmissions() {
  const { data, error } = await supabase
    .from('submission')
    .select(`
      SubmissionID,
      CreatedAt,
      Status,
      StudentID,
      StaffID,
      topic:TopicID ( Tname ),
      student:StudentID ( StudentName ),
      staff:StaffID ( StaffName )
    `)
    .order('SubmissionID', { ascending: false });

  throwIfError(error, 'Failed to load admin submissions.');

  return (data ?? []).map((row) => {
    const isStudentSubmission = Boolean(row.StudentID);
    return {
      SubmissionID: row.SubmissionID,
      Date: formatDate(row.CreatedAt),
      Status: row.Status,
      TopicName: row.topic?.Tname ?? 'Unknown',
      SubmitterName: isStudentSubmission
        ? row.student?.StudentName ?? 'Student'
        : row.staff?.StaffName ?? 'Staff',
      SubmitterRole: isStudentSubmission ? 'Student' : 'Staff',
    };
  });
}

export async function fetchSubmissionDetails(submissionId) {
  const { data: submission, error: submissionError } = await supabase
    .from('submission')
    .select(`
      SubmissionID,
      CreatedAt,
      Status,
      StudentID,
      StaffID,
      topic:TopicID ( Tname ),
      student:StudentID ( StudentName ),
      staff:StaffID ( StaffName )
    `)
    .eq('SubmissionID', submissionId)
    .maybeSingle();

  throwIfError(submissionError, 'Failed to load submission.');

  if (!submission) {
    return null;
  }

  const { data: answers, error: answersError } = await supabase
    .from('user_answer')
    .select(`
      AnswerText,
      AnsURL,
      question:QID ( QText )
    `)
    .eq('SubmissionID', submissionId)
    .order('UAID', { ascending: true });

  throwIfError(answersError, 'Failed to load submission answers.');

  const { data: resolution, error: resolutionError } = await supabase
    .from('resolution')
    .select(`
      ResAt,
      ResText,
      ResURL,
      staff:StaffID ( StaffName )
    `)
    .eq('SubmissionID', submissionId)
    .order('ResAt', { ascending: false })
    .limit(1)
    .maybeSingle();

  throwIfError(resolutionError, 'Failed to load resolution.');

  const isStudentSubmission = Boolean(submission.StudentID);

  return {
    details: {
      SubmissionID: submission.SubmissionID,
      Date: formatDate(submission.CreatedAt),
      Status: submission.Status,
      TopicName: submission.topic?.Tname ?? 'Unknown',
      SubmitterName: isStudentSubmission
        ? submission.student?.StudentName ?? 'Student'
        : submission.staff?.StaffName ?? 'Staff',
      SubmitterRole: isStudentSubmission ? 'Student' : 'Staff',
    },
    answers: (answers ?? []).map((row) => ({
      QText: row.question?.QText ?? '',
      AnswerText: row.AnswerText,
      AnsURL: row.AnsURL,
    })),
    resolution: resolution
      ? {
          ResDate: formatDate(resolution.ResAt),
          ResText: resolution.ResText,
          AttachmentPath: resolution.ResURL,
          AdminName: resolution.staff?.StaffName ?? 'Administrator',
        }
      : null,
  };
}

async function uploadEvidenceFile(submissionId, questionId, file) {
  const extension = file.name.includes('.') ? file.name.split('.').pop() : 'bin';
  const objectPath = `${submissionId}/${questionId}_${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from('complaint-evidence')
    .upload(objectPath, file, { upsert: false });

  throwIfError(uploadError, 'Failed to upload attachment.');

  const { data } = supabase.storage.from('complaint-evidence').getPublicUrl(objectPath);
  return data.publicUrl;
}

async function uploadResolutionFile(submissionId, file) {
  const extension = file.name.includes('.') ? file.name.split('.').pop() : 'bin';
  const objectPath = `${submissionId}/resolution_${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from('resolution-attachments')
    .upload(objectPath, file, { upsert: false });

  throwIfError(uploadError, 'Failed to upload resolution attachment.');

  const { data } = supabase.storage.from('resolution-attachments').getPublicUrl(objectPath);
  return data.publicUrl;
}

export async function submitComplaint({ topicId, answers, files }) {
  const { data: submissionId, error: submissionError } = await supabase.rpc('create_submission', {
    p_topic_id: Number(topicId),
  });

  throwIfError(submissionError, 'Failed to create submission.');

  if (!submissionId) {
    throw new Error('Failed to create submission.');
  }

  for (const answer of answers) {
    let answerText = answer.text ?? '';
    let ansUrl = null;

    if (answer.isFile && files[answer.qid]) {
      ansUrl = await uploadEvidenceFile(submissionId, answer.qid, files[answer.qid]);
      answerText = files[answer.qid].name;
    }

    const { error: answerError } = await supabase.rpc('create_user_answer', {
      p_submission_id: submissionId,
      p_qid: Number(answer.qid),
      p_answer_text: answerText,
      p_ans_url: ansUrl,
    });

    throwIfError(answerError, 'Failed to save complaint answers.');
  }

  return submissionId;
}

export async function submitResolution({ submissionId, staffId, resText, status, attachment }) {
  let resUrl = null;

  if (attachment) {
    resUrl = await uploadResolutionFile(submissionId, attachment);
  }

  const { error: resolutionError } = await supabase
    .from('resolution')
    .insert({
      SubmissionID: Number(submissionId),
      StaffID: staffId,
      ResText: resText,
      ResURL: resUrl,
    });

  throwIfError(resolutionError, 'Failed to save resolution.');

  const { error: statusError } = await supabase
    .from('submission')
    .update({ Status: status })
    .eq('SubmissionID', submissionId);

  throwIfError(statusError, 'Failed to update submission status.');
}

export async function deleteSubmission(submissionId) {
  const { error } = await supabase
    .from('submission')
    .delete()
    .eq('SubmissionID', submissionId);

  throwIfError(error, 'Failed to delete submission.');
}

export { getErrorMessage };
