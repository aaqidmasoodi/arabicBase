import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Mic, Square, Sparkles, Loader2 } from 'lucide-react';
import type { Entry } from '../types/entry';
import { useStore } from '../store/useStore';
import { groqService } from '../services/groq';
import clsx from 'clsx';

interface EntryFormProps {
    initialEntry?: Entry;
    onClose: () => void;
}
const TYPES = ['word', 'phrase', 'idiom', 'slang', 'grammar', 'cultural', 'other'];
export const EntryForm: React.FC<EntryFormProps> = ({ initialEntry, onClose }) => {
    const { addEntry, updateEntry, dialects, categories } = useStore();
    const [formData, setFormData] = useState<Partial<Entry>>({
        term: '',
        transliteration: '',
        translation: '',
        dialect: dialects[0] || 'Levantine',
        category: categories[0] || 'Greeting',
        type: 'word',
        tags: [],
        notes: '',
    });
    const [tagInput, setTagInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isEnriching, setIsEnriching] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        if (initialEntry) {
            setFormData(initialEntry);
        }
    }, [initialEntry]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const entry: Entry = {
            ...formData as Entry,
            id: initialEntry?.id || crypto.randomUUID(),
            createdAt: initialEntry?.createdAt || Date.now(),
            updatedAt: Date.now(),
        };

        if (initialEntry) {
            await updateEntry(entry);
        } else {
            await addEntry(entry);
        }
        onClose();
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({ ...prev, tags: prev.tags?.filter(tag => tag !== tagToRemove) }));
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/mp4' }); // Whisper supports m4a/mp3/etc
                setIsTranscribing(true);
                try {
                    const text = await groqService.transcribeAudio(audioBlob);
                    setFormData(prev => ({ ...prev, term: text }));
                } catch (error) {
                    console.error('Transcription failed', error);
                    alert('Transcription failed. Check console for details.');
                } finally {
                    setIsTranscribing(false);
                }

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Could not access microphone.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleAiGenerate = async () => {
        if (!formData.term) return;

        setIsEnriching(true);
        try {
            const result = await groqService.getTranslationAndTransliteration(
                formData.term,
                formData.dialect,
                formData.category,
                formData.type
            );
            setFormData(prev => ({
                ...prev,
                translation: result.translation,
                transliteration: result.transliteration
            }));
        } catch (error) {
            console.error('AI generation failed', error);
        } finally {
            setIsEnriching(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4 backdrop-blur-md transition-all">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
                <div className="sticky top-0 bg-white/90 dark:bg-gray-900/90 p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center z-10 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                        {initialEntry ? 'Edit Entry' : 'New Entry'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Dialect</label>
                            <select
                                value={formData.dialect}
                                onChange={e => setFormData({ ...formData, dialect: e.target.value })}
                                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                            >
                                {dialects.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Type</label>
                        <div className="flex flex-wrap gap-2">
                            {TYPES.map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: type as Entry['type'] })}
                                    className={clsx(
                                        "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
                                        formData.type === type
                                            ? "bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20"
                                            : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    )}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Arabic Term</label>
                        <div className="relative group">
                            <input
                                type="text"
                                required
                                dir="rtl"
                                value={formData.term}
                                onChange={e => setFormData({ ...formData, term: e.target.value })}
                                className="w-full p-4 pl-24 text-2xl font-arabic rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all shadow-sm group-hover:shadow-md"
                                placeholder="Enter Arabic text..."
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-2">
                                <button
                                    type="button"
                                    onClick={isRecording ? stopRecording : startRecording}
                                    className={clsx(
                                        "p-2.5 rounded-full transition-all duration-300 shadow-sm",
                                        isRecording ? "bg-red-500 text-white animate-pulse shadow-red-500/30" : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                                    )}
                                    title="Record Audio"
                                >
                                    {isRecording ? <Square size={18} /> : <Mic size={18} />}
                                </button>
                            </div>
                        </div>
                        {isTranscribing && <p className="text-xs text-emerald-500 animate-pulse font-medium ml-1">Transcribing audio...</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Transliteration</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.transliteration}
                                    onChange={e => setFormData({ ...formData, transliteration: e.target.value })}
                                    className="w-full p-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                                    placeholder="e.g. Marhaba"
                                />
                                <button
                                    type="button"
                                    onClick={handleAiGenerate}
                                    disabled={isEnriching || !formData.term}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Generate with AI"
                                >
                                    {isEnriching ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Translation</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={formData.translation}
                                    onChange={e => setFormData({ ...formData, translation: e.target.value })}
                                    className="w-full p-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                                    placeholder="English meaning"
                                />
                                <button
                                    type="button"
                                    onClick={handleAiGenerate}
                                    disabled={isEnriching || !formData.term}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Generate with AI"
                                >
                                    {isEnriching ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>



                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Tags</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.tags?.map(tag => (
                                <span key={tag} className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg text-sm flex items-center border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                                    {tag}
                                    <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-gray-400 hover:text-red-500 transition-colors">×</button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                            placeholder="Type tag and press Enter"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all h-32 resize-none"
                            placeholder="Additional context, grammar notes, etc."
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 font-medium transform hover:-translate-y-0.5"
                        >
                            <Save size={20} />
                            Save Entry
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};
