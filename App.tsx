
import React, { useState, useCallback } from 'react';
import { Search, FileCheck, AlertCircle, CheckCircle2, Info, Loader2, RefreshCw } from 'lucide-react';
import { ISO_SEGMENTS, VALID_EXTENSIONS } from './constants';
import { NamingResult, ValidationSegment } from './types';
import { analyzeFilenameWithAI } from './services/geminiService';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<NamingResult | null>(null);
  const [loading, setLoading] = useState(false);

  const validateFilename = useCallback(async (name: string) => {
    if (!name.trim()) return;
    setLoading(true);

    const fullParts = name.split('.');
    const extension = fullParts.length > 1 ? `.${fullParts.pop()?.toLowerCase()}` : '';
    const nameWithoutExt = fullParts.join('.');
    const segments = nameWithoutExt.split('-');

    const isExtensionValid = VALID_EXTENSIONS.includes(extension);
    
    const validatedSegments: ValidationSegment[] = ISO_SEGMENTS.map((config, index) => {
      const val = segments[index] || '';
      const isValid = config.pattern.test(val);
      return {
        name: config.label,
        value: val,
        isValid,
        expectedDescription: config.desc,
        errorMessage: !val ? 'مفقود' : !isValid ? 'تنسيق غير صحيح' : undefined
      };
    });

    const overallValid = isExtensionValid && 
                         validatedSegments.every(s => s.isValid) && 
                         segments.length === ISO_SEGMENTS.length;

    const result: NamingResult = {
      filename: nameWithoutExt,
      extension,
      isExtensionValid,
      segments: validatedSegments,
      overallValid,
    };

    setResults(result);

    // Call AI for deeper analysis
    const aiFeedback = await analyzeFilenameWithAI(name);
    setResults(prev => prev ? { ...prev, aiFeedback } : null);
    
    setLoading(false);
  }, []);

  const handleReset = () => {
    setInput('');
    setResults(null);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-slate-900 text-white py-8 px-4 shadow-lg border-b-4 border-blue-500">
        <div className="max-container mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-4">
            <FileCheck className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">مدقق تسمية الملفات ISO 19650</h1>
          <p className="text-slate-400">تحقق من مطابقة ملفات Revit و Navisworks للمعايير الدولية</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        {/* Input Section */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-2">أدخل اسم الملف الكامل (مع الامتداد):</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="PRJ-ORG-ZZ-XX-M3-AR-0001.rvt"
                className="w-full pl-4 pr-10 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all text-left"
                dir="ltr"
              />
              <Search className="absolute right-3 top-3.5 text-slate-400 w-5 h-5" />
            </div>
            <button
              onClick={() => validateFilename(input)}
              disabled={loading || !input}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تحقق'}
            </button>
            <button
              onClick={handleReset}
              className="p-3 text-slate-500 hover:bg-slate-100 rounded-lg transition-all"
              title="إعادة تعيين"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
          </div>
        </section>

        {results && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className={`p-4 rounded-lg flex items-center gap-4 ${results.overallValid ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
              {results.overallValid ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
              <div>
                <h3 className="font-bold text-lg">
                  {results.overallValid ? 'الملف مطابق للمعايير!' : 'الملف غير مطابق للمعايير'}
                </h3>
                <p className="text-sm opacity-90">
                  {results.overallValid ? 'تم التحقق من كافة الحقول والامتداد.' : 'يرجى مراجعة الحقول المشار إليها باللون الأحمر أدناه.'}
                </p>
              </div>
            </div>

            {/* Segments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.segments.map((seg, idx) => (
                <div key={idx} className={`p-4 rounded-lg border bg-white flex justify-between items-center transition-all ${seg.isValid ? 'border-slate-200' : 'border-red-300 shadow-sm shadow-red-50'}`}>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">{seg.name}</span>
                    <span className={`font-mono text-lg ${seg.isValid ? 'text-slate-900' : 'text-red-600 font-bold'}`}>
                      {seg.value || '---'}
                    </span>
                    {!seg.isValid && (
                      <div className="flex items-center gap-1 text-xs text-red-500 mt-1">
                        <Info className="w-3 h-3" />
                        <span>{seg.expectedDescription}</span>
                      </div>
                    )}
                  </div>
                  {seg.isValid ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
                </div>
              ))}
              
              {/* Extension Check */}
              <div className={`p-4 rounded-lg border bg-white flex justify-between items-center ${results.isExtensionValid ? 'border-slate-200' : 'border-red-300'}`}>
                <div>
                  <span className="text-xs text-slate-500 block mb-1">الامتداد (Extension)</span>
                  <span className={`font-mono text-lg ${results.isExtensionValid ? 'text-slate-900' : 'text-red-600 font-bold'}`}>
                    {results.extension || 'بدون امتداد'}
                  </span>
                  {!results.isExtensionValid && (
                    <p className="text-xs text-red-500 mt-1">يجب أن يكون .rvt, .nwc, .nwd, أو .nwf</p>
                  )}
                </div>
                {results.isExtensionValid ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
              </div>
            </div>

            {/* AI Analysis Section */}
            {results.aiFeedback && (
              <section className="bg-blue-50 border-r-4 border-blue-500 p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-blue-800 font-bold">
                  <div className="bg-blue-200 p-1 rounded">✨</div>
                  <h4>تحليل الذكاء الاصطناعي الذكي</h4>
                </div>
                <div className="prose prose-blue text-slate-700 leading-relaxed whitespace-pre-line">
                  {results.aiFeedback}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Reference Section */}
        <section className="mt-12 p-6 bg-slate-100 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            دليل التسمية السريع (ISO 19650)
          </h3>
          <div className="text-sm text-slate-600 space-y-2">
            <p>يتكون اسم الملف من 7 أجزاء رئيسية مفصولة بشرطة (-):</p>
            <ol className="list-decimal list-inside space-y-1 pr-4">
              <li><strong>رمز المشروع:</strong> معرف فريد للمشروع.</li>
              <li><strong>المنشئ:</strong> كود الشركة أو الجهة المصدرة.</li>
              <li><strong>المجلد:</strong> كود المنطقة أو النظام الفرعي.</li>
              <li><strong>المستوى:</strong> كود الطابق (مثلاً GF, 01, ZZ).</li>
              <li><strong>النوع:</strong> نوع المعلومة (مثلاً M3 للنماذج، DR للرسومات).</li>
              <li><strong>الدور:</strong> التخصص (مثلاً AR, ST, ME).</li>
              <li><strong>الرقم:</strong> تسلسل رقمي فريد.</li>
            </ol>
          </div>
        </section>
      </main>

      {/* Sticky Call to Action */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg flex justify-center items-center gap-4 z-50">
        <span className="text-xs text-slate-500 font-medium">مدعوم بواسطة Gemini AI</span>
        <div className="h-4 w-px bg-slate-200"></div>
        <a href="https://www.iso.org/standard/68078.html" target="_blank" className="text-blue-600 text-xs font-bold hover:underline">
          رابط المعيار الرسمي
        </a>
      </footer>
    </div>
  );
};

export default App;
