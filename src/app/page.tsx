'use client';

import React, { useState, useEffect } from 'react';
import { TbCut } from "react-icons/tb";
import { GiNotebook } from "react-icons/gi";
import { BiTrash } from "react-icons/bi";

interface Note {
  id: string;
  text: string;
  font: string;
  bgColor: string;
  textColor: string;
  mood: string;
  rotation: number;
  pinColor: string;
  date: string;
}



const fonts = [
  'Amatic SC, cursive',
  'Gloria Hallelujah, cursive',
  'Handlee, cursive',
  'Patrick Hand, cursive',
  'Annie Use Your Telescope, cursive',
  'Coming Soon, cursive',
  'Crafty Girls, cursive',
  'Fontdiner Swanky, cursive',
  'Schoolbell, cursive',
  'Special Elite, serif',
];

const backgroundColors = [
  '#FFFACD',
  '#E6E6FA',
  '#F0FFF0',
  '#FFE4E1',
  '#E0FFFF',
  '#F5F5DC',
  '#F0E68C',
  '#FFF5EE',
  '#F5FFFA',
  '#FAF0E6',
];

const textColors = [
  '#2F2F2F', 
  '#4B0082',
  '#006400',
  '#8B0000', 
  '#483D8B',
  '#2E8B57',
  '#8A2BE2',
  '#A52A2A',
  '#556B2F', 
  '#4682B4', 
];

const moods = [
  '🌟 Inspired',
  '🌈 Joyful',
  '🕊️ Peaceful',
  '🔥 Passionate',
  '🌙 Reflective',
  '⚡ Dynamic',
  '🍃 Serene',
  '🎉 Festive',
  '📚 Thoughtful',
  '🌺 Cheerful',
];

const pinColors = ['#FF4500', '#8A2BE2', '#228B22', '#FFD700', '#2F4F4F'];

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [createButtonText, setCreateButtonText] = useState('Create Sticky Note');

  useEffect(() => {
    const savedNotes = localStorage.getItem('sticky-notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Error loading saved notes:', e);
      }
    }
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('sticky-notes', JSON.stringify(notes));
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [notes]);

  const getRandomItem = (array: string[]) => array[Math.floor(Math.random() * array.length)];
  const getRandomRotation = () => Math.floor(Math.random() * 12) - 6;
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const createNote = (text: string) => {
    if (!text.trim()) return;

    const newNote: Note = {
      id: generateId(),
      text,
      font: getRandomItem(fonts),
      bgColor: getRandomItem(backgroundColors),
      textColor: getRandomItem(textColors),
      mood: getRandomItem(moods),
      rotation: getRandomRotation(),
      pinColor: getRandomItem(pinColors),
      date: new Date().toISOString(),
    };

    setNotes([newNote, ...notes]);
    setNoteText('');

    setCreateButtonText('Created!');
    setTimeout(() => setCreateButtonText('Create Sticky Note'), 1500);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const clearAllNotes = () => {
    if (notes.length === 0) return;
    if (confirm('Are you sure you want to delete all notes?')) {
      setNotes([]);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, note: Note) => {
    e.dataTransfer.setData('text/plain', note.id);
    e.currentTarget.style.opacity = '0.4';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetNote: Note) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    const draggedNote = notes.find((note) => note.id === draggedId);
    if (!draggedNote || draggedNote.id === targetNote.id) return;

    const draggedIndex = notes.findIndex((note) => note.id === draggedId);
    const targetIndex = notes.findIndex((note) => note.id === targetNote.id);
    const newNotes = [...notes];
    const [movedNote] = newNotes.splice(draggedIndex, 1);
    newNotes.splice(targetIndex, 0, movedNote);
    setNotes(newNotes);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';
  };

  return (
    <>
      <div
        className={`fixed inset-0 flex items-center justify-center bg-gray-100 z-50 transition-opacity duration-500 ${
          isLoading ? 'opacity-100' : 'opacity-0 invisible'
        }`}
      >
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-transparent border-t-green-500 rounded-full animate-spin" />
          <div className="absolute inset-0 border-4 border-transparent border-t-green-500 rounded-full animate-spin animation-delay-[-0.45s]" />
          <div className="absolute inset-0 border-4 border-transparent border-t-green-500 rounded-full animate-spin animation-delay-[-0.3s]" />
          <div className="absolute inset-0 border-4 border-transparent border-t-green-500 rounded-full animate-spin animation-delay-[-0.15s]" />
        </div>
      </div>

      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute w-20 h-20 bg-white/40 rounded-full blur-[15px] animate-[float_15s_infinite_ease-in-out] opacity-30 top-[10%] left-[10%]" />
        <div className="absolute w-20 h-20 bg-white/40 rounded-full blur-[15px] animate-[float_15s_infinite_ease-in-out_-3s] opacity-30 top-[70%] left-[20%]" />
        <div className="absolute w-20 h-20 bg-white/40 rounded-full blur-[15px] animate-[float_15s_infinite_ease-in-out_-6s] opacity-30 top-[40%] left-[80%]" />
        <div className="absolute w-20 h-20 bg-white/40 rounded-full blur-[15px] animate-[float_15s_infinite_ease-in-out_-9s] opacity-30 top-[60%] left-[50%]" />
        <div className="absolute w-20 h-20 bg-white/40 rounded-full blur-[15px] animate-[float_15s_infinite_ease-in-out_-12s] opacity-30 top-[20%] left-[60%]" />
      </div>

      <div className="w-full max-w-5xl relative">

        <div className="mb-8 text-center relative z-10">
          <h1 className="text-5xl text-gray-800 mb-2 font-bold tracking-tighter font-['Madimi One'] drop-shadow-sm">
          PinItUp
          </h1>
          <p className="text-gray-600 font-['Madimi One'] tracking-wide">
          Design unique and expressive notes with diverse fonts, themes, and vibes.
          </p>
        </div>

        <div className="bg-white/80 p-8 rounded-4xl shadow-lg backdrop-blur-md border border-green/20 mb-8 transition-transform duration-400 hover:-translate-y-1">
          <div className="flex gap-4 mb-4">
            <textarea
              id="note-input"
              placeholder="Type your note, affirmation, or brain dump here..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  createNote(noteText);
                }
              }}
              className="flex-1 p-4 border-2 border-green-200 rounded-4xl resize-y min-h-[120px] text-lg bg-white/90 transition-all duration-300 focus:outline-none focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(74,111,165,0.2)] focus:scale-[1.01] font-['Madimi One'] tracking-wide"
            />
          </div>
          <div className="flex justify-between gap-4 flex-col sm:flex-row">
            <button
              onClick={() => createNote(noteText)}
              className={`flex items-center justify-center gap-2 bg-green-700 text-white border-none py-3 px-6 rounded-2xl font-bold text-base tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:shadow-md font-['Madimi One'] ${
                createButtonText === 'Created!' ? 'bg-green-500' : 'bg-green-700'
              }`}
            >
              <i
                className={`fas fa-plus-circle transition-transform duration-300 ${
                  createButtonText === 'Create Sticky Note' ? 'hover:rotate-90 hover:scale-125' : ''
                } ${createButtonText === 'Created!' ? 'fas fa-check' : ''}`}
              />
              {createButtonText}
            </button>
            <button
              onClick={clearAllNotes}
              className="flex flex-wrap gap-2 justify-center bg-cyan-500 text-white border-none py-3 px-6 rounded-2xl font-bold text-base tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:shadow-md font-['Madimi One']"
            >
              <BiTrash className='w-5.5 h-5.5'/> Clear All
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-8 justify-center p-4">
          {notes.length === 0 ? (
            <div className="text-center opacity-50 my-12">
              <GiNotebook className='fas fa-sticky-note text-5xl mb-4'/>
              <p>No sticky notes yet. Create new one!</p>
            </div>
          ) : (
            notes.map((note, index) => (
              <div
                key={note.id}
                draggable
                onDragStart={(e) => handleDragStart(e, note)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, note)}
                onDragEnd={handleDragEnd}
                className="relative w-64 min-h-64 p-6 shadow-lg transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] break-words flex flex-col rounded-md animate-[appear_0.5s_forwards_cubic-bezier(0.175,0.885,0.32,1.275)] opacity-0 cursor-grab hover:-translate-y-2 hover:shadow-xl hover:scale-105 active:cursor-grabbing"
                style={{
                  backgroundColor: note.bgColor,
                  color: note.textColor,
                  fontFamily: note.font,
                  transform: `rotate(${note.rotation}deg)`,
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div
                  className="absolute w-3 h-3 rounded-full top-2 left-1/2 -translate-x-1/2 shadow-md z-10"
                  style={{ backgroundColor: note.pinColor }}
                >
                  <div className="absolute w-1.5 h-1.5 rounded-full bg-white/50 top-0.5 left-0.5" />
                </div>
                <div className="flex-1 mb-4 relative z-10 leading-relaxed">{note.text}</div>
                <div className="text-xs self-end italic opacity-70 relative z-10 px-2 py-1 rounded-lg bg-white/30">
                  {note.mood}
                </div>
                <div className="absolute bottom-2 left-2 text-[0.7rem] opacity-50">{formatDate(note.date)}</div>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="absolute top-3 right-3  cursor-pointer"
                >
                  <TbCut className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}