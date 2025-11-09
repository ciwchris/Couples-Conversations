import React, { useState } from 'react';

interface ScriptDisplayProps {
  script: string;
}

const ScriptDisplay: React.FC<ScriptDisplayProps> = ({ script }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const lines = script.split('\n').filter(line => line.trim() !== '');
  const switchIndex = lines.findIndex(line => line.startsWith('Partner B (Speaker):'));

  const renderLine = (line: string, index: number) => {
    const match = line.match(/^(Partner [A|B] \((Speaker|Listener)\):)/);
    if (match) {
      const speakerPart = match[0];
      const restOfLine = line.substring(speakerPart.length);
      const isPartnerA = speakerPart.includes('Partner A');
      const isActive = activeIndex === index;

      return (
        <div key={index} className={`flex flex-col sm:flex-row items-start ${isPartnerA ? '' : 'sm:justify-end'}`}>
          <div
            onClick={() => setActiveIndex(index)}
            className={`max-w-md p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
              isPartnerA
                ? 'bg-indigo-100 text-gray-800 rounded-bl-none'
                : 'bg-teal-100 text-gray-800 rounded-br-none sm:text-right'
            } ${
              isActive ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
            }`}
          >
            <p className={`font-bold ${isPartnerA ? 'text-indigo-700' : 'text-teal-700'}`}>{speakerPart}</p>
            <p className="mt-1">{restOfLine.trim()}</p>
          </div>
        </div>
      );
    }
    return <p key={index} className="mb-2">{line}</p>;
  };

  const separator = (
    <div className="flex items-center py-4">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="flex-shrink mx-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Roles Switch</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="space-y-4">
        {lines.map((line, index) => (
          <React.Fragment key={index}>
            {index === switchIndex && separator}
            {renderLine(line, index)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ScriptDisplay;
