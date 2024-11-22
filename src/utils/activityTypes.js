export const ACTIVITY_TYPES = {
  QUESTION: {
    CREATE: 'question_create',
    UPDATE: 'question_update',
    DELETE: 'question_delete',
    VOTE: 'question_vote',
  },
  ANSWER: {
    CREATE: 'answer_create',
    UPDATE: 'answer_update',
    DELETE: 'answer_delete',
    VOTE: 'answer_vote',
    ACCEPT: 'answer_accept',
  },
  COMMENT: {
    CREATE: 'comment_create',
    DELETE: 'comment_delete',
  },
  USER: {
    LOGIN: 'user_login',
    SIGNUP: 'user_signup',
    UPDATE_PROFILE: 'user_update_profile',
  }
}; 