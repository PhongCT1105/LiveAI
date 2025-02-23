import React, { useEffect, useState } from "react";

interface VoiceControlProps {
  onCommand: (command: string) => void;
}

interface MySpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: MySpeechRecognitionEvent) => {
      let transcript = event.results[event.resultIndex][0].transcript.toLowerCase();
      console.log("Voice Input:", transcript);
      if (transcript.includes("play instruction")) onCommand("play instruction");
      else if (transcript.includes("next")) onCommand("next");
      else if (transcript.includes("previous")) onCommand("previous");
    };

    recognition.start();
    return () => recognition.stop();
  }, [onCommand]);

  return (
    isListening && (
      <div className="fixed bottom-6 right-6 flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg animate-pulse">
        🎤
      </div>
    )
  );
};

export default VoiceControl;
