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
    <div className="relative max-w-sm mx-auto">
      {/* Phone Frame */}
      <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
        <div className="bg-black rounded-[2rem] p-1">
          <div className="bg-white rounded-[1.5rem] overflow-hidden h-[600px] relative">
            {/* Status Bar */}
            <div className="bg-brand-green text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Gênio Financeiro</h3>
                  <p className="text-xs opacity-80">online</p>
                </div>
              </div>
              <div className="text-xs opacity-80">14:30</div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-gray-50 p-4 space-y-4 h-[500px] overflow-hidden relative">
              {/* Welcome Message */}
              <div className="flex justify-start">
                <div className="bg-white rounded-lg p-3 max-w-xs shadow-sm">
                  <p className="text-sm text-gray-800">
                    Olá! Envie suas transações de forma natural que eu registro automaticamente.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">14:29</p>
                </div>
              </div>

              {/* User Input Animation */}
              {step >= 1 && (
                <div className={`flex justify-end transition-all duration-500 ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className="bg-brand-green text-white rounded-lg p-3 max-w-xs">
                    {step === 1 && (
                      <div className="flex items-center space-x-2">
                        <div className="animate-pulse">ganhei 1000 agora</div>
                        <div className="animate-spin">
                          <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                        </div>
                      </div>
                    )}
                    {step >= 2 && (
                      <>
                        <p className="text-sm">ganhei 1000 agora</p>
                        <div className="flex justify-end items-center space-x-1 mt-1">
                          <p className="text-xs opacity-80">14:30</p>
                          <div className="flex space-x-1">
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
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Response */}
              {step >= 3 && (
                <div className={`flex justify-start transition-all duration-700 ${step >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className="bg-white rounded-lg p-3 max-w-xs shadow-sm border-l-4 border-brand-green">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                      <p className="text-xs font-semibold text-brand-green">Transação Registrada</p>
                    </div>
                    <p className="text-sm text-gray-800 font-medium">
                      ✅ <span className="text-brand-green font-bold">R$ 1.000,00</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Categoria: <span className="font-medium">Renda Extra</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Data: <span className="font-medium">23/08/2024</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">14:30</p>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="bg-white border-t p-3 flex items-center space-x-3">
              <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
                <p className="text-sm text-gray-500 truncate">
                  {step === 1 ? "ganhei 1000 agora|" : "Digite sua mensagem..."}
                </p>
              </div>
              <button className={`p-2 rounded-full transition-colors ${step === 1 ? 'bg-brand-green text-white' : 'bg-gray-100'}`}>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-4 -right-4 w-8 h-8 bg-brand-green/20 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-brand-orange/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};