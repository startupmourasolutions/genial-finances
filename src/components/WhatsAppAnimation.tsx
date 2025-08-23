import React, { useState, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';

export const WhatsAppAnimation = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < 3) {
        setStep(step + 1);
      } else {
        // Restart animation after a pause
        setTimeout(() => setStep(0), 2000);
      }
    }, step === 0 ? 1000 : step === 1 ? 2000 : step === 2 ? 1000 : 3000);

    return () => clearTimeout(timer);
  }, [step]);

  return (
    <div className="relative max-w-xs mx-auto">
      {/* Phone Frame */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2.5rem] p-px shadow-2xl">
        <div className="bg-black rounded-[2.2rem] p-px">
          <div className="bg-white rounded-[2rem] overflow-hidden h-[520px] w-[260px] mx-auto relative">
            
            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10 flex items-center justify-center">
              <div className="w-12 h-1 bg-gray-800 rounded-full"></div>
            </div>

            {/* Status Bar */}
            <div className="bg-brand-green text-white px-6 py-4 pt-8 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Gênio Financeiro</h3>
                  <p className="text-xs opacity-80">online agora</p>
                </div>
              </div>
              <div className="text-xs opacity-80 font-medium">14:30</div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 p-4 space-y-4 h-[360px] overflow-hidden relative">
              {/* Welcome Message */}
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-md p-3 max-w-[200px] shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-800 leading-relaxed">
                    Olá! Envie suas transações de forma natural.
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">14:29</p>
                </div>
              </div>

              {/* User Input Animation */}
              {step >= 1 && (
                <div className={`flex justify-end transition-all duration-500 ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className="bg-gradient-to-r from-brand-green to-brand-green/90 text-white rounded-2xl rounded-tr-md p-3 max-w-[180px] shadow-md">
                    {step === 1 && (
                      <div className="flex items-center space-x-2">
                        <div className="animate-pulse text-xs font-medium">ganhei 1000 agora</div>
                        <div className="animate-spin">
                          <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                        </div>
                      </div>
                    )}
                    {step >= 2 && (
                      <>
                        <p className="text-xs font-medium">ganhei 1000 agora</p>
                        <div className="flex justify-end items-center space-x-1 mt-1">
                          <p className="text-[10px] opacity-80">14:30</p>
                          <div className="flex space-x-0.5">
                            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Typing Indicator */}
              {step === 2 && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-tl-md p-3 shadow-sm border border-gray-100">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Response */}
              {step >= 3 && (
                <div className={`flex justify-start transition-all duration-700 ${step >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className="bg-white rounded-2xl rounded-tl-md p-3 max-w-[210px] shadow-md border-l-4 border-brand-green">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse"></div>
                      <p className="text-[10px] font-bold text-brand-green uppercase tracking-wide">Sucesso</p>
                    </div>
                    <p className="text-xs text-gray-800 font-bold mb-1">
                      ✅ <span className="text-brand-green text-sm">R$ 1.000,00</span>
                    </p>
                    <div className="space-y-0.5 text-xs text-gray-600">
                      <p>💼 <span className="font-medium">Renda Extra</span></p>
                      <p>📅 <span className="font-medium">23/08/2024</span></p>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">14:30</p>
                  </div>
                </div>
              )}
            </div>

            {/* Typing Area - Shows when user is typing */}
            {step === 1 && (
              <div className="absolute bottom-16 left-4 right-4 bg-gray-100 rounded-full px-4 py-2 border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-gray-600 animate-pulse">digitando mensagem...</p>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-brand-green rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-brand-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-1 bg-brand-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex items-center space-x-3">
              <div className="flex-1 bg-gray-50 rounded-full px-4 py-2.5 border border-gray-200">
                <p className="text-xs text-gray-500 truncate">
                  {step === 1 ? "ganhei 1000 agora|" : "Mensagem..."}
                </p>
              </div>
              <button className={`p-2.5 rounded-full transition-all duration-200 ${step === 1 ? 'bg-brand-green text-white shadow-md scale-110' : 'bg-gray-100 text-gray-400'}`}>
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-3 -right-3 w-6 h-6 bg-brand-green/20 rounded-full animate-pulse blur-sm"></div>
      <div className="absolute -bottom-3 -left-3 w-4 h-4 bg-brand-orange/20 rounded-full animate-pulse blur-sm" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};