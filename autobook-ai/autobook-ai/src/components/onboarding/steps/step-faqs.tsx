'use client';

interface Props {
  formData: any;
  updateForm: (data: any) => void;
}

export function StepFaqs({ formData, updateForm }: Props) {
  const addFaq = () => {
    updateForm({ faqs: [...formData.faqs, { question: '', answer: '' }] });
  };

  const removeFaq = (index: number) => {
    const faqs = formData.faqs.filter((_: any, i: number) => i !== index);
    updateForm({ faqs: faqs.length ? faqs : [{ question: '', answer: '' }] });
  };

  const updateFaq = (index: number, field: string, value: string) => {
    const faqs = [...formData.faqs];
    faqs[index] = { ...faqs[index], [field]: value };
    updateForm({ faqs });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">FAQs</h2>
        <p className="mt-1 text-gray-600">Add common questions so your AI can answer them on calls.</p>
      </div>

      <div className="space-y-4">
        {formData.faqs.map((faq: any, i: number) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="mb-3 flex items-start justify-between">
              <span className="text-sm font-medium text-gray-500">FAQ #{i + 1}</span>
              <button
                onClick={() => removeFaq(i)}
                className="text-gray-400 hover:text-red-500"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              <input
                type="text"
                value={faq.question}
                onChange={(e) => updateFaq(i, 'question', e.target.value)}
                className="input-field text-sm"
                placeholder="Question, e.g., Do you accept walk-ins?"
              />
              <textarea
                value={faq.answer}
                onChange={(e) => updateFaq(i, 'answer', e.target.value)}
                className="input-field text-sm"
                rows={2}
                placeholder="Answer..."
              />
            </div>
          </div>
        ))}
      </div>

      <button onClick={addFaq} className="btn btn-secondary text-sm">
        + Add FAQ
      </button>
    </div>
  );
}
