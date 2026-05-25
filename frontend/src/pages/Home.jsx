import { useState } from "react";

import PromptForm from "../components/PromptForm";
import ResponseCard from "../components/ResponseCard";

import { generateAIResponse } from "../services/api";

function Home() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (prompt) => {
    try {
        setLoading(true);
        setError("");
        setResponse("");

      const aiResponse = await generateAIResponse(prompt);

      setResponse(aiResponse);
    } catch (error) {
  setResponse(error.message || "Failed to get AI response.");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          AI Developer Toolbox
        </h1>

        <PromptForm 
            onSubmit={handleSubmit}
            loading={loading}
        />

        <div className="mt-8">
            {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl mb-4">
              {error}
            </div>
          )}
          
          <ResponseCard response={response} />
        </div>
      </div>
    </div>
  );
}

export default Home;