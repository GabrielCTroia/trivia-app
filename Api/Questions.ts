import R from 'ramda';
import md5 from 'md5';

export type Question = {
  id: string,
  category: string;
  title: string;
  correctAnswer: boolean;
}

const stringToBoolean = (s: string) => {
  switch (s.toLowerCase()) {
    case 'true':
      return true;
    case 'false':
      return false;
    default: return Boolean(s);
  }
}

const normalize = (raw: any): Question => {
  const title = raw.question as string || '';

  return {
    // Create a uniq id based on the question's content
    // This will make handling UI easier.
    id: md5(title),

    title,
    category: raw.category as string || '',
    correctAnswer: stringToBoolean(String(raw.correct_answer)),
  }
};

export const getQuestions = () => fetch('https://opentdb.com/api.php?amount=10&difficulty=hard&type=boolean', {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})
  .then((response) => response.json())
  .then(({ results }: any) => results)
  .then(R.map(normalize));

const groupQuestionsByCategory = (questions: Question[]) => R.groupBy<Question>((q) => q.category, questions)

export const getQuestionsByCategory = () => getQuestions().then(groupQuestionsByCategory);
