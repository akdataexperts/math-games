import { useState } from "react";
import type { Page, TopicId } from "./types";
import HomePage from "./pages/HomePage";
import ArithmeticGame from "./topics/arithmetic/ArithmeticGame";
import DistributionGame from "./topics/distribution/DistributionGame";
import TrianglesGame from "./topics/triangles/TrianglesGame";
import OrderOfOpsGame from "./topics/orderOfOps/OrderOfOpsGame";
import DecimalStructureGame from "./topics/decimalStructure/DecimalStructureGame";
import VerticalMathGame from "./topics/verticalMath/VerticalMathGame";

export default function App() {
  const [page, setPage] = useState<Page>({ type: "home" });

  const goHome = () => setPage({ type: "home" });
  const goToTopic = (topicId: TopicId) =>
    setPage({ type: "game", topicId });

  if (page.type === "home") {
    return <HomePage onSelectTopic={goToTopic} />;
  }

  switch (page.topicId) {
    case "arithmetic":
      return <ArithmeticGame onBack={goHome} />;
    case "distribution":
      return <DistributionGame onBack={goHome} />;
    case "triangles":
      return <TrianglesGame onBack={goHome} />;
    case "orderOfOps":
      return <OrderOfOpsGame onBack={goHome} />;
    case "decimalStructure":
      return <DecimalStructureGame onBack={goHome} />;
    case "verticalMath":
      return <VerticalMathGame onBack={goHome} />;
  }
}
