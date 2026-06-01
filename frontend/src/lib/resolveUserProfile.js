import { supabase } from './supabaseClient';
import { toError } from './authErrors';
import {
  isAllowedSiitEmail,
  isStaffEmail,
  isStudentEmail,
  parseStudentEmail,
} from './parseStudentEmail';

function getDisplayName(user) {
  return (
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'User'
  );
}

function isStudentProfileComplete(studentRow) {
  if (!studentRow) {
    return false;
  }

  return studentRow.Year != null && Boolean(studentRow.Department);
}

function throwIfSupabaseError(error, fallback) {
  if (error) {
    throw toError(error, fallback);
  }
}

export async function resolveUserProfile(user) {
  if (!user?.id || !user?.email) {
    return {
      userRole: null,
      profile: null,
      userId: null,
      userName: null,
      studentId: null,
      staffDivision: null,
      profileComplete: false,
      authError: 'Missing authenticated user.',
    };
  }

  const email = user.email.trim().toLowerCase();

  if (!isAllowedSiitEmail(email)) {
    return {
      userRole: null,
      profile: null,
      userId: null,
      userName: null,
      studentId: null,
      staffDivision: null,
      profileComplete: false,
      authError: 'Only @siit.tu.ac.th and @g.siit.tu.ac.th Google accounts are allowed.',
    };
  }

  const { data: adminRow, error: adminError } = await supabase
    .from('admin')
    .select('*')
    .eq('UUID', user.id)
    .maybeSingle();

  throwIfSupabaseError(adminError, 'Failed to load admin profile.');

  if (adminRow) {
    let staffName = getDisplayName(user);
    let staffDivision = null;

    if (adminRow.StaffID) {
      const { data: linkedStaff, error: linkedStaffError } = await supabase
        .from('staff')
        .select('*')
        .eq('StaffID', adminRow.StaffID)
        .maybeSingle();

      throwIfSupabaseError(linkedStaffError, 'Failed to load linked staff profile.');

      if (linkedStaff?.StaffName) {
        staffName = linkedStaff.StaffName;
      }

      staffDivision = linkedStaff?.Division || null;
    }

    return {
      userRole: 'Admin',
      profile: adminRow,
      userId: adminRow.StaffID || adminRow.StudentID,
      userName: staffName,
      studentId: adminRow.StudentID || null,
      staffDivision,
      profileComplete: true,
      authError: null,
    };
  }

  if (isStaffEmail(email)) {
    const { data: staffRow, error: staffLookupError } = await supabase
      .from('staff')
      .select('*')
      .eq('Email', email)
      .maybeSingle();

    throwIfSupabaseError(staffLookupError, 'Failed to load staff profile.');

    if (!staffRow) {
      return {
        userRole: null,
        profile: null,
        userId: null,
        userName: null,
        studentId: null,
        staffDivision: null,
        profileComplete: false,
        authError: 'Your staff account is not registered. Contact an administrator.',
      };
    }

    let activeStaff = staffRow;

    if (!staffRow.UUID) {
      const { data: linkedStaff, error: linkError } = await supabase
        .from('staff')
        .update({ UUID: user.id })
        .eq('StaffID', staffRow.StaffID)
        .is('UUID', null)
        .select('*')
        .maybeSingle();

      throwIfSupabaseError(linkError, 'Failed to link staff account.');

      if (linkedStaff) {
        activeStaff = linkedStaff;
      } else {
        activeStaff = { ...staffRow, UUID: user.id };
      }
    }

    return {
      userRole: 'Staff',
      profile: activeStaff,
      userId: activeStaff.StaffID,
      userName: activeStaff.StaffName || getDisplayName(user),
      studentId: null,
      staffDivision: activeStaff.Division,
      profileComplete: true,
      authError: null,
    };
  }

  if (isStudentEmail(email)) {
    const parsed = parseStudentEmail(email);

    if (!parsed) {
      return {
        userRole: null,
        profile: null,
        userId: null,
        userName: null,
        studentId: null,
        staffDivision: null,
        profileComplete: false,
        authError: 'Your student email format is invalid.',
      };
    }

    const studentName = getDisplayName(user);

    const { data: existingStudent, error: studentLookupError } = await supabase
      .from('student')
      .select('*')
      .eq('UUID', user.id)
      .maybeSingle();

    throwIfSupabaseError(studentLookupError, 'Failed to load student profile.');

    let studentRow = existingStudent;

    if (!studentRow) {
      const { data: insertedStudent, error: insertError } = await supabase
        .from('student')
        .insert({
          UUID: user.id,
          StudentID: parsed.studentId,
          Email: parsed.email,
          StudentName: studentName,
        })
        .select('*')
        .single();

      throwIfSupabaseError(
        insertError,
        'Failed to create student profile. Ensure Supabase migrations have been applied.'
      );

      studentRow = insertedStudent;
    }

    const profileComplete = isStudentProfileComplete(studentRow);

    return {
      userRole: 'Student',
      profile: studentRow,
      userId: studentRow.StudentID,
      userName: studentRow.StudentName || studentName,
      studentId: studentRow.StudentID,
      staffDivision: null,
      profileComplete,
      authError: null,
    };
  }

  return {
    userRole: null,
    profile: null,
    userId: null,
    userName: null,
    studentId: null,
    staffDivision: null,
    profileComplete: false,
    authError: 'Unrecognized SIIT account type.',
  };
}

export { isStudentProfileComplete };
