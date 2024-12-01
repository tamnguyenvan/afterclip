interface FAQCardProps {
  question: string;
  answer: string;
}

export function FAQCard({ question, answer }: FAQCardProps) {
  return (
    <div className="p-6 rounded-lg border border-border bg-card">
      <h3 className="text-xl font-semibold mb-2">{question}</h3>
      <p className="text-muted-foreground">{answer}</p>
    </div>
  );
}