import React, { useState,  useCallback } from "react";
import VoiceControl from "./VoiceControl";

interface RecipeInstructionsProps {
  instructions: string;
}

const RecipeInstructions: React.FC<RecipeInstructionsProps> = ({ instructions }) => {
  const steps = instructions.split("\n").filter((step) => step.trim() !== "");
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const playCurrentStep = useCallback(() => {
    if (!steps[currentStep]) return;
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(steps[currentStep]);
    window.speechSynthesis.speak(utterance);
    utterance.onend = () => setIsPlaying(false);
  }, [currentStep, steps]);

  const handleVoiceCommand = useCallback(
    (command: string) => {
      if (command === "play instruction") playCurrentStep();
      else if (command === "next") setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      else if (command === "previous") setCurrentStep((prev) => Math.max(prev - 1, 0));
    },
    [playCurrentStep, steps.length]
  );

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <VoiceControl onCommand={handleVoiceCommand} />
      <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Step {currentStep + 1} of {steps.length}</h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg transition-all duration-300 ${index === currentStep ? "bg-blue-500 text-white shadow-md" : "bg-gray-100 text-gray-800"}`}
          >
            {step}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <button className="btn" onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))} disabled={currentStep === 0}>
          ◀ Previous
        </button>
        <button className="btn btn-primary cursor-pointer" onClick={playCurrentStep} disabled={isPlaying}>
          🔊 Play
        </button>
        <button className="btn" onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))} disabled={currentStep === steps.length - 1}>
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default RecipeInstructions;
