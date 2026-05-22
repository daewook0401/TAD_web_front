const GOOGLE_SIGNUP_DRAFT_KEY = 'googleSignupDraft';

export const googleSignupDraft = {
  save: (draft) => {
    if (!draft?.registrationToken) {
      return;
    }

    sessionStorage.setItem(GOOGLE_SIGNUP_DRAFT_KEY, JSON.stringify(draft));
  },

  get: () => {
    const rawDraft = sessionStorage.getItem(GOOGLE_SIGNUP_DRAFT_KEY);
    if (!rawDraft) {
      return null;
    }

    try {
      return JSON.parse(rawDraft);
    } catch {
      sessionStorage.removeItem(GOOGLE_SIGNUP_DRAFT_KEY);
      return null;
    }
  },

  clear: () => {
    sessionStorage.removeItem(GOOGLE_SIGNUP_DRAFT_KEY);
  },
};
