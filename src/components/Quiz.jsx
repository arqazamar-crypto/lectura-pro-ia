export default function Quiz({ title, questions, answers, onAnswer }) {
  return (
    <section className="quiz">
      <div className="section-head">
        <h2>{title}</h2>
        <span>{questions.length} preguntas</span>
      </div>
      {questions.map((q, index) => (
        <article className="question" key={q.question}>
          <h3>{index + 1}. {q.question}</h3>
          <div className="options">
            {q.options.map((option, optionIndex) => (
              <button
                className={Number(answers[index]) === optionIndex ? 'option selected' : 'option'}
                key={option}
                onClick={() => onAnswer(index, optionIndex)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
