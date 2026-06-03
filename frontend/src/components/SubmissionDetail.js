import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import AppLayout from './layout/AppLayout';
import AuthenticatedLayout from './layout/AuthenticatedLayout';
import PublicNav from './layout/PublicNav';
import { fetchSubmissionDetails, getErrorMessage } from '../lib/complaintsService';
import ScalableImage from './ui/ScalableImage';
import { layout } from '../lib/designTokens';

function isImageSource(value) {
  if (!value) {
    return false;
  }

  return /\.(jpg|jpeg|png|webp|gif)$/i.test(value) || value.startsWith('http');
}

function SubmissionDetailContent({
  submission,
  answers,
  resolution,
  getStatusClass,
  onBack,
}) {
  return (
    <div className="mx-auto max-w-4xl">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 block text-primary transition-colors duration-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
      >
        &larr; Back to list
      </button>

      <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-foreground">
            Complaint #{submission.SubmissionID}
          </h1>
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(submission.Status)}`}
          >
            {submission.Status}
          </span>
        </div>
        <div className="flex flex-wrap justify-between gap-2 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Topic:</strong> {submission.TopicName}
          </p>
          <p>
            <strong className="text-foreground">Date submitted:</strong> {submission.Date}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-6 border-b border-border pb-2 text-2xl font-bold text-foreground">
          Submission details
        </h2>
        <div className="space-y-6">
          {answers.map((answer, index) => {
            let label = answer.QText;
            if (label.includes('DROPDOWN:')) {
              label = label.split('DROPDOWN:')[0].trim();
            } else if (label.includes('CHECKBOX:')) {
              label = label.split('CHECKBOX:')[0].trim();
            } else if (label.includes('FILE:')) {
              label = label.split('FILE:')[0].trim();
            }

            const imageSrc =
              answer.AnsURL ||
              (isImageSource(answer.AnswerText) ? answer.AnswerText : null);

            return (
              <div key={index} className="rounded-md border border-border bg-muted/30 p-4">
                <p className="mb-2 text-sm font-semibold text-foreground">{label}</p>
                {imageSrc ? (
                  <ScalableImage
                    src={imageSrc}
                    alt={`Attachment for ${label}`}
                  />
                ) : (
                  <p className="whitespace-pre-wrap text-foreground">{answer.AnswerText}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {(submission.Status === 'Resolved' || submission.Status === 'In Progress') &&
        resolution && (
          <div className="mt-8 rounded-xl border border-border border-t-4 border-t-emerald-500 bg-card p-6 shadow-sm">
            <h2 className="mb-6 border-b border-border pb-2 text-2xl font-bold text-emerald-800">
              Official resolution
            </h2>
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-6">
              <p className="text-sm text-muted-foreground">
                Responded by:{' '}
                <strong className="font-semibold text-foreground">
                  {resolution.AdminName}
                </strong>{' '}
                on {resolution.ResDate}
              </p>
              <p className="mt-4 whitespace-pre-wrap text-foreground">
                {resolution.ResText}
              </p>
              {resolution.AttachmentPath && (
                <div className="mt-4">
                  <h4 className="mb-2 font-semibold text-foreground">Attachment:</h4>
                  {isImageSource(resolution.AttachmentPath) ? (
                    <ScalableImage
                      src={resolution.AttachmentPath}
                      alt="Resolution attachment"
                    />
                  ) : (
                    <a
                      href={resolution.AttachmentPath}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary transition-colors duration-200 hover:underline"
                    >
                      View attachment
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
}

const SubmissionDetail = ({ embedded = false }) => {
  const { submissionID } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [submission, setSubmission] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [resolution, setResolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubmissionDetails(submissionID)
      .then((data) => {
        if (!data) {
          setError('Submission not found.');
          return;
        }

        setSubmission(data.details);
        setAnswers(data.answers);
        setResolution(data.resolution);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [submissionID]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-900';
      case 'In Progress':
        return 'bg-blue-100 text-blue-900';
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-900';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const wrapLayout = (children) => {
    if (embedded) {
      return children;
    }

    if (isAuthenticated) {
      return (
        <AuthenticatedLayout mainClassName="p-4 sm:p-8">
          <div className={layout.container}>{children}</div>
        </AuthenticatedLayout>
      );
    }

    return (
      <AppLayout headerRight={<PublicNav page="home" />} homeTo="/">
        <div className={layout.container}>
          <div className="py-8 sm:py-10 lg:py-12">{children}</div>
        </div>
      </AppLayout>
    );
  };

  if (loading) {
    return wrapLayout(
      <p className="flex min-h-[40vh] items-center justify-center text-lg text-muted-foreground">
        Loading complaint details...
      </p>
    );
  }

  if (error) {
    return wrapLayout(
      <p className="p-8 text-center text-lg text-destructive" role="alert">
        Error: {error}
      </p>
    );
  }

  if (!submission) {
    return wrapLayout(
      <p className="p-8 text-center text-lg text-muted-foreground">No submission found.</p>
    );
  }

  return wrapLayout(
    <SubmissionDetailContent
      submission={submission}
      answers={answers}
      resolution={resolution}
      getStatusClass={getStatusClass}
      onBack={() => navigate(-1)}
    />
  );
};

export default SubmissionDetail;
