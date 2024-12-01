import { FAQCard } from "../ui/faq-card";

export function FAQs() {
  const faqs = [
    {
      question: "What file formats are supported?",
      answer: "We support most common image formats including JPG, PNG, and WebP."
    },
    {
      question: "Is there a size limit for images?",
      answer: "For optimal performance, we recommend using images under 4000x4000 pixels."
    },
    {
      question: "How long are the generated animations?",
      answer: "Animations are approximately 2.5 seconds long, consisting of 75 frames at 30fps."
    }
  ];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <div className="space-y-6 max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <FAQCard
            key={index}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>
    </section>
  );
}