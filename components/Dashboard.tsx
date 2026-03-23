import React, { useEffect, useMemo, useState } from 'react';
import { CAREER_COUNTRY_OPTIONS, CAREER_POSITION_OPTIONS } from '../lib/careerOptions';
import { EMAILJS_DEFAULT_SERVICE_ID, sendEmailJs } from '../lib/emailjsClient';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

type DashboardRow = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  gender: string;
  age: number;
  phone_country_code: string;
  phone_number: string;
  email: string;
  position_applied: string;
  country: string;
  current_address: string;
  cv_bucket: string;
  cv_path: string;
  source: string;
  remarks: string;
};

type ContactMessageRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  message: string;
  source: string;
};

type DrawerState =
  | { kind: 'application'; row: DashboardRow }
  | { kind: 'contact'; row: ContactMessageRow };

type HiringStage = 'cv_check' | 'ai_interview' | 'face_to_face';
type HiringProgress = { stage: HiringStage; hired: boolean; rejected: boolean };
type CvPreviewState = {
  row: DashboardRow;
  status: 'loading' | 'ready' | 'error';
  url: string | null;
};
type ManualApplicantFormState = {
  firstName: string;
  lastName: string;
  gender: '' | 'Female' | 'Male' | 'Non-binary' | 'Prefer not to say';
  age: string;
  phoneCountryCode: string;
  phoneNumber: string;
  email: string;
  positionApplied: string;
  country: string;
  currentAddress: string;
  cvFile: File | null;
};
type ManualApplicantSubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'error'; message: string };

const createEmptyManualApplicantForm = (): ManualApplicantFormState => ({
  firstName: '',
  lastName: '',
  gender: '',
  age: '',
  phoneCountryCode: '+63',
  phoneNumber: '',
  email: '',
  positionApplied: '',
  country: '',
  currentAddress: '',
  cvFile: null,
});

const hasApplicantCv = (row: DashboardRow) => Boolean(row.cv_bucket?.trim() && row.cv_path?.trim());
const REMARKS_STORAGE_PREFIX = 'lw_admin_applicant_remarks_';

const readLocalApplicantRemarks = (id: string) => {
  try {
    return window.localStorage.getItem(`${REMARKS_STORAGE_PREFIX}${id}`) ?? '';
  } catch {
    return '';
  }
};

const writeLocalApplicantRemarks = (id: string, remarks: string) => {
  try {
    window.localStorage.setItem(`${REMARKS_STORAGE_PREFIX}${id}`, remarks);
  } catch {
    // ignore
  }
};

const removeLocalApplicantRemarks = (id: string) => {
  try {
    window.localStorage.removeItem(`${REMARKS_STORAGE_PREFIX}${id}`);
  } catch {
    // ignore
  }
};

const normalizeDashboardRow = (row: Partial<DashboardRow> & { id: string }) =>
  ({
    ...row,
    remarks:
      Object.prototype.hasOwnProperty.call(row, 'remarks') && typeof row.remarks === 'string'
        ? row.remarks
        : readLocalApplicantRemarks(row.id),
  }) as DashboardRow;

const isMissingRemarksColumnError = (message?: string | null) =>
  typeof message === 'string' &&
  message.toLowerCase().includes("could not find the 'remarks' column of 'career_applications'");

const adminEmailList = (import.meta.env.VITE_ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const isAdminEmail = (email?: string | null) => {
  if (!email) return false;
  if (adminEmailList.length === 0) return false;
  return adminEmailList.includes(email.toLowerCase());
};

const Dashboard: React.FC = () => {
  const [rows, setRows] = useState<DashboardRow[]>([]);
  const [contactRows, setContactRows] = useState<ContactMessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'dashboard' | 'applications' | 'contacts'>('dashboard');
  const [drawer, setDrawer] = useState<DrawerState | null>(null);
  const [cvPreview, setCvPreview] = useState<CvPreviewState | null>(null);
  const [isAddApplicantOpen, setIsAddApplicantOpen] = useState(false);
  const [manualApplicantForm, setManualApplicantForm] = useState<ManualApplicantFormState>(createEmptyManualApplicantForm);
  const [manualApplicantStatus, setManualApplicantStatus] = useState<ManualApplicantSubmitState>({ status: 'idle' });
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [remarksDraft, setRemarksDraft] = useState('');
  const [remarksStatus, setRemarksStatus] = useState<
    | { state: 'idle' }
    | { state: 'saving' }
    | { state: 'saved'; message: string }
    | { state: 'error'; message: string }
  >({ state: 'idle' });
  const [hiringProgress, setHiringProgress] = useState<HiringProgress>({ stage: 'cv_check', hired: false, rejected: false });
  const [progressVersion, setProgressVersion] = useState(0);
  const [emailStatus, setEmailStatus] = useState<
    | { state: 'idle' }
    | { state: 'sending' }
    | { state: 'sent'; message: string }
    | { state: 'error'; message: string }
  >({ state: 'idle' });
  const [interviewType, setInterviewType] = useState<'Online Interview' | 'Face-to-face Interview'>('Online Interview');
  const [interviewDateTime, setInterviewDateTime] = useState('');
  const [interviewTimezone, setInterviewTimezone] = useState('');
  const [interviewLocation, setInterviewLocation] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [rejectionNote, setRejectionNote] = useState(
    "Thank you for your time and interest in Lifewood. After careful consideration, we won't be moving forward at this time. We encourage you to apply again for future roles that match your skills."
  );
  const genderOptions = useMemo(() => ['Female', 'Male', 'Non-binary', 'Prefer not to say'] as const, []);
  const phoneCountryCodes = useMemo(
    () => [
      { label: '+63 (Philippines)', value: '+63' },
      { label: '+1 (USA/Canada)', value: '+1' },
      { label: '+61 (Australia)', value: '+61' },
      { label: '+44 (UK)', value: '+44' },
      { label: '+65 (Singapore)', value: '+65' },
      { label: '+81 (Japan)', value: '+81' },
      { label: '+971 (UAE)', value: '+971' },
    ],
    []
  );
  const positionOptions = useMemo(() => [...CAREER_POSITION_OPTIONS], []);
  const countryOptions = useMemo(() => [...CAREER_COUNTRY_OPTIONS], []);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const haystack = [r.first_name, r.last_name, r.email, r.position_applied, r.country, r.phone_number]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, rows]);

  const filteredContactRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contactRows;
    return contactRows.filter((r) => {
      const haystack = [r.name, r.email, r.message].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [contactRows, query]);

  const canSubmitManualApplicant = useMemo(() => {
    const ageNumber = Number(manualApplicantForm.age);
    const ageValid = Number.isFinite(ageNumber) && ageNumber >= 16 && ageNumber <= 99;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(manualApplicantForm.email.trim());
    const phoneValid = manualApplicantForm.phoneNumber.trim().length >= 6;
    return Boolean(
      manualApplicantForm.firstName.trim() &&
        manualApplicantForm.lastName.trim() &&
        manualApplicantForm.gender &&
        ageValid &&
        phoneValid &&
        emailValid &&
        manualApplicantForm.positionApplied &&
        manualApplicantForm.country &&
        manualApplicantForm.currentAddress.trim() &&
        manualApplicantStatus.status !== 'submitting'
    );
  }, [manualApplicantForm, manualApplicantStatus.status]);

  const pad2 = (n: number) => String(n).padStart(2, '0');
  const dateKey = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

  const isToday = (isoDate: string) => {
    const created = new Date(isoDate);
    const now = new Date();
    return (
      created.getFullYear() === now.getFullYear() &&
      created.getMonth() === now.getMonth() &&
      created.getDate() === now.getDate()
    );
  };

  const todayApplications = useMemo(() => rows.filter((r) => isToday(r.created_at)).length, [rows]);
  const todayContacts = useMemo(() => contactRows.filter((r) => isToday(r.created_at)).length, [contactRows]);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(() => dateKey(new Date()));
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const hiringStages = useMemo(
    () =>
      [
        { key: 'cv_check' as const, label: 'CV Check' },
        { key: 'ai_interview' as const, label: 'Online Interview' },
        { key: 'face_to_face' as const, label: 'Face-to-face Interview' },
      ] satisfies Array<{ key: HiringStage; label: string }>,
    []
  );

  const drawerApplicationId = drawer?.kind === 'application' ? drawer.row.id : null;

  useEffect(() => {
    if (interviewTimezone) return;
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setInterviewTimezone(tz || 'UTC');
    } catch {
      setInterviewTimezone('UTC');
    }
  }, [interviewTimezone]);

  useEffect(() => {
    setEmailStatus({ state: 'idle' });
    setInterviewDateTime('');
    setInterviewLocation('');
    setInterviewNotes('');
    setInterviewType('Online Interview');
  }, [drawerApplicationId]);

  useEffect(() => {
    if (drawer?.kind === 'application') {
      setRemarksDraft(drawer.row.remarks ?? '');
    } else {
      setRemarksDraft('');
    }
    setRemarksStatus({ state: 'idle' });
  }, [drawer]);

  useEffect(() => {
    if (!drawerApplicationId) {
      setHiringProgress({ stage: 'cv_check', hired: false, rejected: false });
      return;
    }

    try {
      const raw = window.localStorage.getItem(`lw_admin_hiring_progress_${drawerApplicationId}`);
      if (!raw) {
        setHiringProgress({ stage: 'cv_check', hired: false, rejected: false });
        return;
      }

      const parsed = JSON.parse(raw) as Partial<HiringProgress> | null;
      const stageOk = parsed?.stage && hiringStages.some((s) => s.key === parsed.stage);
      const hiredOk = typeof parsed?.hired === 'boolean';
      const rejectedOk = typeof (parsed as any)?.rejected === 'boolean';

      if (stageOk && hiredOk) {
        setHiringProgress({
          stage: parsed.stage as HiringStage,
          hired: parsed.hired as boolean,
          rejected: rejectedOk ? ((parsed as any).rejected as boolean) : false,
        });
        return;
      }
    } catch {
      // ignore
    }

    setHiringProgress({ stage: 'cv_check', hired: false, rejected: false });
  }, [drawerApplicationId, hiringStages]);

  const persistHiringProgress = (next: HiringProgress) => {
    setHiringProgress(next);
    if (!drawerApplicationId) return;
    try {
      window.localStorage.setItem(`lw_admin_hiring_progress_${drawerApplicationId}`, JSON.stringify(next));
      setProgressVersion((v) => v + 1);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      if (!isSupabaseConfigured) {
        setError('Supabase is not configured.');
        setLoading(false);
        return;
      }

      const { data: sessionRes, error: sessionErr } = await supabase.auth.getSession();
      if (sessionErr) {
        setError(sessionErr.message);
        setLoading(false);
        return;
      }

      const user = sessionRes.session?.user ?? null;
      if (!user || !isAdminEmail(user.email)) {
        window.history.replaceState({}, '', '/login');
        window.dispatchEvent(new Event('popstate'));
        setLoading(false);
        return;
      }

      const appsRes = await supabase.from('career_applications').select('*').order('created_at', { ascending: false });
      if (appsRes.error) {
        setError(appsRes.error.message);
      } else {
        setRows(((appsRes.data ?? []) as Array<Partial<DashboardRow> & { id: string }>).map(normalizeDashboardRow));
      }

      const contactRes = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (contactRes.error) {
        setError((prev) => prev ?? contactRes.error!.message);
      } else {
        setContactRows((contactRes.data ?? []) as ContactMessageRow[]);
      }

      setLoading(false);
    };

    void run();
  }, []);

  const getSignedCvUrl = async (row: DashboardRow, options?: { download?: string | boolean }) => {
    if (!hasApplicantCv(row)) {
      setError('No CV uploaded for this applicant yet.');
      return null;
    }
    setError(null);
    const res = await supabase.storage.from(row.cv_bucket).createSignedUrl(row.cv_path, 60, options);
    if (res.error) {
      setError(res.error.message);
      return null;
    }
    return res.data?.signedUrl ?? null;
  };

  const onViewCv = async (row: DashboardRow) => {
    setCvPreview({ row, status: 'loading', url: null });
    const signedUrl = await getSignedCvUrl(row);
    if (signedUrl) {
      setCvPreview({ row, status: 'ready', url: signedUrl });
      return;
    }

    setCvPreview((current) =>
      current && current.row.id === row.id
        ? {
            ...current,
            status: 'error',
            url: null,
          }
        : current
    );
  };

  const closeCvPreview = () => {
    setCvPreview(null);
  };

  const onLogout = async () => {
    try {
      if (isSupabaseConfigured) await supabase.auth.signOut();
    } finally {
      window.history.pushState({}, '', '/');
      window.location.hash = '#/';
      window.dispatchEvent(new Event('popstate'));
    }
  };

  const onDeleteApplication = async (row: DashboardRow) => {
    const confirmed = window.confirm(`Remove application for ${row.first_name} ${row.last_name}?`);
    if (!confirmed) return;

    setError(null);
    setDeletingKey(`application:${row.id}`);
    try {
      const res = await supabase.from('career_applications').delete().eq('id', row.id);
      if (res.error) {
        setError(res.error.message);
        return;
      }

      setRows((current) => current.filter((item) => item.id !== row.id));
      if (drawer?.kind === 'application' && drawer.row.id === row.id) {
        setDrawer(null);
      }

      try {
        window.localStorage.removeItem(`lw_admin_hiring_progress_${row.id}`);
      } catch {
        // ignore
      }
      removeLocalApplicantRemarks(row.id);

      setProgressVersion((value) => value + 1);
    } finally {
      setDeletingKey(null);
    }
  };

  const onDeleteContact = async (row: ContactMessageRow) => {
    const confirmed = window.confirm(`Remove message from ${row.name}?`);
    if (!confirmed) return;

    setError(null);
    setDeletingKey(`contact:${row.id}`);
    try {
      const res = await supabase.from('contact_messages').delete().eq('id', row.id);
      if (res.error) {
        setError(res.error.message);
        return;
      }

      setContactRows((current) => current.filter((item) => item.id !== row.id));
      if (drawer?.kind === 'contact' && drawer.row.id === row.id) {
        setDrawer(null);
      }
    } finally {
      setDeletingKey(null);
    }
  };

  const onSaveApplicantRemarks = async () => {
    if (!drawer || drawer.kind !== 'application') return;

    setRemarksStatus({ state: 'saving' });
    setError(null);

    try {
      const nextRemarks = remarksDraft;
      const res = await supabase
        .from('career_applications')
        .update({ remarks: nextRemarks })
        .eq('id', drawer.row.id)
        .select('*')
        .single();

      if (res.error) {
        if (isMissingRemarksColumnError(res.error.message)) {
          writeLocalApplicantRemarks(drawer.row.id, nextRemarks);
          const updatedRow = normalizeDashboardRow({ ...drawer.row, remarks: nextRemarks });
          setRows((current) => current.map((item) => (item.id === updatedRow.id ? updatedRow : item)));
          setDrawer({ kind: 'application', row: updatedRow });
          setRemarksStatus({ state: 'saved', message: 'Remarks saved on this device.' });
          return;
        }
        setRemarksStatus({ state: 'error', message: res.error.message });
        return;
      }

      removeLocalApplicantRemarks(drawer.row.id);
      const updatedRow = normalizeDashboardRow(res.data as Partial<DashboardRow> & { id: string });
      setRows((current) => current.map((item) => (item.id === updatedRow.id ? updatedRow : item)));
      setDrawer({ kind: 'application', row: updatedRow });
      setRemarksStatus({ state: 'saved', message: 'Remarks saved.' });
    } catch (err) {
      setRemarksStatus({
        state: 'error',
        message: err instanceof Error ? err.message : 'Failed to save remarks.',
      });
    }
  };

  const closeAddApplicantModal = () => {
    setIsAddApplicantOpen(false);
    setManualApplicantStatus({ status: 'idle' });
    setManualApplicantForm(createEmptyManualApplicantForm());
  };

  const openAddApplicantModal = () => {
    setDrawer(null);
    setError(null);
    setManualApplicantStatus({ status: 'idle' });
    setIsAddApplicantOpen(true);
  };

  const onPickManualApplicantCv = (file: File | null) => {
    if (!file) {
      setManualApplicantForm((prev) => ({ ...prev, cvFile: null }));
      setManualApplicantStatus({ status: 'idle' });
      return;
    }

    const maxBytes = 10 * 1024 * 1024;
    const looksLikePdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!looksLikePdf) {
      setManualApplicantStatus({ status: 'error', message: 'CV must be a PDF file.' });
      return;
    }
    if (file.size > maxBytes) {
      setManualApplicantStatus({ status: 'error', message: 'CV file is too large (max 10MB).' });
      return;
    }

    setManualApplicantStatus({ status: 'idle' });
    setManualApplicantForm((prev) => ({ ...prev, cvFile: file }));
  };

  const onCreateManualApplicant = async (event: React.FormEvent) => {
    event.preventDefault();
    setManualApplicantStatus({ status: 'idle' });

    if (!isSupabaseConfigured) {
      setManualApplicantStatus({
        status: 'error',
        message: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to add applicants.',
      });
      return;
    }

    if (!canSubmitManualApplicant) {
      setManualApplicantStatus({ status: 'error', message: 'Please complete all required fields.' });
      return;
    }

    setManualApplicantStatus({ status: 'submitting' });
    setError(null);

    try {
      let cvBucket = '';
      let cvPath = '';

      if (manualApplicantForm.cvFile) {
        const safeName = manualApplicantForm.cvFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const random = crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        cvPath = `applications/${new Date().toISOString().slice(0, 10)}/manual-${random}-${safeName}`;
        cvBucket = 'career-cvs';

        const uploadRes = await supabase.storage.from(cvBucket).upload(cvPath, manualApplicantForm.cvFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'application/pdf',
        });
        if (uploadRes.error) throw uploadRes.error;
      }

      const insertRes = await supabase
        .from('career_applications')
        .insert({
          first_name: manualApplicantForm.firstName.trim(),
          last_name: manualApplicantForm.lastName.trim(),
          gender: manualApplicantForm.gender,
          age: Number(manualApplicantForm.age),
          phone_country_code: manualApplicantForm.phoneCountryCode,
          phone_number: manualApplicantForm.phoneNumber.trim(),
          email: manualApplicantForm.email.trim(),
          position_applied: manualApplicantForm.positionApplied,
          country: manualApplicantForm.country,
          current_address: manualApplicantForm.currentAddress.trim(),
          cv_bucket: cvBucket,
          cv_path: cvPath,
          source: manualApplicantForm.cvFile ? 'walk-in' : 'walk-in (no cv yet)',
        })
        .select('*')
        .single();
      if (insertRes.error) throw insertRes.error;

      const nextRow = normalizeDashboardRow(insertRes.data as Partial<DashboardRow> & { id: string });
      setRows((current) =>
        [nextRow, ...current].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      );
      setQuery('');
      closeAddApplicantModal();
      setDrawer({ kind: 'application', row: nextRow });
    } catch (err) {
      setManualApplicantStatus({
        status: 'error',
        message: err instanceof Error ? err.message : 'Failed to add applicant.',
      });
    }
  };

  const emailJsPublicKey = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '').trim();
  const emailJsServiceId =
    (import.meta.env.VITE_EMAILJS_SERVICE_ID ?? EMAILJS_DEFAULT_SERVICE_ID).trim() || EMAILJS_DEFAULT_SERVICE_ID;
  const emailJsTemplateHired = (import.meta.env.VITE_EMAILJS_TEMPLATE_HIRED ?? '').trim();
  const emailJsTemplateUpdate = (import.meta.env.VITE_EMAILJS_TEMPLATE_UPDATE ?? '').trim();
  const emailJsSupportEmail = adminEmailList[0] ?? 'hr@lifewood.com';

  const formatInterviewDateTime = (value: string) => {
    if (!value) return '';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const toEmailSubjectText = (value: string) =>
    value
      .replace(/[\/\\]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const sendHiredEmail = async () => {
    if (!drawer || drawer.kind !== 'application') return;
    if (!emailJsPublicKey) {
      setEmailStatus({ state: 'error', message: 'Missing VITE_EMAILJS_PUBLIC_KEY.' });
      return;
    }
    if (!emailJsTemplateHired) {
      setEmailStatus({ state: 'error', message: 'Missing VITE_EMAILJS_TEMPLATE_HIRED.' });
      return;
    }

    setEmailStatus({ state: 'sending' });
    try {
      await sendEmailJs({
        serviceId: emailJsServiceId,
        templateId: emailJsTemplateHired,
        publicKey: emailJsPublicKey,
        templateParams: {
          subject: `Congratulations, ${`${drawer.row.first_name} ${drawer.row.last_name}`.trim()} - Welcome to Lifewood`,
          to_email: drawer.row.email,
          candidate_name: `${drawer.row.first_name} ${drawer.row.last_name}`.trim(),
          position: drawer.row.position_applied,
          next_steps:
            'Please reply to this email to confirm your acceptance. Our team will follow up with your onboarding details and next steps.',
          support_email: emailJsSupportEmail,
          signature_name: 'Lifewood Talent Team',
          signature_title: 'Talent Acquisition',
        },
      });
      setEmailStatus({ state: 'sent', message: 'Hired email sent.' });
    } catch (err) {
      setEmailStatus({
        state: 'error',
        message: err instanceof Error ? err.message : 'Failed to send hired email.',
      });
    }
  };

  const sendInterviewScheduleEmail = async () => {
    if (!drawer || drawer.kind !== 'application') return;
    if (!emailJsPublicKey) {
      setEmailStatus({ state: 'error', message: 'Missing VITE_EMAILJS_PUBLIC_KEY.' });
      return;
    }
    if (!emailJsTemplateUpdate) {
      setEmailStatus({ state: 'error', message: 'Missing VITE_EMAILJS_TEMPLATE_UPDATE.' });
      return;
    }
    if (!interviewDateTime) {
      setEmailStatus({ state: 'error', message: 'Please set the interview date and time.' });
      return;
    }
    if (!interviewTimezone) {
      setEmailStatus({ state: 'error', message: 'Please set the interview timezone.' });
      return;
    }

    setEmailStatus({ state: 'sending' });
    try {
      const subjectPosition = toEmailSubjectText(drawer.row.position_applied);
      await sendEmailJs({
        serviceId: emailJsServiceId,
        templateId: emailJsTemplateUpdate,
        publicKey: emailJsPublicKey,
        templateParams: {
          subject: `${interviewType} scheduled for ${subjectPosition} at Lifewood`,
          to_email: drawer.row.email,
          candidate_name: `${drawer.row.first_name} ${drawer.row.last_name}`.trim(),
          position: drawer.row.position_applied,
          update_category: 'Interview',
          update_title: 'Interview Scheduled',
          update_message:
            'We would like to invite you to the next step of the Lifewood hiring process. Please review the interview details below.',
          interview_block_style: '',
          rejection_block_style: 'display:none;',
          action_block_style: 'display:none;',
          interview_type: interviewType,
          interview_datetime: formatInterviewDateTime(interviewDateTime),
          interview_timezone: interviewTimezone,
          interview_location: interviewLocation || 'To be shared by the team',
          interview_notes: interviewNotes || 'Please be available a few minutes before the scheduled time.',
          rejection_note: '',
          action_label: '',
          action_url: '',
          support_email: emailJsSupportEmail,
          signature_name: 'Lifewood Talent Team',
          signature_title: 'Talent Acquisition',
        },
      });
      setEmailStatus({ state: 'sent', message: 'Interview schedule email sent.' });
    } catch (err) {
      setEmailStatus({
        state: 'error',
        message: err instanceof Error ? err.message : 'Failed to send interview email.',
      });
    }
  };

  const sendRejectionEmail = async () => {
    if (!drawer || drawer.kind !== 'application') return;
    if (!emailJsPublicKey) {
      setEmailStatus({ state: 'error', message: 'Missing VITE_EMAILJS_PUBLIC_KEY.' });
      return;
    }
    if (!emailJsTemplateUpdate) {
      setEmailStatus({ state: 'error', message: 'Missing VITE_EMAILJS_TEMPLATE_UPDATE.' });
      return;
    }

    setEmailStatus({ state: 'sending' });
    try {
      const subjectPosition = toEmailSubjectText(drawer.row.position_applied);
      await sendEmailJs({
        serviceId: emailJsServiceId,
        templateId: emailJsTemplateUpdate,
        publicKey: emailJsPublicKey,
        templateParams: {
          subject: `Update on your Lifewood application for ${subjectPosition}`,
          to_email: drawer.row.email,
          candidate_name: `${drawer.row.first_name} ${drawer.row.last_name}`.trim(),
          position: drawer.row.position_applied,
          update_category: 'Application Update',
          update_title: 'Status Update',
          update_message: 'Thank you for your time and interest in Lifewood. Please review the update below.',
          interview_block_style: 'display:none;',
          rejection_block_style: '',
          action_block_style: 'display:none;',
          interview_type: '',
          interview_datetime: '',
          interview_timezone: '',
          interview_location: '',
          interview_notes: '',
          rejection_note: rejectionNote,
          action_label: '',
          action_url: '',
          support_email: emailJsSupportEmail,
          signature_name: 'Lifewood Talent Team',
          signature_title: 'Talent Acquisition',
        },
      });
      setEmailStatus({ state: 'sent', message: 'Rejection email sent.' });
    } catch (err) {
      setEmailStatus({
        state: 'error',
        message: err instanceof Error ? err.message : 'Failed to send rejection email.',
      });
    }
  };

  const resultsCount = loading
    ? null
    : view === 'applications'
      ? filteredRows.length
      : filteredContactRows.length;

  const getStoredHiringProgress = (applicationId: string): HiringProgress => {
    if (typeof window === 'undefined') return { stage: 'cv_check', hired: false, rejected: false };
    try {
      const raw = window.localStorage.getItem(`lw_admin_hiring_progress_${applicationId}`);
      if (!raw) return { stage: 'cv_check', hired: false, rejected: false };
      const parsed = JSON.parse(raw) as Partial<HiringProgress> | null;
      const stageOk = parsed?.stage && hiringStages.some((s) => s.key === parsed.stage);
      const hiredOk = typeof parsed?.hired === 'boolean';
      const rejectedOk = typeof (parsed as any)?.rejected === 'boolean';
      if (stageOk && hiredOk)
        return {
          stage: parsed.stage as HiringStage,
          hired: parsed.hired as boolean,
          rejected: rejectedOk ? ((parsed as any).rejected as boolean) : false,
        };
    } catch {
      // ignore
    }
    return { stage: 'cv_check', hired: false, rejected: false };
  };

  const dashboardApplicationStats = useMemo(() => {
    let cvCheck = 0;
    let aiInterview = 0;
    let faceToFace = 0;
    let hired = 0;
    let rejected = 0;

    rows.forEach((r) => {
      const p = getStoredHiringProgress(r.id);
      if (p.rejected) {
        rejected += 1;
        return;
      }
      if (p.hired) {
        hired += 1;
        return;
      }
      if (p.stage === 'ai_interview') aiInterview += 1;
      else if (p.stage === 'face_to_face') faceToFace += 1;
      else cvCheck += 1;
    });

    const shortlisted = aiInterview + faceToFace;

    return {
      total: rows.length,
      cvCheck,
      aiInterview,
      faceToFace,
      shortlisted,
      hired,
      rejected,
    };
  }, [rows, progressVersion]);

  const dailyApplications = useMemo(() => {
    const now = new Date();
    const dayKeys = Array.from({ length: 7 }, (_, idx) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - idx));
      return { key: dateKey(d), label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) };
    });

    const counts = new Map<string, { applied: number; shortlisted: number }>();
    rows.forEach((r) => {
      const key = dateKey(new Date(r.created_at));
      const progress = getStoredHiringProgress(r.id);
      const current = counts.get(key) ?? { applied: 0, shortlisted: 0 };
      const isShortlisted = !progress.rejected && (progress.stage === 'ai_interview' || progress.stage === 'face_to_face' || progress.hired);

      current.applied += 1;
      if (isShortlisted) current.shortlisted += 1;
      counts.set(key, current);
    });

    const series = dayKeys.map((d) => {
      const current = counts.get(d.key) ?? { applied: 0, shortlisted: 0 };
      return {
        ...d,
        applied: current.applied,
        shortlisted: current.shortlisted,
      };
    });

    const max = Math.max(10, ...series.map((s) => s.applied));
    return { series, max };
  }, [rows, progressVersion]);

  const dailyApplicationsAxis = useMemo(() => {
    const max = dailyApplications.max <= 10 ? 10 : Math.ceil(dailyApplications.max / 2) * 2;
    const step = max <= 10 ? 2 : Math.max(2, Math.ceil(max / 5));
    const ticks = Array.from({ length: Math.floor(max / step) + 1 }, (_, index) => max - index * step);
    return { ticks, max };
  }, [dailyApplications.max]);

  const selectedDateEntries = useMemo(() => {
    const applications = rows
      .filter((row) => dateKey(new Date(row.created_at)) === selectedCalendarDate)
      .map((row) => ({
        id: row.id,
        kind: 'application' as const,
        createdAt: row.created_at,
        title: `${row.first_name} ${row.last_name}`.trim(),
        subtitle: row.position_applied,
        meta: row.email,
        row,
      }));

    const contacts = contactRows
      .filter((row) => dateKey(new Date(row.created_at)) === selectedCalendarDate)
      .map((row) => ({
        id: row.id,
        kind: 'contact' as const,
        createdAt: row.created_at,
        title: row.name,
        subtitle: row.message,
        meta: row.email,
        row,
      }));

    return [...applications, ...contacts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [rows, contactRows, selectedCalendarDate]);

  const calendarRecordCounts = useMemo(() => {
    const counts = new Map<string, number>();
    rows.forEach((row) => {
      const key = dateKey(new Date(row.created_at));
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    contactRows.forEach((row) => {
      const key = dateKey(new Date(row.created_at));
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return counts;
  }, [rows, contactRows]);

  const calendarDays = useMemo(() => {
    const monthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const monthEnd = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0);
    const gridStart = new Date(monthStart);
    const startWeekday = (monthStart.getDay() + 6) % 7;
    const endWeekday = (monthEnd.getDay() + 6) % 7;
    const totalCells = Math.ceil((startWeekday + monthEnd.getDate() + (6 - endWeekday)) / 7) * 7;
    gridStart.setDate(monthStart.getDate() - startWeekday);

    return Array.from({ length: totalCells }, (_, index) => {
      const day = new Date(gridStart);
      day.setDate(gridStart.getDate() + index);
      const key = dateKey(day);
      return {
        key,
        dayNumber: day.getDate(),
        inMonth: day.getMonth() === calendarMonth.getMonth(),
        isToday: key === dateKey(new Date()),
        isSelected: key === selectedCalendarDate,
        count: calendarRecordCounts.get(key) ?? 0,
      };
    });
  }, [calendarMonth, calendarRecordCounts, selectedCalendarDate]);

  const calendarMonthLabel = useMemo(
    () =>
      calendarMonth.toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
      }),
    [calendarMonth]
  );

  type DonutSlice = { label: string; value: number; color: string };

  const toConicGradient = (slices: DonutSlice[]) => {
    const total = slices.reduce((sum, s) => sum + s.value, 0);
    if (total <= 0) return `conic-gradient(#F9F7F7 0 100%)`;

    let acc = 0;
    const parts: string[] = [];
    slices.forEach((s) => {
      const start = (acc / total) * 100;
      acc += s.value;
      const end = (acc / total) * 100;
      parts.push(`${s.color} ${start.toFixed(2)}% ${end.toFixed(2)}%`);
    });

    return `conic-gradient(${parts.join(', ')})`;
  };

  const positionBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    rows.forEach((r) => {
      const position = r.position_applied?.trim() || 'Unspecified Role';
      counts.set(position, (counts.get(position) ?? 0) + 1);
    });

    const orderedEntries = CAREER_POSITION_OPTIONS.map((position) => [position, counts.get(position) ?? 0] as const);
    const extraEntries = Array.from(counts.entries())
      .filter(([position]) => !CAREER_POSITION_OPTIONS.includes(position as (typeof CAREER_POSITION_OPTIONS)[number]))
      .sort((a, b) => b[1] - a[1]);
    const entries = [...orderedEntries, ...extraEntries];
    const palette = [
      'rgba(255,195,112,0.58)',
      '#FFC370',
      'rgba(255,179,71,0.78)',
      '#FFB347',
      'rgba(4,98,65,0.38)',
      'rgba(4,98,65,0.62)',
      '#046241',
      '#133020',
    ];
    const slices: DonutSlice[] = entries
      .filter(([, value]) => value > 0)
      .map(([label, value], idx) => ({
      label,
      value,
      color: palette[idx % palette.length],
      }));

    const total = slices.reduce((sum, s) => sum + s.value, 0);
    return {
      slices,
      total,
      gradient: toConicGradient(slices),
      legend: entries.map(([label, value], idx) => ({
        label,
        value,
        color: palette[idx % palette.length],
      })),
    };
  }, [rows]);

  const currentHiringStageIndex = useMemo(() => {
    const idx = hiringStages.findIndex((s) => s.key === hiringProgress.stage);
    return idx >= 0 ? idx : 0;
  }, [hiringStages, hiringProgress.stage]);

  const todayDateLabel = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    []
  );

  const renderSearch = (className: string) => (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder={view === 'applications' ? 'Search name, email, position...' : 'Search name, email, message...'}
      className={className}
    />
  );

  const navItemClass = (active: boolean) =>
    [
      'h-10 px-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-colors',
      active
        ? 'bg-[#FFB347] text-[#133020] border-[#FFC370]/50'
        : 'bg-[#046241]/15 text-[#F9F7F7]/85 border-[#F9F7F7]/10 hover:bg-[#046241]/25',
    ].join(' ');

  const renderSelectedDateSection = () => (
    <div className="rounded-2xl bg-[#F5EEDB] text-[#133020] border border-[#133020]/10 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-black">Selected Date</div>
          <div className="mt-1 text-lg font-black">
            {new Date(`${selectedCalendarDate}T00:00:00`).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
        <div className="inline-flex items-center h-10 px-4 rounded-2xl bg-[#FFB347] text-[#133020] text-[10px] font-black uppercase tracking-widest">
          {selectedDateEntries.length} records
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {selectedDateEntries.length === 0 ? (
          <div className="lg:col-span-2 xl:col-span-3 rounded-2xl border border-[#133020]/10 bg-white/60 px-4 py-5 text-sm font-bold text-[#133020]/55">
            No applications or contact messages on this date.
          </div>
        ) : (
          selectedDateEntries.map((entry) => (
            <button
              key={`${entry.kind}-${entry.id}`}
              type="button"
              onClick={() =>
                setDrawer(
                  entry.kind === 'application'
                    ? { kind: 'application', row: entry.row }
                    : { kind: 'contact', row: entry.row }
                )
              }
              className="w-full rounded-2xl border border-[#133020]/10 bg-white/70 hover:bg-white text-left px-4 py-4 transition-colors"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={[
                        'inline-flex items-center h-6 px-2 rounded-2xl text-[10px] font-black uppercase tracking-widest',
                        entry.kind === 'application'
                          ? 'bg-[#046241]/12 text-[#046241]'
                          : 'bg-[#FFB347]/20 text-[#133020]',
                      ].join(' ')}
                    >
                      {entry.kind === 'application' ? 'Application' : 'Contact'}
                    </span>
                    <span className="text-[11px] font-bold text-[#133020]/45">
                      {new Date(entry.createdAt).toLocaleTimeString(undefined, {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-black truncate">{entry.title}</div>
                  <div className="mt-1 text-sm text-[#133020]/70 overflow-hidden text-ellipsis whitespace-nowrap">
                    {entry.subtitle}
                  </div>
                </div>
                <div className="text-xs font-bold text-[#133020]/55 break-all">{entry.meta}</div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );

  return (
    <section data-no-reveal className="min-h-screen bg-[#133020] text-[#F9F7F7]">
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 bg-[#133020]/80 backdrop-blur-xl">
          <div className="max-w-[1440px] mx-auto w-full px-6 pt-4 pb-4 flex flex-col">
            <div className="flex items-center pb-3">
              <img
                src="https://framerusercontent.com/images/Ca8ppNsvJIfTsWEuHr50gvkDow.png?scale-down-to=512&width=2624&height=474"
                alt="Lifewood Logo"
                className="h-8 w-auto"
              />
            </div>

            <div className="h-px w-full bg-[#F9F7F7]/10" />

            <div className="flex items-center justify-between gap-3 pt-3">
              <nav className="hidden md:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setView('dashboard');
                    setDrawer(null);
                  }}
                  className={navItemClass(view === 'dashboard')}
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setView('applications');
                    setDrawer(null);
                  }}
                  className={navItemClass(view === 'applications')}
                >
                  Applications ({rows.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setView('contacts');
                    setDrawer(null);
                  }}
                  className={navItemClass(view === 'contacts')}
                >
                  Contact ({contactRows.length})
                </button>
              </nav>

              <div className="md:hidden">
                <select
                  value={view}
                  onChange={(e) => {
                    setView(e.target.value as typeof view);
                    setDrawer(null);
                  }}
                  className="h-10 rounded-2xl bg-[#046241]/20 text-[#F9F7F7] border border-[#F9F7F7]/10 px-3 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#FFB347]/60"
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="applications">Applications</option>
                  <option value="contacts">Contact</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                {view !== 'dashboard' ? (
                  <div className="hidden sm:block">
                    {renderSearch(
                      'h-11 w-[360px] rounded-2xl bg-[#046241]/20 text-[#F9F7F7] placeholder:text-[#F9F7F7]/55 border border-[#F9F7F7]/10 px-4 outline-none focus:ring-2 focus:ring-[#FFB347]/60'
                    )}
                  </div>
                ) : (
                  <div className="hidden sm:flex items-center gap-2 h-11 px-4 rounded-2xl bg-[#046241]/20 border border-[#F9F7F7]/10 text-xs font-black uppercase tracking-widest text-[#F9F7F7]/75">
                    {todayDateLabel}
                  </div>
                )}
                {view === 'applications' && (
                  <button
                    type="button"
                    onClick={openAddApplicantModal}
                    className="h-11 rounded-2xl bg-[#F5EEDB] text-[#133020] hover:bg-[#F9F7F7] border border-[#F5EEDB]/40 px-5 text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-colors"
                  >
                    Add Applicant
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => void onLogout()}
                  className="h-11 rounded-2xl bg-[#FFB347] text-[#133020] hover:bg-[#FFC370] border border-[#FFC370]/40 px-5 text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {view !== 'dashboard' && (
            <div className="max-w-[1440px] mx-auto w-full sm:hidden px-6 pb-4">
              {renderSearch(
                'h-11 w-full rounded-2xl bg-[#046241]/20 text-[#F9F7F7] placeholder:text-[#F9F7F7]/55 border border-[#F9F7F7]/10 px-4 outline-none focus:ring-2 focus:ring-[#FFB347]/60'
              )}
            </div>
          )}
        </header>

        <main className="flex-1 max-w-[1440px] mx-auto w-full px-6 py-6 space-y-6">
            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-100 text-sm">
                {error}
              </div>
            )}

            {view === 'dashboard' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <div className="rounded-2xl bg-[#F5EEDB] text-[#133020] border border-[#133020]/10 p-5 shadow-[0_12px_28px_rgba(19,48,32,0.08)]">
                    <div className="text-xs font-black uppercase tracking-widest text-[#133020]/65">Applications</div>
                    <div className="mt-3 flex items-end justify-between gap-4">
                      <div className="text-4xl font-black">{dashboardApplicationStats.total}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest bg-[#FFB347]/30 text-[#133020] rounded-2xl px-3 py-2 border border-[#FFC370]/45">
                        +{todayApplications} today
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#F5EEDB] text-[#133020] border border-[#133020]/10 p-5 shadow-[0_12px_28px_rgba(19,48,32,0.08)]">
                    <div className="text-xs font-black uppercase tracking-widest text-[#133020]/65">Shortlisted</div>
                    <div className="mt-3 flex items-end justify-between gap-4">
                      <div className="text-4xl font-black">{dashboardApplicationStats.shortlisted}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest bg-[#FFC370]/28 border border-[#FFC370]/40 rounded-2xl px-3 py-2 text-[#133020]">
                        AI / F2F
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#F5EEDB] text-[#133020] border border-[#133020]/10 p-5 shadow-[0_12px_28px_rgba(19,48,32,0.08)]">
                    <div className="text-xs font-black uppercase tracking-widest text-[#133020]/65">Hired</div>
                    <div className="mt-3 flex items-end justify-between gap-4">
                      <div className="text-4xl font-black">{dashboardApplicationStats.hired}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest bg-[#046241] rounded-2xl px-3 py-2 text-[#F9F7F7] border border-[#046241]/70">
                        Completed
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#F5EEDB] text-[#133020] border border-[#133020]/10 p-5 shadow-[0_12px_28px_rgba(19,48,32,0.08)]">
                    <div className="text-xs font-black uppercase tracking-widest text-[#133020]/65">Rejected</div>
                    <div className="mt-3 flex items-end justify-between gap-4">
                      <div className="text-4xl font-black">{dashboardApplicationStats.rejected}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest bg-[#133020]/8 border border-[#133020]/12 rounded-2xl px-3 py-2 text-[#133020]/70">
                        Live
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
                  <div className="xl:col-span-8 grid grid-cols-1 lg:grid-cols-2 gap-4 auto-rows-fr">
                    <div className="rounded-2xl bg-[#F5EEDB] text-[#133020] border border-[#133020]/10 p-4 h-full flex flex-col">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-black">Applications</div>
                          <div className="mt-2 flex items-center gap-4 text-[11px] font-bold text-[#133020]/60">
                            <span className="inline-flex items-center gap-2">
                              <span className="h-2.5 w-2.5 rounded-sm bg-[#046241]" />
                              Applied
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <span className="h-2.5 w-2.5 rounded-sm bg-[#FFB347]" />
                              Shortlisted
                            </span>
                          </div>
                          <div className="mt-1 text-[10px] font-bold text-[#133020]/45">
                            Full bar = total applicants, green = shortlisted
                          </div>
                        </div>
                        <div className="h-9 rounded-2xl bg-[#133020]/5 border border-[#133020]/10 px-3 text-[10px] font-black uppercase tracking-widest text-[#133020]/60 flex items-center">
                          As of {todayDateLabel}
                        </div>
                      </div>
                      <div className="mt-4 flex-1">
                        <div className="h-full min-h-[220px] grid grid-cols-[auto,1fr] gap-3">
                          <div className="h-full flex flex-col">
                            <span className="mb-2 text-[9px] font-black uppercase tracking-widest text-[#133020]/45">
                              Applicants
                            </span>
                            <div className="flex-1 flex flex-col justify-between pb-5 text-[10px] font-bold text-[#133020]/40">
                              {dailyApplicationsAxis.ticks.map((value, index) => (
                                <span key={`${value}-${index}`}>{value}</span>
                              ))}
                            </div>
                          </div>
                          <div className="relative h-full">
                            <div className="absolute inset-0 flex flex-col justify-between pb-5 pointer-events-none">
                              {dailyApplicationsAxis.ticks.map((value, index) => (
                                <div key={`${value}-${index}`} className="border-t border-dashed border-[#133020]/10" />
                              ))}
                            </div>
                            <div className="relative h-full flex items-end gap-3">
                              {dailyApplications.series.map((d) => {
                                const appliedCount = d.applied;
                                const shortlistedCount = d.shortlisted;
                                const totalHeight = appliedCount > 0 ? (appliedCount / dailyApplicationsAxis.max) * 100 : 0;
                                const shortlistedHeight =
                                  shortlistedCount > 0 && appliedCount > 0 ? (shortlistedCount / appliedCount) * 100 : 0;
                                const appliedRemainder = Math.max(0, appliedCount - shortlistedCount);
                                const appliedHeight =
                                  appliedRemainder > 0 && appliedCount > 0 ? (appliedRemainder / appliedCount) * 100 : 0;

                                return (
                                  <div key={d.key} className="flex-1 min-w-0 flex h-full flex-col items-center gap-2">
                                    <div className="w-full max-w-[38px] flex-1 flex items-end">
                                      <div
                                        className="w-full rounded-[10px] overflow-hidden ring-1 ring-inset ring-[#046241]/18 flex flex-col justify-end"
                                        style={{ height: `${totalHeight}%` }}
                                        title={`Applied: ${appliedCount} | Shortlisted: ${shortlistedCount}`}
                                      >
                                        {appliedCount > 0 && (
                                          <div
                                            className="w-full bg-[#046241]"
                                            style={{ height: `${appliedHeight}%` }}
                                            title={`Applied: ${appliedCount}`}
                                          />
                                        )}
                                        {shortlistedCount > 0 && (
                                          <div
                                            className="w-full bg-[#FFB347]"
                                            style={{ height: `${shortlistedHeight}%` }}
                                            title={`Shortlisted: ${shortlistedCount}`}
                                          />
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-[10px] font-black text-[#133020]/60 truncate">{d.label}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-[#F9F7F7] text-[#133020] border border-[#133020]/10 p-4 h-full flex flex-col">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-black">Calendar</div>
                          <div className="mt-1 text-[11px] font-bold text-[#133020]/55">
                            Pick a date to view applications and contact messages.
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl border border-[#133020]/10 bg-[#F5EEDB] p-3 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
                            }
                            className="h-9 w-9 rounded-2xl bg-white/70 border border-[#133020]/10 grid place-items-center hover:bg-white transition-colors"
                            aria-label="Previous month"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <div className="text-sm font-black">{calendarMonthLabel}</div>
                          <button
                            type="button"
                            onClick={() =>
                              setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
                            }
                            className="h-9 w-9 rounded-2xl bg-white/70 border border-[#133020]/10 grid place-items-center hover:bg-white transition-colors"
                            aria-label="Next month"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>

                        <div className="mt-3 grid grid-cols-7 gap-1.5 text-center">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                            <div key={day} className="text-[10px] font-black uppercase tracking-widest text-[#133020]/40">
                              {day}
                            </div>
                          ))}
                          {calendarDays.map((day) => (
                            <button
                              key={day.key}
                              type="button"
                              onClick={() => setSelectedCalendarDate(day.key)}
                              className={[
                                'aspect-square min-h-[38px] rounded-lg border text-xs font-black transition-colors relative',
                                day.isSelected
                                  ? 'bg-[#FFB347] text-[#133020] border-[#FFC370]/60'
                                  : day.inMonth
                                    ? 'bg-white/75 text-[#133020] border-[#133020]/10 hover:bg-white'
                                    : 'bg-transparent text-[#133020]/30 border-transparent',
                              ].join(' ')}
                            >
                              <span>{day.dayNumber}</span>
                              {day.count > 0 && (
                                <span
                                  className={[
                                    'absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full',
                                    day.isSelected ? 'bg-[#133020]' : 'bg-[#046241]',
                                  ].join(' ')}
                                />
                              )}
                              {day.isToday && !day.isSelected && (
                                <span className="absolute inset-1 rounded-xl border border-[#046241]/30 pointer-events-none" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="xl:col-span-4">
                    <div className="rounded-2xl bg-[#F5EEDB] text-[#133020] border border-[#133020]/10 p-4 h-full flex flex-col">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-black">Applications by Position</div>
                        <div className="h-9 w-9 rounded-2xl bg-[#133020]/10 grid place-items-center text-[#133020]/70">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6l4 2" />
                          </svg>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-center">
                        <div
                          className="relative h-72 w-72 rounded-full"
                          style={{ background: positionBreakdown.gradient }}
                          aria-label="Applications by position chart"
                        >
                          <div className="absolute inset-14 rounded-full bg-[#F5EEDB] grid place-items-center text-center">
                            <div>
                              <div className="text-5xl font-black">{positionBreakdown.total}</div>
                              <div className="text-[10px] font-black uppercase tracking-widest text-[#133020]/60">
                                Total applicants
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 border-t border-[#133020]/12 pt-4">
                        <div className="mx-auto grid w-full max-w-[340px] grid-cols-2 gap-x-6 gap-y-2 text-xs">
                          {positionBreakdown.legend.map((item) => (
                            <div key={item.label} className="flex items-start justify-between gap-2 min-w-0">
                              <div className="flex items-start gap-2 min-w-0">
                                <span className="mt-1.5 h-3 w-3 rounded-full shrink-0" style={{ background: item.color }} />
                                <div className="text-[#133020]/80 leading-5">{item.label}</div>
                              </div>
                              <div className="text-[13px] font-black text-[#133020]">{item.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {renderSelectedDateSection()}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-[#133020]/10 bg-[#F5EEDB] p-5 text-[#133020] shadow-[0_12px_28px_rgba(19,48,32,0.08)]">
                    <div className="text-xs font-black uppercase tracking-widest text-[#133020]/65">Total</div>
                    <div className="mt-2 text-3xl font-black">{view === 'applications' ? rows.length : contactRows.length}</div>
                    <div className="mt-2 text-sm text-[#133020]/60">
                      {view === 'applications' ? 'Career applications' : 'Contact messages'}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#133020]/10 bg-[#F5EEDB] p-5 text-[#133020] shadow-[0_12px_28px_rgba(19,48,32,0.08)]">
                    <div className="text-xs font-black uppercase tracking-widest text-[#133020]/65">New Today</div>
                    <div className="mt-2 text-3xl font-black">
                      {view === 'applications' ? todayApplications : todayContacts}
                    </div>
                    <div className="mt-2 text-sm text-[#133020]/60">Based on local time</div>
                  </div>

                  <div className="rounded-2xl border border-[#133020]/10 bg-[#F5EEDB] p-5 text-[#133020] shadow-[0_12px_28px_rgba(19,48,32,0.08)]">
                    <div className="text-xs font-black uppercase tracking-widest text-[#133020]/65">Showing</div>
                    <div className="mt-2 text-3xl font-black">{resultsCount ?? '...'}</div>
                    <div className="mt-2 text-sm text-[#133020]/60">Matching your search</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#133020]/10 bg-[#F5EEDB] text-[#133020] shadow-[0_12px_28px_rgba(19,48,32,0.08)] overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#133020]/10 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center h-7 px-3 rounded-2xl bg-[#046241] border border-[#046241]/70 text-[#F5EEDB] text-[10px] font-black uppercase tracking-[0.25em]">
                        {view === 'applications' ? 'Applications' : 'Contact Messages'}
                      </span>
                      <span className="text-sm text-[#133020]/60">{loading ? 'Loading...' : `${resultsCount} results`}</span>
                    </div>
                    <div className="text-xs text-[#133020]/45">Click a row to view details.</div>
                  </div>

                  <div className="overflow-x-auto">
                    {loading ? (
                      <div className="p-6 text-sm text-[#133020]/60">Fetching records...</div>
                    ) : view === 'applications' && filteredRows.length === 0 ? (
                      <div className="p-6 text-sm text-[#133020]/60">No applications found.</div>
                    ) : view === 'contacts' && filteredContactRows.length === 0 ? (
                      <div className="p-6 text-sm text-[#133020]/60">No contact messages found.</div>
                    ) : view === 'applications' ? (
                      <table className="min-w-full text-sm">
                        <thead className="bg-[#133020]/6">
                          <tr className="text-left">
                            <th className="px-5 py-3 text-xs font-black uppercase tracking-widest text-[#133020]/50">Name</th>
                            <th className="px-5 py-3 text-xs font-black uppercase tracking-widest text-[#133020]/50">Email</th>
                            <th className="px-5 py-3 text-xs font-black uppercase tracking-widest text-[#133020]/50">Position</th>
                            <th className="px-5 py-3 text-xs font-black uppercase tracking-widest text-[#133020]/50">Country</th>
                            <th className="px-5 py-3 text-xs font-black uppercase tracking-widest text-[#133020]/50">Created</th>
                            <th className="px-5 py-3 text-xs font-black uppercase tracking-widest text-[#133020]/50">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#133020]/10">
                          {filteredRows.map((r) => (
                            <tr
                              key={r.id}
                              onClick={() => setDrawer({ kind: 'application', row: r })}
                              className="hover:bg-[#133020]/5 cursor-pointer"
                            >
                              <td className="px-5 py-4 font-bold whitespace-nowrap">
                                {r.first_name} {r.last_name}
                              </td>
                              <td className="px-5 py-4 text-[#133020]/70 max-w-[320px] truncate">{r.email}</td>
                              <td className="px-5 py-4 text-[#133020]/80 max-w-[260px] truncate">{r.position_applied}</td>
                              <td className="px-5 py-4 text-[#133020]/70 whitespace-nowrap">{r.country}</td>
                              <td className="px-5 py-4 text-[#133020]/60 whitespace-nowrap">
                                {new Date(r.created_at).toLocaleString()}
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex flex-wrap items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      void onViewCv(r);
                                    }}
                                    disabled={!hasApplicantCv(r)}
                                    className="h-9 rounded-2xl bg-white text-[#133020] hover:bg-[#F9F7F7] disabled:bg-[#133020]/10 disabled:text-[#133020]/35 disabled:border-[#133020]/10 disabled:cursor-not-allowed border border-[#133020]/18 shadow-[0_6px_16px_rgba(19,48,32,0.08)] px-4 text-[10px] font-black uppercase tracking-widest"
                                  >
                                    {hasApplicantCv(r) ? 'View CV' : 'No CV Yet'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      void onDeleteApplication(r);
                                    }}
                                    disabled={deletingKey === `application:${r.id}`}
                                    className="h-9 rounded-2xl bg-[#B42318]/10 text-[#B42318] hover:bg-[#B42318]/16 disabled:opacity-50 disabled:cursor-not-allowed border border-[#B42318]/20 px-4 text-[10px] font-black uppercase tracking-widest"
                                  >
                                    {deletingKey === `application:${r.id}` ? 'Removing...' : 'Remove'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <table className="min-w-full text-sm">
                        <thead className="bg-[#133020]/6">
                          <tr className="text-left">
                            <th className="px-5 py-3 text-xs font-black uppercase tracking-widest text-[#133020]/50">Name</th>
                            <th className="px-5 py-3 text-xs font-black uppercase tracking-widest text-[#133020]/50">Email</th>
                            <th className="px-5 py-3 text-xs font-black uppercase tracking-widest text-[#133020]/50">Message</th>
                            <th className="px-5 py-3 text-xs font-black uppercase tracking-widest text-[#133020]/50">Source</th>
                            <th className="px-5 py-3 text-xs font-black uppercase tracking-widest text-[#133020]/50">Created</th>
                            <th className="px-5 py-3 text-xs font-black uppercase tracking-widest text-[#133020]/50">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#133020]/10">
                          {filteredContactRows.map((r) => (
                            <tr
                              key={r.id}
                              onClick={() => setDrawer({ kind: 'contact', row: r })}
                              className="hover:bg-[#133020]/5 cursor-pointer"
                            >
                              <td className="px-5 py-4 font-bold whitespace-nowrap">{r.name}</td>
                              <td className="px-5 py-4 text-[#133020]/70 max-w-[320px] truncate">{r.email}</td>
                              <td className="px-5 py-4 text-[#133020]/70 max-w-[560px] truncate">{r.message}</td>
                              <td className="px-5 py-4 text-[#133020]/70 whitespace-nowrap">{r.source}</td>
                              <td className="px-5 py-4 text-[#133020]/60 whitespace-nowrap">
                                {new Date(r.created_at).toLocaleString()}
                              </td>
                              <td className="px-5 py-4">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    void onDeleteContact(r);
                                  }}
                                  disabled={deletingKey === `contact:${r.id}`}
                                  className="h-9 rounded-2xl bg-[#B42318]/10 text-[#B42318] hover:bg-[#B42318]/16 disabled:opacity-50 disabled:cursor-not-allowed border border-[#B42318]/20 px-4 text-[10px] font-black uppercase tracking-widest"
                                >
                                  {deletingKey === `contact:${r.id}` ? 'Removing...' : 'Remove'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </>
            )}
        </main>
      </div>

      {isAddApplicantOpen && (
        <div className="fixed inset-0 z-40">
          <button
            type="button"
            onClick={closeAddApplicantModal}
            className="absolute inset-0 bg-black/60"
            aria-label="Close add applicant form"
          />
          <div className="relative z-10 flex min-h-full items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-3xl rounded-[2rem] border border-[#133020]/10 bg-[#F5EEDB] text-[#133020] shadow-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-[#133020]/10 flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[#046241]">Manual Entry</div>
                  <div className="mt-2 text-2xl font-black tracking-tight">Add Applicant</div>
                  <div className="mt-1 text-sm text-[#133020]/60">
                    Use this for walk-in candidates or applicants received outside the website.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeAddApplicantModal}
                  className="h-10 w-10 rounded-2xl bg-[#133020]/6 hover:bg-[#133020]/10 border border-[#133020]/10 grid place-items-center shrink-0"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              <form onSubmit={onCreateManualApplicant} className="p-6 space-y-5">
                {manualApplicantStatus.status === 'error' && (
                  <div className="rounded-2xl border border-[#B42318]/20 bg-[#B42318]/8 px-4 py-3 text-sm text-[#B42318]">
                    {manualApplicantStatus.message}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <div className="text-xs font-black uppercase tracking-widest text-[#133020]/55">First Name</div>
                    <input
                      value={manualApplicantForm.firstName}
                      onChange={(e) => setManualApplicantForm((prev) => ({ ...prev, firstName: e.target.value }))}
                      className="mt-2 h-11 w-full rounded-2xl bg-white/70 border border-[#133020]/10 px-4 outline-none focus:ring-2 focus:ring-[#046241]/20"
                    />
                  </label>
                  <label className="block">
                    <div className="text-xs font-black uppercase tracking-widest text-[#133020]/55">Last Name</div>
                    <input
                      value={manualApplicantForm.lastName}
                      onChange={(e) => setManualApplicantForm((prev) => ({ ...prev, lastName: e.target.value }))}
                      className="mt-2 h-11 w-full rounded-2xl bg-white/70 border border-[#133020]/10 px-4 outline-none focus:ring-2 focus:ring-[#046241]/20"
                    />
                  </label>
                  <label className="block">
                    <div className="text-xs font-black uppercase tracking-widest text-[#133020]/55">Gender</div>
                    <select
                      value={manualApplicantForm.gender}
                      onChange={(e) =>
                        setManualApplicantForm((prev) => ({
                          ...prev,
                          gender: e.target.value as ManualApplicantFormState['gender'],
                        }))
                      }
                      className="mt-2 h-11 w-full rounded-2xl bg-white/70 border border-[#133020]/10 px-4 outline-none focus:ring-2 focus:ring-[#046241]/20"
                    >
                      <option value="">Select gender</option>
                      {genderOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <div className="text-xs font-black uppercase tracking-widest text-[#133020]/55">Age</div>
                    <input
                      type="number"
                      min="16"
                      max="99"
                      value={manualApplicantForm.age}
                      onChange={(e) => setManualApplicantForm((prev) => ({ ...prev, age: e.target.value }))}
                      className="mt-2 h-11 w-full rounded-2xl bg-white/70 border border-[#133020]/10 px-4 outline-none focus:ring-2 focus:ring-[#046241]/20"
                    />
                  </label>
                  <label className="block">
                    <div className="text-xs font-black uppercase tracking-widest text-[#133020]/55">Phone Code</div>
                    <select
                      value={manualApplicantForm.phoneCountryCode}
                      onChange={(e) =>
                        setManualApplicantForm((prev) => ({ ...prev, phoneCountryCode: e.target.value }))
                      }
                      className="mt-2 h-11 w-full rounded-2xl bg-white/70 border border-[#133020]/10 px-4 outline-none focus:ring-2 focus:ring-[#046241]/20"
                    >
                      {phoneCountryCodes.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <div className="text-xs font-black uppercase tracking-widest text-[#133020]/55">Phone Number</div>
                    <input
                      value={manualApplicantForm.phoneNumber}
                      onChange={(e) => setManualApplicantForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                      className="mt-2 h-11 w-full rounded-2xl bg-white/70 border border-[#133020]/10 px-4 outline-none focus:ring-2 focus:ring-[#046241]/20"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <div className="text-xs font-black uppercase tracking-widest text-[#133020]/55">Email</div>
                    <input
                      type="email"
                      value={manualApplicantForm.email}
                      onChange={(e) => setManualApplicantForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="mt-2 h-11 w-full rounded-2xl bg-white/70 border border-[#133020]/10 px-4 outline-none focus:ring-2 focus:ring-[#046241]/20"
                    />
                  </label>
                  <label className="block">
                    <div className="text-xs font-black uppercase tracking-widest text-[#133020]/55">Position</div>
                    <select
                      value={manualApplicantForm.positionApplied}
                      onChange={(e) =>
                        setManualApplicantForm((prev) => ({ ...prev, positionApplied: e.target.value }))
                      }
                      className="mt-2 h-11 w-full rounded-2xl bg-white/70 border border-[#133020]/10 px-4 outline-none focus:ring-2 focus:ring-[#046241]/20"
                    >
                      <option value="">Select position</option>
                      {positionOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <div className="text-xs font-black uppercase tracking-widest text-[#133020]/55">Country</div>
                    <select
                      value={manualApplicantForm.country}
                      onChange={(e) => setManualApplicantForm((prev) => ({ ...prev, country: e.target.value }))}
                      className="mt-2 h-11 w-full rounded-2xl bg-white/70 border border-[#133020]/10 px-4 outline-none focus:ring-2 focus:ring-[#046241]/20"
                    >
                      <option value="">Select country</option>
                      {countryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block sm:col-span-2">
                    <div className="text-xs font-black uppercase tracking-widest text-[#133020]/55">Current Address</div>
                    <textarea
                      rows={3}
                      value={manualApplicantForm.currentAddress}
                      onChange={(e) =>
                        setManualApplicantForm((prev) => ({ ...prev, currentAddress: e.target.value }))
                      }
                      className="mt-2 w-full rounded-2xl bg-white/70 border border-[#133020]/10 px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-[#046241]/20"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs font-black uppercase tracking-widest text-[#133020]/55">CV Upload</div>
                      <div className="text-[11px] font-bold text-[#133020]/55">Optional for walk-ins</div>
                    </div>
                    <div className="mt-2 rounded-2xl border border-dashed border-[#133020]/18 bg-white/55 px-4 py-4">
                      <input
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={(e) => onPickManualApplicantCv(e.target.files?.[0] ?? null)}
                        className="block w-full text-sm file:mr-4 file:rounded-2xl file:border-0 file:bg-[#046241] file:px-4 file:py-2 file:text-[11px] file:font-black file:uppercase file:tracking-widest file:text-[#F5EEDB]"
                      />
                      <div className="mt-3 text-sm text-[#133020]/65">
                        {manualApplicantForm.cvFile
                          ? manualApplicantForm.cvFile.name
                          : 'No CV uploaded yet. You can still save the applicant as a walk-in.'}
                      </div>
                    </div>
                  </label>
                </div>

                <div className="rounded-2xl border border-[#133020]/10 bg-white/45 px-4 py-4 text-sm text-[#133020]/70">
                  Saved applicants from this form are marked as walk-ins so your team can track manual entries separately from website submissions.
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeAddApplicantModal}
                    className="h-11 rounded-2xl bg-[#133020]/6 text-[#133020] hover:bg-[#133020]/10 border border-[#133020]/10 px-5 text-xs font-black uppercase tracking-widest transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!canSubmitManualApplicant}
                    className="h-11 rounded-2xl bg-[#046241] text-[#F5EEDB] hover:bg-[#0b7550] disabled:bg-[#133020]/12 disabled:text-[#133020]/35 disabled:border-[#133020]/10 disabled:cursor-not-allowed border border-[#046241]/70 px-5 text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-colors"
                  >
                    {manualApplicantStatus.status === 'submitting' ? 'Saving...' : 'Save Applicant'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {cvPreview && (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            onClick={closeCvPreview}
            className="absolute inset-0 bg-black/70"
            aria-label="Close CV preview"
          />
          <div className="relative z-10 flex min-h-full items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-6xl h-[85vh] rounded-[2rem] border border-[#F9F7F7]/12 bg-[#133020] text-[#F9F7F7] shadow-2xl overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-[#F9F7F7]/10 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FFC370]">CV Preview</div>
                  <div className="mt-2 text-xl font-black tracking-tight truncate">
                    {cvPreview.row.first_name} {cvPreview.row.last_name}
                  </div>
                  <div className="mt-1 text-xs text-[#F9F7F7]/60">{cvPreview.row.position_applied}</div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={closeCvPreview}
                    className="h-10 w-10 rounded-2xl bg-[#F9F7F7]/10 hover:bg-[#F9F7F7]/15 border border-[#F9F7F7]/10 grid place-items-center shrink-0"
                    aria-label="Close"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-[#0f2418]">
                {cvPreview.status === 'loading' ? (
                  <div className="h-full grid place-items-center px-6 text-center">
                    <div>
                      <div className="text-lg font-black">Loading CV preview...</div>
                      <div className="mt-2 text-sm text-[#F9F7F7]/60">Please wait while we prepare the file.</div>
                    </div>
                  </div>
                ) : cvPreview.status === 'error' || !cvPreview.url ? (
                  <div className="h-full grid place-items-center px-6 text-center">
                    <div>
                      <div className="text-lg font-black">Unable to preview this CV</div>
                      <div className="mt-2 text-sm text-[#F9F7F7]/60">
                        Try the download button or reopen the preview.
                      </div>
                    </div>
                  </div>
                ) : (
                  <iframe
                    title={`CV preview for ${cvPreview.row.first_name} ${cvPreview.row.last_name}`}
                    src={cvPreview.url}
                    className="h-full w-full"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            onClick={() => setDrawer(null)}
            className="absolute inset-0 bg-black/60"
            aria-label="Close details"
          />
          <div className="relative z-10 flex min-h-full items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-3xl max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] overflow-hidden rounded-[2rem] border border-[#F9F7F7]/12 bg-[#133020] shadow-2xl flex flex-col">
              <div className="px-6 py-5 border-b border-[#F9F7F7]/10 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FFB347]">
                    {drawer.kind === 'application' ? 'Application' : 'Contact Message'}
                  </div>
                  <div className="mt-2 text-xl font-black tracking-tight truncate">
                    {drawer.kind === 'application'
                      ? `${drawer.row.first_name} ${drawer.row.last_name}`
                      : drawer.row.name}
                  </div>
                  <div className="mt-1 text-xs text-white/60">{new Date(drawer.row.created_at).toLocaleString()}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawer(null)}
                  className="h-10 w-10 rounded-2xl bg-[#F9F7F7]/10 hover:bg-[#F9F7F7]/15 border border-[#F9F7F7]/10 grid place-items-center shrink-0"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto flex-1">
                {drawer.kind === 'application' ? (
                  <>
                    <div className="rounded-2xl border border-[#F9F7F7]/10 bg-[#046241]/16 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-black">Hiring Progress</div>
                          <div className="mt-1 text-xs text-[#F9F7F7]/65">
                            CV check -&gt; Online interview -&gt; Face-to-face interview
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={[
                              'inline-flex items-center h-9 px-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] border',
                              hiringProgress.hired
                                ? 'bg-[#046241]/55 text-[#F9F7F7] border-[#F9F7F7]/10'
                                : hiringProgress.rejected
                                  ? 'bg-[#F5EEDB] text-[#133020] border-[#F5EEDB]/30'
                                  : 'bg-[#133020]/35 text-[#F9F7F7]/80 border-[#F9F7F7]/10',
                            ].join(' ')}
                          >
                            {hiringProgress.hired ? 'Hired' : hiringProgress.rejected ? 'Rejected' : 'In Progress'}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              persistHiringProgress({
                                stage: hiringProgress.hired ? hiringProgress.stage : 'face_to_face',
                                hired: !hiringProgress.hired,
                                rejected: false,
                              })
                            }
                            className={[
                              'h-9 rounded-2xl px-4 text-[10px] font-black uppercase tracking-widest border shadow-lg active:scale-95 transition-colors',
                              hiringProgress.hired
                                ? 'bg-[#133020]/35 text-[#F9F7F7] hover:bg-[#133020]/50 border-[#F9F7F7]/10'
                                : 'bg-[#FFB347] text-[#133020] hover:bg-[#FFC370] border border-[#FFC370]/40',
                            ].join(' ')}
                          >
                            {hiringProgress.hired ? 'Unmark' : 'Mark Hired'}
                          </button>
                          <button
                            type="button"
                            disabled={hiringProgress.hired}
                            onClick={() =>
                              persistHiringProgress({
                                stage: hiringProgress.stage,
                                hired: false,
                                rejected: !hiringProgress.rejected,
                              })
                            }
                            className={[
                              'h-9 rounded-2xl px-4 text-[10px] font-black uppercase tracking-widest border shadow-lg active:scale-95 transition-colors',
                              hiringProgress.hired
                                ? 'bg-[#133020]/15 text-[#F9F7F7]/40 border-[#F9F7F7]/10 cursor-not-allowed'
                                : hiringProgress.rejected
                                  ? 'bg-[#133020]/35 text-[#F9F7F7] hover:bg-[#133020]/50 border-[#F9F7F7]/10'
                                  : 'bg-[#F5EEDB] text-[#133020] hover:bg-[#F9F7F7] border border-[#F5EEDB]/40',
                            ].join(' ')}
                          >
                            {hiringProgress.rejected ? 'Unreject' : 'Mark Rejected'}
                          </button>
                        </div>
                      </div>

                      <div className="mt-5">
                        <div className="flex items-center">
                          {hiringStages.map((step, idx) => {
                            const completed = !hiringProgress.rejected && (hiringProgress.hired || idx < currentHiringStageIndex);
                            const active = !hiringProgress.hired && !hiringProgress.rejected && idx === currentHiringStageIndex;
                            const circleClass = hiringProgress.rejected
                              ? 'bg-[#F9F7F7]/8 text-[#F9F7F7]/40 border-[#F9F7F7]/10'
                              : completed
                                ? 'bg-[#FFB347] text-[#133020] border-[#FFC370]/40'
                                : active
                                  ? 'bg-[#FFC370] text-[#133020] border-[#FFC370]/50'
                                  : 'bg-[#F9F7F7]/10 text-[#F9F7F7]/70 border-[#F9F7F7]/12';

                            const lineClass =
                              !hiringProgress.rejected && (hiringProgress.hired || idx < currentHiringStageIndex)
                                ? 'bg-[#FFB347]'
                                : 'bg-[#F9F7F7]/12';

                            return (
                              <React.Fragment key={step.key}>
                                <button
                                  type="button"
                                  onClick={() => persistHiringProgress({ stage: step.key, hired: false, rejected: false })}
                                  className="group flex flex-col items-center gap-2 min-w-0"
                                  aria-label={`Set stage: ${step.label}`}
                                >
                                  <span
                                    className={[
                                      'h-10 w-10 rounded-2xl border grid place-items-center text-xs font-black transition-transform group-hover:scale-[1.03] group-active:scale-95',
                                      circleClass,
                                    ].join(' ')}
                                  >
                                    {completed ? (
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2.5}
                                          d="M20 6L9 17l-5-5"
                                        />
                                      </svg>
                                    ) : (
                                      idx + 1
                                    )}
                                  </span>
                                  <span
                                    className={[
                                      'text-[11px] font-bold text-center leading-tight max-w-[120px]',
                                      active ? 'text-[#F9F7F7]' : 'text-[#F9F7F7]/70',
                                    ].join(' ')}
                                  >
                                    {step.label}
                                  </span>
                                </button>
                                {idx < hiringStages.length - 1 && (
                                  <div className="flex-1 mx-3">
                                    <div className={['h-1 rounded-full', lineClass].join(' ')} />
                                  </div>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#F9F7F7]/10 bg-[#046241]/16 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-black">Email Candidate</div>
                          <div className="mt-1 text-xs text-[#F9F7F7]/65">
                            One template for hired, one flexible update template for interview and rejection.
                          </div>
                        </div>
                        <div
                          className={[
                            'text-xs font-bold',
                            emailStatus.state === 'error'
                              ? 'text-[#FFC370]'
                              : emailStatus.state === 'sent'
                                ? 'text-[#F5EEDB]'
                                : 'text-[#F9F7F7]/65',
                          ].join(' ')}
                        >
                          {emailStatus.state === 'idle'
                            ? 'Ready'
                            : emailStatus.state === 'sending'
                              ? 'Sending email...'
                              : emailStatus.message}
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 xl:grid-cols-5 gap-4">
                        <div className="xl:col-span-3 rounded-2xl border border-[#F9F7F7]/10 bg-[#133020]/20 p-4">
                          <div className="text-[10px] font-black uppercase tracking-widest text-[#F9F7F7]/60">
                            Schedule Interview
                          </div>
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="text-xs text-[#F9F7F7]/65">
                              Interview type
                              <select
                                value={interviewType}
                                onChange={(e) =>
                                  setInterviewType(e.target.value as 'Online Interview' | 'Face-to-face Interview')
                                }
                                className="mt-1 h-11 w-full rounded-2xl bg-[#133020]/40 text-[#F9F7F7] border border-[#F9F7F7]/10 px-3 outline-none"
                              >
                                <option value="Online Interview">Online Interview</option>
                                <option value="Face-to-face Interview">Face-to-face Interview</option>
                              </select>
                            </label>
                            <label className="text-xs text-[#F9F7F7]/65">
                              Date and time
                              <input
                                type="datetime-local"
                                value={interviewDateTime}
                                onChange={(e) => setInterviewDateTime(e.target.value)}
                                className="mt-1 h-11 w-full rounded-2xl bg-[#133020]/40 text-[#F9F7F7] border border-[#F9F7F7]/10 px-3 outline-none"
                              />
                            </label>
                            <label className="text-xs text-[#F9F7F7]/65">
                              Timezone
                              <input
                                value={interviewTimezone}
                                onChange={(e) => setInterviewTimezone(e.target.value)}
                                className="mt-1 h-11 w-full rounded-2xl bg-[#133020]/40 text-[#F9F7F7] border border-[#F9F7F7]/10 px-3 outline-none"
                              />
                            </label>
                            <label className="text-xs text-[#F9F7F7]/65">
                              Meeting link or location
                              <input
                                value={interviewLocation}
                                onChange={(e) => setInterviewLocation(e.target.value)}
                                placeholder="Google Meet, Zoom, office address..."
                                className="mt-1 h-11 w-full rounded-2xl bg-[#133020]/40 text-[#F9F7F7] placeholder:text-[#F9F7F7]/35 border border-[#F9F7F7]/10 px-3 outline-none"
                              />
                            </label>
                            <label className="text-xs text-[#F9F7F7]/65 sm:col-span-2">
                              Notes
                              <textarea
                                value={interviewNotes}
                                onChange={(e) => setInterviewNotes(e.target.value)}
                                rows={3}
                                className="mt-1 w-full rounded-2xl bg-[#133020]/40 text-[#F9F7F7] placeholder:text-[#F9F7F7]/35 border border-[#F9F7F7]/10 px-3 py-3 outline-none resize-none"
                              />
                            </label>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <button
                              type="button"
                              onClick={() => void sendInterviewScheduleEmail()}
                              disabled={emailStatus.state === 'sending'}
                              className="h-10 rounded-2xl bg-[#FFB347] text-[#133020] hover:bg-[#FFC370] disabled:opacity-50 disabled:cursor-not-allowed border border-[#FFC370]/40 px-4 text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-colors"
                            >
                              Send Interview Email
                            </button>
                          </div>
                        </div>

                        <div className="xl:col-span-2 space-y-4">
                          <div className="rounded-2xl border border-[#F9F7F7]/10 bg-[#133020]/20 p-4">
                            <div className="text-[10px] font-black uppercase tracking-widest text-[#F9F7F7]/60">
                              Reject Candidate
                            </div>
                            <label className="mt-3 block text-xs text-[#F9F7F7]/65">
                              Rejection note
                              <textarea
                                value={rejectionNote}
                                onChange={(e) => setRejectionNote(e.target.value)}
                                rows={5}
                                className="mt-1 w-full rounded-2xl bg-[#133020]/40 text-[#F9F7F7] border border-[#F9F7F7]/10 px-3 py-3 outline-none resize-none"
                              />
                            </label>
                            <div className="mt-4 flex flex-wrap justify-between gap-3">
                              <button
                                type="button"
                                onClick={() =>
                                  persistHiringProgress({
                                    stage: hiringProgress.stage,
                                    hired: false,
                                    rejected: true,
                                  })
                                }
                                className="h-10 rounded-2xl bg-[#F5EEDB] text-[#133020] hover:bg-[#F9F7F7] border border-[#F5EEDB]/40 px-4 text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-colors"
                              >
                                Mark Rejected
                              </button>
                              <button
                                type="button"
                                onClick={() => void sendRejectionEmail()}
                                disabled={emailStatus.state === 'sending'}
                                className="h-10 rounded-2xl bg-[#133020]/35 text-[#F9F7F7] hover:bg-[#133020]/50 disabled:opacity-50 disabled:cursor-not-allowed border border-[#F9F7F7]/10 px-4 text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-colors"
                              >
                                Send Rejection
                              </button>
                            </div>
                          </div>

                          <div className="rounded-2xl border border-[#F9F7F7]/10 bg-[#133020]/20 p-4">
                            <div className="text-[10px] font-black uppercase tracking-widest text-[#F9F7F7]/60">
                              Hire Candidate
                            </div>
                            <div className="mt-3 text-sm text-[#F9F7F7]/75">
                              Mark the applicant as hired first, then send the hired email.
                            </div>
                            <div className="mt-4 flex justify-end">
                              <button
                                type="button"
                                onClick={() => void sendHiredEmail()}
                                disabled={emailStatus.state === 'sending' || !hiringProgress.hired}
                                className="h-10 rounded-2xl bg-[#046241] text-[#F9F7F7] hover:bg-[#0b7550] disabled:opacity-50 disabled:cursor-not-allowed border border-[#F9F7F7]/10 px-4 text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-colors"
                              >
                                Send Hired Email
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {!emailJsPublicKey && (
                        <div className="mt-4 text-xs text-[#FFC370]">
                          Add `VITE_EMAILJS_PUBLIC_KEY`, `VITE_EMAILJS_TEMPLATE_HIRED`, and `VITE_EMAILJS_TEMPLATE_UPDATE`
                          to `.env.local` before sending emails.
                        </div>
                      )}
                    </div>

                    <div className="rounded-2xl border border-[#F9F7F7]/10 bg-[#046241]/16 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-black">Applicant Details</div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void onViewCv(drawer.row)}
                          disabled={!hasApplicantCv(drawer.row)}
                          className="h-10 rounded-2xl bg-[#F9F7F7]/10 text-[#F9F7F7] hover:bg-[#F9F7F7]/16 disabled:bg-[#F9F7F7]/10 disabled:text-[#F9F7F7]/35 disabled:border-[#F9F7F7]/10 disabled:cursor-not-allowed border border-[#F9F7F7]/10 px-4 text-[10px] font-black uppercase tracking-widest transition-colors"
                        >
                          {hasApplicantCv(drawer.row) ? 'View CV' : 'No CV Uploaded'}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-xs uppercase tracking-widest text-white/50">Email</div>
                        <div className="mt-1 text-white/90 break-words">{drawer.row.email}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-widest text-white/50">Phone</div>
                        <div className="mt-1 text-white/90">
                          {drawer.row.phone_country_code} {drawer.row.phone_number}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-widest text-white/50">Position</div>
                        <div className="mt-1 text-white/90">{drawer.row.position_applied}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-widest text-white/50">Country</div>
                        <div className="mt-1 text-white/90">{drawer.row.country}</div>
                      </div>
                      <div className="sm:col-span-2">
                        <div className="text-xs uppercase tracking-widest text-white/50">Address</div>
                        <div className="mt-1 text-white/90">{drawer.row.current_address}</div>
                      </div>
                      <div className="sm:col-span-2">
                        <div className="text-xs uppercase tracking-widest text-white/50">Other</div>
                        <div className="mt-1 text-white/90">
                          {drawer.row.gender} | {drawer.row.age} | Source: {drawer.row.source}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="text-xs uppercase tracking-widest text-white/50">Remarks</div>
                          <div
                            className={[
                              'text-xs font-bold',
                              remarksStatus.state === 'error'
                                ? 'text-[#FFC370]'
                                : remarksStatus.state === 'saved'
                                  ? 'text-[#F5EEDB]'
                                  : 'text-white/55',
                            ].join(' ')}
                          >
                            {remarksStatus.state === 'idle'
                              ? 'Private admin notes'
                              : remarksStatus.state === 'saving'
                                ? 'Saving remarks...'
                                : remarksStatus.message}
                          </div>
                        </div>
                        <textarea
                          value={remarksDraft}
                          onChange={(e) => {
                            setRemarksDraft(e.target.value);
                            if (remarksStatus.state !== 'idle') setRemarksStatus({ state: 'idle' });
                          }}
                          rows={4}
                          placeholder="Add walk-in notes, interview impressions, follow-ups, or reminders..."
                          className="mt-2 w-full rounded-2xl bg-[#133020]/40 text-[#F9F7F7] placeholder:text-[#F9F7F7]/35 border border-[#F9F7F7]/10 px-3 py-3 outline-none resize-none"
                        />
                        <div className="mt-3 flex justify-end">
                          <button
                            type="button"
                            onClick={() => void onSaveApplicantRemarks()}
                            disabled={remarksStatus.state === 'saving' || remarksDraft === (drawer.row.remarks ?? '')}
                            className="h-10 rounded-2xl bg-[#F5EEDB] text-[#133020] hover:bg-[#F9F7F7] disabled:opacity-50 disabled:cursor-not-allowed border border-[#F5EEDB]/40 px-4 text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-colors"
                          >
                            {remarksStatus.state === 'saving' ? 'Saving...' : 'Save Remarks'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  </>
                ) : (
                  <div className="rounded-2xl border border-[#F9F7F7]/10 bg-[#046241]/16 p-5">
                    <div className="text-sm font-black">Message</div>
                    <div className="mt-4 space-y-4 text-sm">
                      <div>
                        <div className="text-xs uppercase tracking-widest text-white/50">Email</div>
                        <div className="mt-1 text-white/90 break-words">{drawer.row.email}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-widest text-white/50">Source</div>
                        <div className="mt-1 text-white/90">{drawer.row.source}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-widest text-white/50">Message</div>
                        <div className="mt-2 text-white/90 whitespace-pre-wrap leading-relaxed">{drawer.row.message}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
