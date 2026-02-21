import Layout from "../components/Layout";
import TopicCard from "../components/TopicCard";
import { TOPICS, type TopicId } from "../types";

interface HomePageProps {
  onSelectTopic: (id: TopicId) => void;
}

export default function HomePage({ onSelectTopic }: HomePageProps) {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h2 className="animate-float mb-3 text-6xl">🎯</h2>
          <h2 className="mb-2 text-3xl font-bold">!בואו נתרגל חשבון</h2>
          <p className="text-lg text-white/60">בחרו נושא והתחילו לשחק</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((topic) => (
            <TopicCard
              key={topic.id}
              icon={topic.icon}
              name={topic.name}
              description={topic.description}
              gradient={topic.gradient}
              onClick={() => onSelectTopic(topic.id)}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
